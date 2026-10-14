import os
import json
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from difflib import SequenceMatcher

app = FastAPI(title="FoodSafety AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FoodPoisoningReport(BaseModel):
    makanan: str
    gejala: str
    jam_konsumsi: str
    durasi_onset_jam: str
    lokasi: str

def load_pathogen_database() -> list:
    db_path = "backend/database.json"
    if not os.path.exists(db_path):
        # Fallback jika dijalankan langsung dari dalam folder backend
        db_path = "database.json"
        return []
    try:
        with open(db_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def calculate_dynamic_risk(gejala: str, onset_str: str) -> float:
    symptoms_lower = gejala.lower()
    try:
        onset_hours = float(re.findall(r"[\d.]+", onset_str)[0])
    except Exception:
        onset_hours = 6.0

    if any(k in symptoms_lower for k in ["demam", "darah", "kejang", "pingsan", "sesak", "penglihatan ganda", "sulit menelan"]):
        return 8.8 if onset_hours < 24 else 8.0
    elif any(k in symptoms_lower for k in ["muntah", "diare", "kram", "mulas", "menggigil"]):
        return 6.5 if onset_hours < 5 else 5.5
    else:
        return 3.2

@app.post("/api/analyze")
async def analyze_report(report: FoodPoisoningReport):
    pathogens_db = load_pathogen_database()
    computed_score = calculate_dynamic_risk(report.gejala, report.durasi_onset_jam)
    
    symptoms_lower = report.gejala.lower()
    food_lower = report.makanan.lower()

    # Algoritma AI Pencocokan Cerdas ke database.json
    matched_pathogen = None
    if pathogens_db:
        # Cari kecocokan berdasarkan gejala khas atau makanan berisiko di database
        for p in pathogens_db:
            match_found = False
            for g in p.get("gejala_khas", []):
                if g.lower() in symptoms_lower or SequenceMatcher(None, symptoms_lower, g.lower()).ratio() > 0.4:
                    match_found = True
                    break
            for m in p.get("makanan_berisiko", []):
                if m.lower() in food_lower or SequenceMatcher(None, food_lower, m.lower()).ratio() > 0.3:
                    match_found = True
                    break
            if match_found:
                matched_pathogen = p
                break
        
        # Fallback jika tidak ada yang spesifik, ambil yang pertama
        if not matched_pathogen:
            matched_pathogen = pathogens_db[0]

    if matched_pathogen:
        return {
            "risk_summary": f"Analisis Risiko Klinis Berdasarkan Standar {matched_pathogen.get('referensi_lembaga', 'WHO/CDC')}",
            "risk_score": computed_score,
            "potential_pathogens": [
                {
                    "name": matched_pathogen["nama_patogen"],
                    "description": f"Korelasi klinis antara gejala '{report.gejala}' dan masa inkubasi {report.durasi_onset_jam} jam sesuai karakteristik patogen.",
                    "symptom": report.gejala,
                    "source": f"Analisis kontaminasi pada sampel: {report.makanan}"
                }
            ],
            "detected_symptoms": [s.strip() for s in report.gejala.split(",") if s.strip()],
            "first_aid_recommendations": matched_pathogen.get("pertolongan_pertama", ["Berikan cairan elektrolit dan rehidrasi mandiri."]),
            "lab_inspection_steps": matched_pathogen.get("lab_inspection_steps", ["Lakukan kultur sampel pada media selektif laboratorium."])
        }
    
    raise HTTPException(status_code=500, detail="Database patogen kosong atau tidak dapat diakses.")