from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class TriageRequest(BaseModel):
    symptoms: List[str]

class TriageResponse(BaseModel):
    predicted_disease: str
    severity: str
    top_reasons: List[str]
    confidence: float
    nearby_facilities: List[dict]

class TriageHistoryResponse(BaseModel):
    id: int
    symptoms: list
    predicted_disease: str
    severity: str
    top_reasons: Optional[list]
    created_at: datetime

    class Config:
        from_attributes = True