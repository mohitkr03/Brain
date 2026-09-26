from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any, Optional

class CustomBaseModel(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

# --- Input Models ---
class PatientInput(CustomBaseModel):
    id: str = "P001"
    name: str = "Subject 1042"
    chronological_age: float = 68.0
    gender: str = "Female"
    clinical_status: str = "MCI Suspected" # "Healthy", "MCI Suspected", "Super-Ager"
    # Modality raw feature overrides (optional)
    smri_quality: float = 0.95
    fmri_quality: float = 0.91
    dmri_quality: float = 0.88
    hippocampal_volume_ratio: Optional[float] = None
    ventricular_volume_ratio: Optional[float] = None
    cortical_thickness_mean: Optional[float] = None
    default_mode_connectivity: Optional[float] = None
    white_matter_fa_mean: Optional[float] = None

# --- Foundation: Preprocessing & Parcellation Models ---
class PreprocessingStep(CustomBaseModel):
    name: str
    description: str
    status: str
    metrics: Dict[str, Any]

class BrainRegionFeature(CustomBaseModel):
    id: str
    name: str
    lobe: str
    network: str # Visual, Somatomotor, DMN, Limbic, etc.
    structural_thickness: float # mm
    structural_volume: float # mm^3
    functional_alff: float # amplitude of low frequency fluctuations
    diffusion_fa: float # fractional anisotropy
    diffusion_md: float # mean diffusivity

class BiologicalFeatureGroup(CustomBaseModel):
    network_name: str
    structural_score: float
    functional_score: float
    diffusion_score: float
    composite_aging_index: float
    description: str

class PreprocessingResponse(CustomBaseModel):
    patient_id: str
    preprocessing_steps: List[PreprocessingStep]
    parcellation_regions: List[BrainRegionFeature]
    biological_groups: List[BiologicalFeatureGroup]
    modality_summary: Dict[str, Any]

# Alias for backward-compatibility
Module1Response = PreprocessingResponse

# --- MODULE 1: Evolutionary Optimization (GA + CSA) ---
class SNNHyperparameters(CustomBaseModel):
    lif_threshold_v: float = 1.0 # Volts
    membrane_time_constant_tau: float = 20.0 # ms
    refractory_period_steps: int = 2
    time_window_steps: int = 16
    surrogate_gradient_temp: float = 1.2
    learning_rate: float = 0.001

class OptimizationIteration(CustomBaseModel):
    generation: int
    ga_fitness: float
    csa_affinity: float
    selected_features_count: int

class FeatureSelectionItem(CustomBaseModel):
    feature_name: str
    modality: str
    importance_weight: float
    selected_by_ga: bool
    selected_by_csa: bool
    consensus_selected: bool

class Module1OptimizationResponse(CustomBaseModel):
    patient_id: str
    optimization_history: List[OptimizationIteration]
    feature_selection_matrix: List[FeatureSelectionItem]
    optimal_snn_hyperparameters: SNNHyperparameters
    sparsity_ratio_pct: float
    ga_best_fitness: float
    csa_best_affinity: float

# --- MODULE 2: SNN-Based Brain Age Prediction ---
class SpikeRasterPoint(CustomBaseModel):
    layer: str # "Input Spikes", "Hidden Conv-SNN", "Readout LIF"
    neuron_idx: int
    time_step: int # 1 to 16

class LIFNeuronDynamics(CustomBaseModel):
    time_steps: List[int]
    membrane_potentials: List[float]
    spikes: List[int]
    threshold: float
    resting_potential: float

class SNNEnergyMetrics(CustomBaseModel):
    synaptic_operations_sops: int
    equivalent_ann_macs: int
    spiking_sparsity_pct: float
    energy_consumption_uj: float
    ann_energy_uj: float
    energy_efficiency_gain_x: float

class SNNLayerInfo(CustomBaseModel):
    layer_name: str
    layer_type: str
    output_shape: List[int]
    neuron_model: str # "Leaky Integrate-and-Fire (LIF)"

class Module2SNNResponse(CustomBaseModel):
    patient_id: str
    model_architecture: List[SNNLayerInfo]
    lif_dynamics: LIFNeuronDynamics
    spike_raster_sample: List[SpikeRasterPoint]
    energy_metrics: SNNEnergyMetrics
    raw_snn_predicted_age: float
    bias_slope: float
    bias_intercept: float
    corrected_brain_age: float
    brain_age_delta: float
    delta_classification: str # "Accelerated Aging", "Normal Aging", "Resilient Aging"
    confidence_interval: List[float]

# Backward-compatible alias
Module2Response = Module2SNNResponse

# --- MODULE 3: Explainable AI (XAI) ---
class PermutationImportanceItem(CustomBaseModel):
    feature_name: str
    modality: str
    baseline_mae: float
    permuted_mae: float
    importance_drop_delta_mae: float
    p_value: float

class RegionImportance(CustomBaseModel):
    region_id: str
    region_name: str
    lobe: str
    attention_weight: float
    shap_value: float # impact on BAG in years
    saliency_score: float # 0.0 - 1.0
    normative_z_score: float
    status: str # "Severe Atrophy", "Mild Reduction", "Normal", "Preserved"

class XAIInterpretation(CustomBaseModel):
    biological_interpretation: List[str]
    clinical_interpretation: List[str]
    cognitive_risk_score: float # 0 - 100
    risk_level: str # "Low", "Moderate", "Elevated", "High"

class Module3Response(CustomBaseModel):
    patient_id: str
    top_important_regions: List[RegionImportance]
    shap_waterfall: List[Dict[str, Any]]
    permutation_importance: List[PermutationImportanceItem]
    attention_map_slices: Dict[str, Any]
    interpretation: XAIInterpretation

# --- MODULE 4: Advanced Multimodal Learning (SNN Advanced Fusion) ---
class ModalityAttentionWeight(CustomBaseModel):
    modality: str
    attention_weight: float
    percentage: float
    description: str

class LatentEmbeddingPoint(CustomBaseModel):
    sample_id: str
    tsne_x: float
    tsne_y: float
    category: str # "Normal", "Accelerated", "Resilient", "Current Patient"
    chronological_age: float
    predicted_age: float

class GraphNode(CustomBaseModel):
    id: str
    label: str
    network: str
    x: float
    y: float
    z: float
    degree: int

class GraphEdge(CustomBaseModel):
    source: str
    target: str
    weight: float
    edge_type: str # "structural", "functional"

class Module4Response(CustomBaseModel):
    patient_id: str
    modality_attention: List[ModalityAttentionWeight]
    latent_space_projection: List[LatentEmbeddingPoint]
    brain_graph_nodes: List[GraphNode]
    brain_graph_edges: List[GraphEdge]
    final_predicted_age: float
    final_corrected_age: float
    final_bag: float
    modality_fusion_gain: float # improvement in years over single modality
    snn_fusion_spiking_efficiency: str

# --- Performance Evaluation Models ---
class MetricComparison(CustomBaseModel):
    model_name: str
    mae: float
    rmse: float
    r2_score: float
    pearson_r: float
    p_value: float
    energy_per_inference_uj: float

class BlandAltmanPoint(CustomBaseModel):
    mean_age: float
    difference: float # Predicted - Chronological
    subject_id: str

class RegressionPoint(CustomBaseModel):
    chronological_age: float
    predicted_age: float
    corrected_age: float
    subject_id: str

class EvaluationResponse(CustomBaseModel):
    model_metrics: List[MetricComparison]
    bland_altman: Dict[str, Any]
    regression_data: List[RegressionPoint]
    pearson_correlation: Dict[str, Any]
    snn_neuromorphic_summary: Dict[str, Any]

# --- Final Combined Response ---
class FinalPipelineResponse(CustomBaseModel):
    patient: PatientInput
    preprocessing: PreprocessingResponse
    module1_optimization: Module1OptimizationResponse
    module2_snn: Module2SNNResponse
    module3_xai: Module3Response
    module4_fusion: Module4Response
    evaluation: EvaluationResponse
    summary: Dict[str, Any]
    # Backward compatibility
    module1: Optional[PreprocessingResponse] = None
    module2: Optional[Module2SNNResponse] = None
    module3: Optional[Module3Response] = None
    module4: Optional[Module4Response] = None

# --- NEW: Image Upload & Vision Analysis Models ---
class ImageAnalysisResult(CustomBaseModel):
    filename: str
    image_url: str
    detected_modality: str # "Structural MRI (sMRI, T1-weighted)", "Functional MRI (fMRI BOLD)", "Diffusion MRI (dMRI FA)"
    modality_confidence: float # e.g. 0.985
    detected_plane: str # "Axial", "Coronal", "Sagittal"
    plane_confidence: float # e.g. 0.962
    image_dimensions: List[int] # [width, height]
    snr_quality: float # Signal-to-noise ratio in dB
    contrast_to_noise: float
    motion_artifact_score: str # "Minimal (0.12mm)", "Moderate", etc.
    tissue_segmentation: Dict[str, float] # {"gray_matter_pct": 44.5, "white_matter_pct": 40.2, "csf_pct": 15.3}
    ventriculo_cranial_ratio: float
    hippocampal_volume_ratio: float
    cortical_thickness_proxy_mm: float
    anomalies_detected: List[str]
    suggested_clinical_status: str # "Accelerated Aging / aMCI", "Healthy Normal", "Super-Ager"
    derived_patient_profile: PatientInput

class DemoScanItem(CustomBaseModel):
    id: str
    title: str
    filename: str
    image_url: str
    modality: str
    plane: str
    subject_profile: str
    expected_bag: str
    clinical_note: str
