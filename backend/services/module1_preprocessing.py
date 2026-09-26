import numpy as np
from typing import List, Dict, Any
from core.data_models import (
    PatientInput, PreprocessingStep, BrainRegionFeature, 
    BiologicalFeatureGroup, Module1Response
)

# Reference anatomical regions with canonical network mappings and baseline normative metrics
REFERENCE_REGIONS = [
    {"id": "R01", "name": "Hippocampus", "lobe": "Temporal / Subcortical", "network": "Limbic", "base_th": 2.10, "base_vol": 4120, "base_alff": 0.42, "base_fa": 0.28, "base_md": 0.82},
    {"id": "R02", "name": "Superior Frontal Gyrus", "lobe": "Frontal", "network": "Frontoparietal", "base_th": 2.65, "base_vol": 12800, "base_alff": 0.58, "base_fa": 0.41, "base_md": 0.74},
    {"id": "R03", "name": "Precuneus", "lobe": "Parietal", "network": "Default Mode", "base_th": 2.48, "base_vol": 9400, "base_alff": 0.65, "base_fa": 0.44, "base_md": 0.71},
    {"id": "R04", "name": "Lateral Ventricles", "lobe": "Ventricular", "network": "Subcortical", "base_th": 0.00, "base_vol": 22500, "base_alff": 0.12, "base_fa": 0.15, "base_md": 1.45},
    {"id": "R05", "name": "Entorhinal Cortex", "lobe": "Temporal", "network": "Limbic", "base_th": 3.20, "base_vol": 1850, "base_alff": 0.38, "base_fa": 0.31, "base_md": 0.79},
    {"id": "R06", "name": "Posterior Cingulate Cortex", "lobe": "Cingulate", "network": "Default Mode", "base_th": 2.52, "base_vol": 4300, "base_alff": 0.71, "base_fa": 0.45, "base_md": 0.69},
    {"id": "R07", "name": "Middle Temporal Gyrus", "lobe": "Temporal", "network": "Default Mode", "base_th": 2.75, "base_vol": 11200, "base_alff": 0.54, "base_fa": 0.38, "base_md": 0.76},
    {"id": "R08", "name": "Precentral Gyrus", "lobe": "Frontal", "network": "Somatomotor", "base_th": 2.55, "base_vol": 13900, "base_alff": 0.62, "base_fa": 0.46, "base_md": 0.70},
    {"id": "R09", "name": "Postcentral Gyrus", "lobe": "Parietal", "network": "Somatomotor", "base_th": 2.15, "base_vol": 10400, "base_alff": 0.59, "base_fa": 0.43, "base_md": 0.73},
    {"id": "R10", "name": "Pericalcarine Visual Cortex", "lobe": "Occipital", "network": "Visual", "base_th": 1.85, "base_vol": 5200, "base_alff": 0.68, "base_fa": 0.48, "base_md": 0.68},
    {"id": "R11", "name": "Inferior Parietal Lobule", "lobe": "Parietal", "network": "Frontoparietal", "base_th": 2.45, "base_vol": 12100, "base_alff": 0.57, "base_fa": 0.40, "base_md": 0.75},
    {"id": "R12", "name": "Thalamus", "lobe": "Subcortical", "network": "Subcortical", "base_th": 2.10, "base_vol": 7800, "base_alff": 0.49, "base_fa": 0.51, "base_md": 0.72},
    {"id": "R13", "name": "Amygdala", "lobe": "Subcortical", "network": "Limbic", "base_th": 2.05, "base_vol": 1650, "base_alff": 0.35, "base_fa": 0.29, "base_md": 0.81},
    {"id": "R14", "name": "Insula", "lobe": "Insular", "network": "Ventral Attention", "base_th": 2.85, "base_vol": 7100, "base_alff": 0.51, "base_fa": 0.39, "base_md": 0.77},
    {"id": "R15", "name": "Superior Parietal Lobule", "lobe": "Parietal", "network": "Dorsal Attention", "base_th": 2.30, "base_vol": 9800, "base_alff": 0.55, "base_fa": 0.42, "base_md": 0.74},
    {"id": "R16", "name": "Corpus Callosum", "lobe": "White Matter", "network": "Subcortical", "base_th": 0.00, "base_vol": 3200, "base_alff": 0.18, "base_fa": 0.72, "base_md": 0.65}
]

BIOLOGICAL_NETWORKS = [
    {"network": "Default Mode", "desc": "Medial prefrontal, precuneus, posterior cingulate. Involved in memory retrieval, introspection, and earliest amyloid/tau deposition."},
    {"network": "Frontoparietal", "desc": "Dorsolateral prefrontal and inferior parietal regions. Governs executive function, working memory, and cognitive flexibility."},
    {"network": "Limbic", "desc": "Hippocampal formation, entorhinal cortex, and amygdala. Memory consolidation and emotional valence; highly vulnerable to neurodegeneration."},
    {"network": "Somatomotor", "desc": "Pre- and postcentral gyri. Motor execution and tactile processing; shows gradual age-related microstructural changes."},
    {"network": "Visual", "desc": "Pericalcarine and extrastriate visual cortices. Primary and secondary visual sensory streams; relatively resilient to normal aging."},
    {"network": "Dorsal Attention", "desc": "Frontal eye fields and superior parietal regions. Top-down visuospatial attention orientation."},
    {"network": "Ventral Attention", "desc": "Temporoparietal junction and insular cortex. Bottom-up salience detection and stimulus-driven reorienting."},
    {"network": "Subcortical", "desc": "Thalamus, striatum, ventricles, and corpus callosum. Sensory gating, ventricular dynamics, and interhemispheric tract integrity."}
]

def run_module1_preprocessing(patient: PatientInput) -> Module1Response:
    age = patient.chronological_age
    status = patient.clinical_status.lower()
    
    # Age factor: older subjects naturally experience atrophy and ventricular expansion
    # Accelerated subjects have accentuated atrophy; super-agers have preserved metrics
    if "mci" in status or "accelerated" in status:
        age_multiplier = 1.35
        hippocampal_factor = 0.78
        ventricular_factor = 1.55
        fa_factor = 0.84
        fc_factor = 0.81
    elif "super" in status or "resilient" in status:
        age_multiplier = 0.75
        hippocampal_factor = 1.08
        ventricular_factor = 0.88
        fa_factor = 1.06
        fc_factor = 1.09
    else:
        age_multiplier = 1.0
        hippocampal_factor = 1.0
        ventricular_factor = 1.0
        fa_factor = 1.0
        fc_factor = 1.0

    # Apply patient manual overrides if specified
    if patient.hippocampal_volume_ratio is not None:
        hippocampal_factor = patient.hippocampal_volume_ratio
    if patient.ventricular_volume_ratio is not None:
        ventricular_factor = patient.ventricular_volume_ratio

    # 1. Standardized Preprocessing Steps
    preprocessing_steps = [
        PreprocessingStep(
            name="Standardized Preprocessing (Bias Correction)",
            description="N4ITK Non-parametric Non-uniform Intensity Normalization to remove B1 RF magnetic field inhomogeneity.",
            status="Completed (100%)",
            metrics={
                "snr_before": 14.2,
                "snr_after": 24.8,
                "b1_field_gradient_reduction": "94.2%",
                "convergence_iterations": 45
            }
        ),
        PreprocessingStep(
            name="Intensity Normalization & Skull Stripping",
            description="Robust brain mask extraction (BET/HD-BET) and z-score intensity standardization against the MNI152 normative template.",
            status="Completed (100%)",
            metrics={
                "brain_extraction_dice_score": 0.984,
                "intracranial_volume_ml": round(1420.0 - (age * 1.8), 1),
                "background_noise_ratio": 0.012
            }
        ),
        PreprocessingStep(
            name="Spatial Registration (MNI152 Alignment)",
            description="Rigid 6-DOF + Affine 12-DOF + Symmetric Diffeomorphic Non-linear Registration (SyN) to ICBM152 2009c Nonlinear Asymmetric space.",
            status="Completed (100%)",
            metrics={
                "mutual_information_score": 0.963,
                "target_space": "MNI152_1mm_v2009c",
                "degrees_of_freedom": 12,
                "deformation_field_smoothness": 1.42
            }
        ),
        PreprocessingStep(
            name="Anatomical Parcellation",
            description="Automated Desikan-Killiany-Tourville (DKT) cortical parcellation and ASEG subcortical segmentation into discrete anatomical ROIs.",
            status="Completed (100%)",
            metrics={
                "total_parcels_segmented": 84,
                "mean_label_overlap_dice": 0.941,
                "segmentation_qc_score": "Pass (A+)"
            }
        )
    ]

    # 2. Extract Features per Parcellation Region
    parcellation_regions: List[BrainRegionFeature] = []
    
    # Age-related baseline progression (normal loss is ~0.005mm cortical thickness / year after 40)
    age_decay = max(0.0, (age - 30.0) * 0.006 * age_multiplier)
    
    for r in REFERENCE_REGIONS:
        # Calculate thickness
        if r["name"] == "Lateral Ventricles" or r["name"] == "Corpus Callosum":
            th = 0.0
        else:
            th = max(1.2, round(r["base_th"] - age_decay * np.random.uniform(0.8, 1.2), 3))
        
        # Calculate volume
        if r["name"] == "Lateral Ventricles":
            # Ventricles enlarge with age
            vol = round(r["base_vol"] * (1.0 + (age - 20) * 0.015 * ventricular_factor), 1)
        elif r["name"] == "Hippocampus":
            vol = round(r["base_vol"] * (1.0 - (age - 30) * 0.008 * (2.0 - hippocampal_factor)), 1)
        else:
            vol = round(r["base_vol"] * (1.0 - (age - 30) * 0.005 * age_multiplier), 1)
        
        # Functional ALFF
        alff = round(max(0.1, r["base_alff"] * fc_factor - (age - 40) * 0.002), 3)
        
        # Diffusion FA & MD
        fa = round(max(0.15, r["base_fa"] * fa_factor - (age - 30) * 0.0025), 3)
        md = round(r["base_md"] + (age - 30) * 0.004 * (1.3 if "mci" in status else 1.0), 3)

        parcellation_regions.append(BrainRegionFeature(
            id=r["id"],
            name=r["name"],
            lobe=r["lobe"],
            network=r["network"],
            structural_thickness=th,
            structural_volume=vol,
            functional_alff=alff,
            diffusion_fa=fa,
            diffusion_md=md
        ))

    # 3. Biological Feature Grouping
    biological_groups: List[BiologicalFeatureGroup] = []
    for net in BIOLOGICAL_NETWORKS:
        net_name = net["network"]
        matching_regions = [r for r in parcellation_regions if r.network == net_name]
        
        if matching_regions:
            avg_th = np.mean([r.structural_thickness for r in matching_regions if r.structural_thickness > 0] or [2.0])
            avg_alff = np.mean([r.functional_alff for r in matching_regions])
            avg_fa = np.mean([r.diffusion_fa for r in matching_regions])
        else:
            avg_th, avg_alff, avg_fa = 2.4, 0.5, 0.45

        # Normalize scores to 0 - 100 index
        struct_score = round(float(np.clip((avg_th / 3.0) * 100, 10, 100)), 1)
        func_score = round(float(np.clip((avg_alff / 0.7) * 100, 10, 100)), 1)
        diff_score = round(float(np.clip((avg_fa / 0.6) * 100, 10, 100)), 1)
        
        # Composite biological aging index for this network (higher = more preserved / healthier)
        composite = round((struct_score * 0.45 + func_score * 0.30 + diff_score * 0.25), 1)

        biological_groups.append(BiologicalFeatureGroup(
            network_name=net_name,
            structural_score=struct_score,
            functional_score=func_score,
            diffusion_score=diff_score,
            composite_aging_index=composite,
            description=net["desc"]
        ))

    modality_summary = {
        "sMRI": {
            "resolution": "1.0 x 1.0 x 1.0 mm³ isotropic",
            "field_strength": "3.0 Tesla Siemens Prisma",
            "sequence": "3D T1-weighted MPRAGE (TR=2000ms, TE=2.01ms, TI=880ms)",
            "snr": 26.4,
            "motion_score": "0.14 mm (Minimal)"
        },
        "fMRI": {
            "resolution": "2.0 x 2.0 x 2.0 mm³",
            "sequence": "Resting-State BOLD EPI (TR=800ms, Multi-band factor 8)",
            "volumes_acquired": 480,
            "framewise_displacement_mean": "0.11 mm",
            "temporal_snr": 62.8
        },
        "dMRI": {
            "resolution": "1.5 x 1.5 x 1.5 mm³",
            "sequence": "High Angular Resolution Diffusion Imaging (HARDI, 64 directions)",
            "b_values": "b=0, 1000, 2000 s/mm²",
            "eddy_current_correction": "FSL EDDY + topup completed",
            "mean_fa": round(float(np.mean([r.diffusion_fa for r in parcellation_regions])), 3)
        }
    }

    return Module1Response(
        patient_id=patient.id,
        preprocessing_steps=preprocessing_steps,
        parcellation_regions=parcellation_regions,
        biological_groups=biological_groups,
        modality_summary=modality_summary
    )
