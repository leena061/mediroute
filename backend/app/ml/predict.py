import joblib
import json
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

rf_model = joblib.load(os.path.join(BASE_DIR, "rf_model.pkl"))
le = joblib.load(os.path.join(BASE_DIR, "label_encoder.pkl"))

with open(os.path.join(BASE_DIR, "symptom_columns.json"), "r") as f:
    symptom_columns = json.load(f)

SEVERITY_MAP = {
    "Fungal infection": "Low", "Allergy": "Low", "GERD": "Low",
    "Chronic cholestasis": "Medium", "Drug Reaction": "Medium",
    "Peptic ulcer diseae": "Medium", "AIDS": "High", "Diabetes": "Medium",
    "Gastroenteritis": "Low", "Bronchial Asthma": "Medium",
    "Hypertension": "High", "Migraine": "Low", "Cervical spondylosis": "Low",
    "Paralysis (brain hemorrhage)": "High", "Jaundice": "Medium",
    "Malaria": "High", "Chicken pox": "Low", "Dengue": "High",
    "Typhoid": "High", "hepatitis A": "Medium", "Hepatitis B": "High",
    "Hepatitis C": "High", "Hepatitis D": "High", "Hepatitis E": "Medium",
    "Alcoholic hepatitis": "High", "Tuberculosis": "High",
    "Common Cold": "Low", "Pneumonia": "High",
    "Dimorphic hemmorhoids(piles)": "Low", "Heart attack": "High",
    "Varicose veins": "Low", "Hypothyroidism": "Medium",
    "Hyperthyroidism": "Medium", "Hypoglycemia": "High",
    "Osteoarthristis": "Low", "Arthritis": "Low",
    "(vertigo) Paroymsal  Positional Vertigo": "Low", "Acne": "Low",
    "Urinary tract infection": "Medium", "Psoriasis": "Low", "Impetigo": "Low"
}

def predict_disease(symptoms: list):
    input_vector = np.zeros(len(symptom_columns))
    matched_symptoms = []

    for symptom in symptoms:
        symptom_clean = symptom.lower().strip().replace(" ", "_")
        if symptom_clean in symptom_columns:
            idx = symptom_columns.index(symptom_clean)
            input_vector[idx] = 1
            matched_symptoms.append(symptom_clean)

    prediction_enc = rf_model.predict([input_vector])[0]
    predicted_disease = le.inverse_transform([prediction_enc])[0]
    severity = SEVERITY_MAP.get(predicted_disease, "Medium")

    proba = rf_model.predict_proba([input_vector])[0]
    confidence = round(float(proba[prediction_enc]) * 100, 1)

    importances = rf_model.feature_importances_
    symptom_scores = {
        sym: importances[symptom_columns.index(sym)]
        for sym in matched_symptoms
        if sym in symptom_columns
    }
    top_reasons = sorted(symptom_scores, key=symptom_scores.get, reverse=True)[:3]
    top_reasons_clean = [s.replace("_", " ").title() for s in top_reasons]

    return {
        "predicted_disease": predicted_disease,
        "severity": severity,
        "top_reasons": top_reasons_clean,
        "confidence": confidence
    }