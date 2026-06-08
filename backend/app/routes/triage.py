from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.triage_history import TriageHistory
from app.schemas.triage import TriageRequest, TriageResponse, TriageHistoryResponse
from app.ml.predict import predict_disease
from app.auth.jwt_handler import decode_access_token
from app.models.user import User
from fastapi.security import OAuth2PasswordBearer
from typing import List

router = APIRouter(prefix="/triage", tags=["Triage"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    email = decode_access_token(token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user

@router.post("/predict", response_model=TriageResponse)
def predict(
    request: TriageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not request.symptoms:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No symptoms provided"
        )

    result = predict_disease(request.symptoms)

    # Save to history
    history = TriageHistory(
        user_id=current_user.id,
        symptoms=request.symptoms,
        predicted_disease=result["predicted_disease"],
        severity=result["severity"],
        top_reasons=result["top_reasons"]
    )
    db.add(history)
    db.commit()

    return {
        "predicted_disease": result["predicted_disease"],
        "severity": result["severity"],
        "top_reasons": result["top_reasons"],
        "nearby_facilities": []
    }

@router.get("/history", response_model=List[TriageHistoryResponse])
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    history = db.query(TriageHistory)\
        .filter(TriageHistory.user_id == current_user.id)\
        .order_by(TriageHistory.created_at.desc())\
        .all()
    return history