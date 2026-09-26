export interface PatientInput {
  id: string;
  name: string;
  chronological_age: number;
  gender: string;
  clinical_status: string;
  smri_quality?: number;
  fmri_quality?: number;
  dmri_quality?: number;
  hippocampal_volume_ratio?: number;
  ventricular_volume_ratio?: number;
  cortical_thickness_mean?: number;
  default_mode_connectivity?: number;
  white_matter_fa_mean?: number;
}

export interface PreprocessingStep {
  name: string;
  description: string;
  status: string;
  metrics: Record<string, any>;
}

export interface BrainRegionFeature {
  id: string;
  name: string;
  lobe: string;
  network: string;
  structural_thickness: number;
  structural_volume: number;
  functional_alff: number;
  diffusion_fa: number;
  diffusion_md: number;
}

export interface BiologicalFeatureGroup {
  network_name: string;
  structural_score: number;
  functional_score: number;
  diffusion_score: number;
  composite_aging_index: number;
  description: string;
}

export interface PreprocessingResponse {
  patient_id: string;
  preprocessing_steps: PreprocessingStep[];
  parcellation_regions: BrainRegionFeature[];
  biological_groups: BiologicalFeatureGroup[];
  modality_summary: Record<string, any>;
}

export type Module1Response = PreprocessingResponse;

// --- Module 1: Evolutionary Optimization (GA + CSA) ---
export interface SNNHyperparameters {
  lif_threshold_v: number;
  membrane_time_constant_tau: number;
  refractory_period_steps: number;
  time_window_steps: number;
  surrogate_gradient_temp: number;
  learning_rate: number;
}

export interface OptimizationIteration {
  generation: number;
  ga_fitness: number;
  csa_affinity: number;
  selected_features_count: number;
}

export interface FeatureSelectionItem {
  feature_name: string;
  modality: string;
  importance_weight: number;
  selected_by_ga: boolean;
  selected_by_csa: boolean;
  consensus_selected: boolean;
}

export interface Module1OptimizationResponse {
  patient_id: string;
  optimization_history: OptimizationIteration[];
  feature_selection_matrix: FeatureSelectionItem[];
  optimal_snn_hyperparameters: SNNHyperparameters;
  sparsity_ratio_pct: number;
  ga_best_fitness: number;
  csa_best_affinity: number;
}

// --- Module 2: SNN-Based Brain Age Prediction ---
export interface SpikeRasterPoint {
  layer: string;
  neuron_idx: number;
  time_step: number;
}

export interface LIFNeuronDynamics {
  time_steps: number[];
  membrane_potentials: number[];
  spikes: number[];
  threshold: number;
  resting_potential: number;
}

export interface SNNEnergyMetrics {
  synaptic_operations_sops: number;
  equivalent_ann_macs: number;
  spiking_sparsity_pct: number;
  energy_consumption_uj: number;
  ann_energy_uj: number;
  energy_efficiency_gain_x: number;
}

export interface SNNLayerInfo {
  layer_name: string;
  layer_type: string;
  output_shape: number[];
  neuron_model: string;
}

export interface Module2SNNResponse {
  patient_id: string;
  model_architecture: SNNLayerInfo[];
  lif_dynamics: LIFNeuronDynamics;
  spike_raster_sample: SpikeRasterPoint[];
  energy_metrics: SNNEnergyMetrics;
  raw_snn_predicted_age: number;
  bias_slope: number;
  bias_intercept: number;
  corrected_brain_age: number;
  brain_age_delta: number;
  delta_classification: string;
  confidence_interval: number[];
}

export type Module2Response = Module2SNNResponse;

// --- Module 3: Explainable AI ---
export interface PermutationImportanceItem {
  feature_name: string;
  modality: string;
  baseline_mae: number;
  permuted_mae: number;
  importance_drop_delta_mae: number;
  p_value: number;
}

export interface RegionImportance {
  region_id: string;
  region_name: string;
  lobe: string;
  attention_weight: number;
  shap_value: number;
  saliency_score: number;
  normative_z_score: number;
  status: string;
}

export interface XAIInterpretation {
  biological_interpretation: string[];
  clinical_interpretation: string[];
  cognitive_risk_score: number;
  risk_level: string;
}

export interface Module3Response {
  patient_id: string;
  top_important_regions: RegionImportance[];
  shap_waterfall: {
    feature: string;
    contribution: number;
    cumulative: number;
    type: 'positive' | 'negative';
  }[];
  permutation_importance: PermutationImportanceItem[];
  attention_map_slices: Record<string, any>;
  interpretation: XAIInterpretation;
}

// --- Module 4: Advanced Multimodal Learning ---
export interface ModalityAttentionWeight {
  modality: string;
  attention_weight: number;
  percentage: number;
  description: string;
}

export interface LatentEmbeddingPoint {
  sample_id: string;
  tsne_x: number;
  tsne_y: number;
  category: string;
  chronological_age: number;
  predicted_age: number;
}

export interface GraphNode {
  id: string;
  label: string;
  network: string;
  x: number;
  y: number;
  z: number;
  degree: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
  edge_type: string;
}

export interface Module4Response {
  patient_id: string;
  modality_attention: ModalityAttentionWeight[];
  latent_space_projection: LatentEmbeddingPoint[];
  brain_graph_nodes: GraphNode[];
  brain_graph_edges: GraphEdge[];
  final_predicted_age: number;
  final_corrected_age: number;
  final_bag: number;
  modality_fusion_gain: number;
  snn_fusion_spiking_efficiency: string;
}

export interface MetricComparison {
  model_name: string;
  mae: number;
  rmse: number;
  r2_score: number;
  pearson_r: number;
  p_value: number;
  energy_per_inference_uj: number;
}

export interface BlandAltmanPoint {
  mean_age: number;
  difference: number;
  subject_id: string;
}

export interface RegressionPoint {
  chronological_age: number;
  predicted_age: number;
  corrected_age: number;
  subject_id: string;
}

export interface EvaluationResponse {
  model_metrics: MetricComparison[];
  bland_altman: {
    mean_difference: number;
    std_difference: number;
    upper_limit_of_agreement: number;
    lower_limit_of_agreement: number;
    points: BlandAltmanPoint[];
  };
  regression_data: RegressionPoint[];
  pearson_correlation: {
    overall_r: number;
    overall_p_value: string;
    cohort_breakdown: {
      cohort: string;
      r: number;
      mae: number;
      n: number;
    }[];
  };
  snn_neuromorphic_summary: Record<string, any>;
}

export interface FinalPipelineResponse {
  patient: PatientInput;
  preprocessing: PreprocessingResponse;
  module1_optimization: Module1OptimizationResponse;
  module2_snn: Module2SNNResponse;
  module3_xai: Module3Response;
  module4_fusion: Module4Response;
  evaluation: EvaluationResponse;
  summary: Record<string, any>;
  module1?: PreprocessingResponse;
  module2?: Module2SNNResponse;
  module3?: Module3Response;
  module4?: Module4Response;
}

// --- Image Upload & Analysis Types ---
export interface ImageAnalysisResult {
  filename: string;
  image_url: string;
  detected_modality: string;
  modality_confidence: number;
  detected_plane: string;
  plane_confidence: number;
  image_dimensions: number[];
  snr_quality: number;
  contrast_to_noise: number;
  motion_artifact_score: string;
  tissue_segmentation: {
    gray_matter_pct: number;
    white_matter_pct: number;
    csf_pct: number;
  };
  ventriculo_cranial_ratio: number;
  hippocampal_volume_ratio: number;
  cortical_thickness_proxy_mm: number;
  anomalies_detected: string[];
  suggested_clinical_status: string;
  derived_patient_profile: PatientInput;
}

export interface DemoScanItem {
  id: string;
  title: string;
  filename: string;
  image_url: string;
  modality: string;
  plane: string;
  subject_profile: string;
  expected_bag: string;
  clinical_note: string;
}
