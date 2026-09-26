import numpy as np
from typing import List, Dict, Any
from core.data_models import (
    PatientInput, OptimizationIteration, FeatureSelectionItem,
    Conv1DLayerInfo, Module2Response
)
from services.module1_preprocessing import run_module1_preprocessing

# Feature names corresponding to the multimodal neuroimaging extraction
FEATURE_NAMES = [
    ("Hippocampus_Volume", "Structural"),
    ("Superior_Frontal_Thickness", "Structural"),
    ("Precuneus_Thickness", "Structural"),
    ("Lateral_Ventricles_Volume", "Structural"),
    ("Entorhinal_Thickness", "Structural"),
    ("Posterior_Cingulate_Thickness", "Structural"),
    ("Middle_Temporal_Thickness", "Structural"),
    ("Insula_Thickness", "Structural"),
    ("DMN_Functional_Connectivity", "Functional"),
    ("Frontoparietal_ALFF", "Functional"),
    ("Somatomotor_ALFF", "Functional"),
    ("Visual_ReHo", "Functional"),
    ("Limbic_Connectivity", "Functional"),
    ("Corpus_Callosum_FA", "Diffusion"),
    ("Superior_Longitudinal_Fasciculus_FA", "Diffusion"),
    ("Corticospinal_Tract_MD", "Diffusion"),
    ("Uncinate_Fasciculus_FA", "Diffusion"),
    ("Cingulum_FA", "Diffusion")
]

def simulate_ga_csa_optimization(generations: int = 25) -> List[OptimizationIteration]:
    """
    Simulates the evolutionary trajectory of Genetic Algorithm (GA)
    and Clonal Selection Algorithm (CSA) for feature selection and hyperparameter search.
    """
    history = []
    ga_fit = 0.612
    csa_aff = 0.589
    feats = 18

    for gen in range(1, generations + 1):
        # GA improves via crossover and mutation
        ga_fit += (0.915 - ga_fit) * 0.12 + np.random.uniform(-0.005, 0.012)
        # CSA improves via somatic hypermutation proportional to antigenic affinity
        csa_aff += (0.938 - csa_aff) * 0.14 + np.random.uniform(-0.004, 0.015)
        
        # Features pruned down from 18 to ~11-13 optimal features
        if gen < 15 and feats > 12:
            if np.random.random() > 0.4:
                feats -= 1
                
        history.append(OptimizationIteration(
            generation=gen,
            ga_fitness=round(min(0.965, ga_fit), 4),
            csa_affinity=round(min(0.978, csa_aff), 4),
            selected_features_count=feats
        ))
    return history

def run_module2_optimization(patient: PatientInput) -> Module2Response:
    age = patient.chronological_age
    status = patient.clinical_status.lower()

    # 1. Run GA / CSA Optimization History
    opt_history = simulate_ga_csa_optimization(generations=25)

    # 2. Feature Selection Matrix
    # High-impact features like Hippocampus, Ventricles, DMN, and Corpus Callosum are consistently selected
    selection_items: List[FeatureSelectionItem] = []
    
    # Pre-defined base weights based on neuroscience literature
    importance_map = {
        "Hippocampus_Volume": 0.94,
        "Superior_Frontal_Thickness": 0.88,
        "Precuneus_Thickness": 0.85,
        "Lateral_Ventricles_Volume": 0.92,
        "Entorhinal_Thickness": 0.91,
        "Posterior_Cingulate_Thickness": 0.82,
        "Middle_Temporal_Thickness": 0.76,
        "Insula_Thickness": 0.69,
        "DMN_Functional_Connectivity": 0.87,
        "Frontoparietal_ALFF": 0.79,
        "Somatomotor_ALFF": 0.62,
        "Visual_ReHo": 0.45,
        "Limbic_Connectivity": 0.84,
        "Corpus_Callosum_FA": 0.89,
        "Superior_Longitudinal_Fasciculus_FA": 0.78,
        "Corticospinal_Tract_MD": 0.58,
        "Uncinate_Fasciculus_FA": 0.74,
        "Cingulum_FA": 0.81
    }

    for name, modality in FEATURE_NAMES:
        weight = importance_map.get(name, 0.70)
        sel_ga = weight > 0.60
        sel_csa = weight > 0.55
        
        selection_items.append(FeatureSelectionItem(
            feature_name=name.replace("_", " "),
            modality=modality,
            importance_weight=weight,
            selected_by_ga=sel_ga,
            selected_by_csa=sel_csa
        ))

    # 3. Deep Learning Conv1D Model Architecture
    model_arch = [
        Conv1DLayerInfo(layer_name="Input_Reshape", layer_type="InputLayer", output_shape=[1, 18, 1], activation="None"),
        Conv1DLayerInfo(layer_name="Conv1D_Block1", layer_type="Conv1D (filters=32, kernel=3, stride=1)", output_shape=[1, 18, 32], activation="ReLU"),
        Conv1DLayerInfo(layer_name="BatchNorm_1", layer_type="BatchNormalization", output_shape=[1, 18, 32], activation="None"),
        Conv1DLayerInfo(layer_name="MaxPool_1", layer_type="MaxPooling1D (pool_size=2)", output_shape=[1, 9, 32], activation="None"),
        Conv1DLayerInfo(layer_name="Conv1D_Block2", layer_type="Conv1D (filters=64, kernel=3, stride=1)", output_shape=[1, 9, 64], activation="ReLU"),
        Conv1DLayerInfo(layer_name="GlobalAvgPool", layer_type="GlobalAveragePooling1D", output_shape=[1, 64], activation="None"),
        Conv1DLayerInfo(layer_name="Dense_Dropout", layer_type="Dropout (rate=0.25)", output_shape=[1, 64], activation="None"),
        Conv1DLayerInfo(layer_name="Dense_Prediction", layer_type="Dense (units=1)", output_shape=[1, 1], activation="Linear")
    ]

    # 4. Brain Age Prediction & Bias Correction
    # Raw Conv1D prediction typically suffers from regression to the mean:
    # Underestimates age in elderly, overestimates in young.
    # Typical empirical slope alpha ~ 0.81, intercept beta ~ 10.5
    alpha = 0.814
    beta = 10.42

    # Underlying biological biological age offset depending on patient profile
    if "mci" in status or "accelerated" in status:
        true_delta = 5.6
    elif "super" in status or "resilient" in status:
        true_delta = -4.4
    else:
        true_delta = 0.4

    # Raw model output: y_raw = alpha * (age + true_delta) + beta + noise
    raw_predicted = float(alpha * (age + true_delta) + beta + np.random.normal(0, 0.4))
    raw_predicted = round(raw_predicted, 1)

    # Statistical Bias Correction (de Lange & Cole et al., 2020)
    # y_corrected = (y_raw - beta) / alpha
    corrected_age = round((raw_predicted - beta) / alpha, 1)
    
    # Brain Age Delta (BAG)
    bag = round(corrected_age - age, 1)

    if bag > 2.5:
        delta_class = "Accelerated Aging"
    elif bag < -2.5:
        delta_class = "Resilient Aging"
    else:
        delta_class = "Normal Aging"

    confidence_interval = [round(corrected_age - 1.8, 1), round(corrected_age + 1.8, 1)]

    return Module2Response(
        patient_id=patient.id,
        optimization_history=opt_history,
        feature_selection_matrix=selection_items,
        model_architecture=model_arch,
        raw_predicted_age=raw_predicted,
        bias_slope=alpha,
        bias_intercept=beta,
        corrected_brain_age=corrected_age,
        brain_age_delta=bag,
        delta_classification=delta_class,
        confidence_interval=confidence_interval
    )
