import os
from typing import List
from core.data_models import ImageAnalysisResult, DemoScanItem
from services.alzheimer_classifier import analyze_alzheimer_scan

BACKEND_DIR = os.path.dirname(os.path.dirname(__file__))
DEMO_SCANS_DIR = os.path.join(BACKEND_DIR, "demo_scans")

DEMO_SCANS_METADATA: List[DemoScanItem] = [
    # --- OASIS Alzheimer's 4-Stage Clinical Benchmark Scans ---
    DemoScanItem(
        id="demo-oasis-nd",
        title="OASIS 1: sMRI Axial (Non-Demented Control)",
        filename="oasis_smri_non_demented_axial.png",
        image_url="/demo_scans/oasis_smri_non_demented_axial.png",
        modality="Structural MRI (sMRI, T1w)",
        plane="Axial",
        subject_profile="Healthy Control (48y, Male)",
        expected_bag="+0.4 yrs (Normal Aging)",
        clinical_note="Symmetric frontal horns, VCR 0.051, preserved hippocampal volume (1.07x norm), intact neocortical ribbon."
    ),
    DemoScanItem(
        id="demo-oasis-vmd",
        title="OASIS 2: sMRI Axial (Very Mild Demented / Early aMCI)",
        filename="oasis_smri_very_mild_demented_axial.png",
        image_url="/demo_scans/oasis_smri_very_mild_demented_axial.png",
        modality="Structural MRI (sMRI, T1w)",
        plane="Axial",
        subject_profile="Early Cognitive Decline (65y, Female)",
        expected_bag="+3.6 yrs (Early Accelerated Aging)",
        clinical_note="Incipient ventricular expansion (VCR 0.095, +28%), subtle hippocampal volume loss (0.87x norm), parasagittal sulcal deepening."
    ),
    DemoScanItem(
        id="demo-oasis-md",
        title="OASIS 3: sMRI Axial (Mild Demented / Mild Alzheimer's)",
        filename="oasis_smri_mild_demented_axial.png",
        image_url="/demo_scans/oasis_smri_mild_demented_axial.png",
        modality="Structural MRI (sMRI, T1w)",
        plane="Axial",
        subject_profile="Mild Alzheimer's Disease (71y, Female)",
        expected_bag="+6.4 yrs (Accelerated Aging)",
        clinical_note="Distinct bilateral ventricular dilation (VCR 0.111), temporal horn opening, significant hippocampal atrophy (0.68x norm)."
    ),
    DemoScanItem(
        id="demo-oasis-mod",
        title="OASIS 4: sMRI Axial (Moderate Demented / Advanced AD)",
        filename="oasis_smri_moderate_demented_axial.png",
        image_url="/demo_scans/oasis_smri_moderate_demented_axial.png",
        modality="Structural MRI (sMRI, T1w)",
        plane="Axial",
        subject_profile="Moderate Alzheimer's Dementia (78y, Female)",
        expected_bag="+9.8 yrs (Severe Neurodegeneration)",
        clinical_note="Severe ex-vacuo lateral ventriculomegaly (VCR 0.133), blunted butterfly horn configuration, profound hippocampal collapse (0.55x norm)."
    ),
    # --- Multimodal Demonstration Scans ---
    DemoScanItem(
        id="demo-1",
        title="Demo 5: sMRI T1w Axial (Healthy Control 45y)",
        filename="demo_smri_healthy_axial.png",
        image_url="/demo_scans/demo_smri_healthy_axial.png",
        modality="Structural MRI (sMRI, T1w)",
        plane="Axial",
        subject_profile="Healthy Adult (45y, Male)",
        expected_bag="+0.4 yrs (Normal Aging)",
        clinical_note="Symmetric lateral ventricles, intact cortical ribbon width, age-appropriate sulcal depth."
    ),
    DemoScanItem(
        id="demo-2",
        title="Demo 6: sMRI T1w Coronal (aMCI / Accelerated)",
        filename="demo_smri_mci_coronal.png",
        image_url="/demo_scans/demo_smri_mci_coronal.png",
        modality="Structural MRI (sMRI, T1w)",
        plane="Coronal",
        subject_profile="Mild Cognitive Impairment (68y, Female)",
        expected_bag="+5.8 yrs (Accelerated Aging)",
        clinical_note="Marked bilateral hippocampal volume reduction (Z=-2.45) with compensatory temporal horn dilation."
    ),
    DemoScanItem(
        id="demo-3",
        title="Demo 7: sMRI T1w Sagittal (Super-Ager)",
        filename="demo_smri_superager_sagittal.png",
        image_url="/demo_scans/demo_smri_superager_sagittal.png",
        modality="Structural MRI (sMRI, T1w)",
        plane="Sagittal",
        subject_profile="Super-Ager Control (74y, Male)",
        expected_bag="-4.2 yrs (Resilient Aging)",
        clinical_note="High brain reserve, exceptionally preserved anterior cingulate and thick prefrontal cortex."
    ),
    DemoScanItem(
        id="demo-4",
        title="Demo 8: fMRI BOLD Functional Connectivity (DMN)",
        filename="demo_fmri_bold_axial.png",
        image_url="/demo_scans/demo_fmri_bold_axial.png",
        modality="Functional MRI (fMRI BOLD)",
        plane="Axial",
        subject_profile="Middle-Aged Adult (52y, Female)",
        expected_bag="+0.8 yrs (Normal Aging)",
        clinical_note="Strong resting-state Default Mode Network synchrony across mPFC, Precuneus, and Bilateral IPL."
    ),
    DemoScanItem(
        id="demo-5",
        title="Demo 9: dMRI Directional FA Tractography",
        filename="demo_dmri_tractography_coronal.png",
        image_url="/demo_scans/demo_dmri_tractography_coronal.png",
        modality="Diffusion MRI (dMRI FA)",
        plane="Coronal",
        subject_profile="Older Adult (61y, Male)",
        expected_bag="-1.1 yrs (Preserved White Matter)",
        clinical_note="High Fractional Anisotropy along Corpus Callosum (Red, L-R) and Corticospinal Tracts (Blue, S-I)."
    ),
    DemoScanItem(
        id="demo-6",
        title="Demo 10: sMRI T1w Axial (Severe Neurodegeneration)",
        filename="demo_smri_severe_alzheimers_axial.png",
        image_url="/demo_scans/demo_smri_severe_alzheimers_axial.png",
        modality="Structural MRI (sMRI, T1w)",
        plane="Axial",
        subject_profile="Advanced Neurodegeneration (78y, Female)",
        expected_bag="+9.2 yrs (Severe Accelerated Aging)",
        clinical_note="Massive ex-vacuo lateral ventriculomegaly, widespread gyral atrophy, and pronounced sulcal widening."
    ),
]

def get_demo_scans_list() -> List[DemoScanItem]:
    return DEMO_SCANS_METADATA

def analyze_brain_image(image_bytes: bytes, filename: str) -> ImageAnalysisResult:
    """
    Feeds brain neuroimaging scan into the trained Alzheimer and Vision Morphometric Model.
    """
    return analyze_alzheimer_scan(image_bytes, filename)
