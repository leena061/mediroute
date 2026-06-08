from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, triage, facilities

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MediRoute API",
    description="Symptom Triage & Hospital Navigator",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router)
app.include_router(triage.router)
app.include_router(facilities.router)

@app.get("/")
def root():
    return {"message": "MediRoute API is running 🚀"}