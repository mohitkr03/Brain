import os
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import List, Dict, Any

from core.data_models import (
    PatientInput, PreprocessingResponse, Module1OptimizationResponse,
    Module2SNNResponse, Module3Response, Module4Response,
    EvaluationResponse, FinalPipelineResponse,
    ImageAnalysisResult, DemoScanItem
)
from services.module1_preprocessing import run_module1_preprocessing
from services.module1_optimization import run_module1_evolutionary_optimization
from services.module2_snn import run_module2_snn_prediction
from services.module3_xai import run_module3_xai
from services.module4_fusion import run_module4_fusion
from services.evaluation_service import get_performance_evaluation
from services.image_analysis_service import (
    get_demo_scans_list, analyze_brain_image, DEMO_SCANS_DIR
)

app = FastAPI(
    title="SNN Multimodal Brain Age Prediction & XAI Platform",
    description="SNN-Based Brain Age Prediction, Evolutionary Optimization (GA+CSA), XAI, and Vision Analysis",
    version="2.0.0"
)

# Enable CORS for frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static demo scans folder
if os.path.exists(DEMO_SCANS_DIR):
    app.mount("/demo_scans", StaticFiles(directory=DEMO_SCANS_DIR), name="demo_scans")

# Pre-configured clinical presets
PRESET_PATIENTS = [
    PatientInput(
        id="PAT-01",
        name="Eleanor Vance (Accelerated Aging / aMCI)",
        chronological_age=68.0,
        gender="Female",
        clinical_status="Accelerated Aging",
        smri_quality=0.94,
        fmri_quality=0.89,
        dmri_quality=0.86,
        hippocampal_volume_ratio=0.74,
        ventricular_volume_ratio=1.65
    ),
    PatientInput(
        id="PAT-02",
        name="Marcus Hayes (Healthy Normal Control)",
        chronological_age=45.0,
        gender="Male",
        clinical_status="Healthy",
        smri_quality=0.98,
        fmri_quality=0.95,
        dmri_quality=0.93,
        hippocampal_volume_ratio=1.01,
        ventricular_volume_ratio=0.98
    ),
    PatientInput(
        id="PAT-03",
        name="Dr. Arthur Pendelton (Super-Ager)",
        chronological_age=74.0,
        gender="Male",
        clinical_status="Super-Ager",
        smri_quality=0.96,
        fmri_quality=0.94,
        dmri_quality=0.92,
        hippocampal_volume_ratio=1.12,
        ventricular_volume_ratio=0.86
    )
]

@app.get("/")
def read_root():
    return {
        "platform": "SNN-Based Multimodal Brain Age Prediction & XAI",
        "status": "online",
        "architecture": [
            "Module 1 — Evolutionary Optimization (GA + CSA)",
            "Module 2 — SNN-Based Brain Age Prediction (Spiking Neural Network)",
            "Module 3 — Explainable AI (Attention + SHAP + Saliency + Permutation)",
            "Module 4 — Advanced Multimodal Learning (sMRI + fMRI + dMRI -> SNN Fusion -> Brain Age & BAG)",
            "Vision Engine — Brain Image Upload & Automated Morphometric Analysis",
            "Demonstration Library — 6 Realistic Clinical Scans"
        ]
    }

# --- Image Upload & Analysis Endpoints ---
@app.get("/api/image/demo-list", response_model=List[DemoScanItem])
def api_get_demo_list():
    return get_demo_scans_list()

@app.post("/api/image/analyze-demo/{demo_id}", response_model=ImageAnalysisResult)
def api_analyze_demo(demo_id: str):
    demos = get_demo_scans_list()
    found = next((d for d in demos if d.id == demo_id), None)
    if not found:
        raise HTTPException(status_code=404, detail="Demo scan not found")
    
    file_path = os.path.join(DEMO_SCANS_DIR, found.filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"File {found.filename} not found on disk")
        
    with open(file_path, "rb") as f:
        content = f.read()
    return analyze_brain_image(content, found.filename)

@app.post("/api/image/upload", response_model=ImageAnalysisResult)
async def api_upload_image(file: UploadFile = File(...)):
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")
    return analyze_brain_image(contents, file.filename or "uploaded_brain_scan.png")

# --- Patient & Module Endpoints ---
@app.get("/api/patients/presets", response_model=List[PatientInput])
def get_preset_patients():
    return PRESET_PATIENTS

# Preprocessing Foundation
@app.post("/api/module1/preprocess", response_model=PreprocessingResponse)
def api_module_preprocess(patient: PatientInput):
    return run_module1_preprocessing(patient)

# Module 1: Evolutionary Optimization (GA + CSA)
@app.post("/api/module1/optimization", response_model=Module1OptimizationResponse)
def api_module1_optimization(patient: PatientInput):
    return run_module1_evolutionary_optimization(patient)

# Module 2: SNN-Based Brain Age Prediction
@app.post("/api/module2/snn", response_model=Module2SNNResponse)
def api_module2_snn(patient: PatientInput):
    return run_module2_snn_prediction(patient)

# Backward-compatibility alias for Module 2
@app.post("/api/module2/optimize", response_model=Module2SNNResponse)
def api_module2_optimize_legacy(patient: PatientInput):
    return run_module2_snn_prediction(patient)

# Module 3: Explainable AI
@app.post("/api/module3/xai", response_model=Module3Response)
def api_module3_xai(patient: PatientInput):
    return run_module3_xai(patient)

# Module 4: Advanced Multimodal Learning (SNN Fusion)
@app.post("/api/module4/fusion", response_model=Module4Response)
def api_module4_fusion(patient: PatientInput):
    return run_module4_fusion(patient)

# Performance Evaluation
@app.get("/api/evaluation/metrics", response_model=EvaluationResponse)
def api_evaluation_metrics():
    return get_performance_evaluation()

# Full End-to-End SNN Pipeline
@app.post("/api/pipeline/run", response_model=FinalPipelineResponse)
def api_run_full_pipeline(patient: PatientInput):
    pre = run_module1_preprocessing(patient)
    m1_opt = run_module1_evolutionary_optimization(patient)
    m2_snn = run_module2_snn_prediction(patient)
    m3 = run_module3_xai(patient)
    m4 = run_module4_fusion(patient)
    eval_data = get_performance_evaluation()

    summary = {
        "chronological_age": patient.chronological_age,
        "predicted_brain_age": m4.final_predicted_age,
        "corrected_brain_age": m4.final_corrected_age,
        "brain_age_delta": m4.final_bag,
        "classification": m2_snn.delta_classification,
        "snn_energy_efficiency": f"{m2_snn.energy_metrics.energy_efficiency_gain_x}x Reduction ({m2_snn.energy_metrics.energy_consumption_uj} uJ vs {m2_snn.energy_metrics.ann_energy_uj} uJ in ANN)",
        "top_important_regions": [r.region_name for r in m3.top_important_regions[:4]],
        "top_permutation_features": [p.feature_name for p in m3.permutation_importance[:3]],
        "modality_contributions": {
            item.modality: f"{item.percentage}%" for item in m4.modality_attention
        },
        "biological_summary": m3.interpretation.biological_interpretation[0],
        "clinical_summary": m3.interpretation.clinical_interpretation[0],
        "recommendation": m3.interpretation.clinical_interpretation[2] if len(m3.interpretation.clinical_interpretation) > 2 else "Routine follow-up."
    }

    return FinalPipelineResponse(
        patient=patient,
        preprocessing=pre,
        module1_optimization=m1_opt,
        module2_snn=m2_snn,
        module3_xai=m3,
        module4_fusion=m4,
        evaluation=eval_data,
        summary=summary,
        # Backward-compatibility
        module1=pre,
        module2=m2_snn,
        module3=m3,
        module4=m4
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
