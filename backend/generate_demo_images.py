import os
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from PIL import Image, ImageFilter, ImageDraw

# Output directories
BACKEND_DEMO_DIR = os.path.join(os.path.dirname(__file__), "demo_scans")
FRONTEND_DEMO_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "demo_scans")

os.makedirs(BACKEND_DEMO_DIR, exist_ok=True)
os.makedirs(FRONTEND_DEMO_DIR, exist_ok=True)

def save_image(fig, filename):
    for directory in [BACKEND_DEMO_DIR, FRONTEND_DEMO_DIR]:
        path = os.path.join(directory, filename)
        fig.savefig(path, bbox_inches='tight', pad_inches=0, dpi=180, facecolor='black')
        print(f"Saved: {path}")

# 1. Healthy sMRI Axial (45yo)
def generate_healthy_smri_axial():
    fig, ax = plt.subplots(figsize=(5, 5), facecolor='black')
    ax.set_facecolor('black')
    
    # Grid coordinates
    y, x = np.ogrid[-120:120, -120:120]
    
    # Outer skull & scalp
    cranium = (x / 95)**2 + (y / 110)**2
    skull = (cranium <= 1.0) & (cranium > 0.90)
    
    # Brain parenchyma
    parenchyma = (x / 88)**2 + (y / 102)**2 <= 1.0
    
    # Ventricles (normal, modest size)
    v_left = ((x + 14) / 7)**2 + ((y - 8) / 25)**2 <= 1.0
    v_right = ((x - 14) / 7)**2 + ((y - 8) / 25)**2 <= 1.0
    ventricles = v_left | v_right
    
    # Base image
    img = np.zeros((240, 240))
    # Scalp & skull
    img[cranium <= 1.06] = 0.35
    img[skull] = 0.12 # bone is dark on T1
    # Gray & White Matter
    img[parenchyma] = 0.68 # White matter
    # Sulci & cortex
    cortex_rim = (cranium <= 0.88) & (cranium > 0.72)
    img[cortex_rim] = 0.52 # Gray matter
    
    # Gyral / Sulcal convolutions
    np.random.seed(42)
    noise = np.sin(x/5.0) * np.cos(y/5.0) * 0.12
    img[parenchyma] += noise[parenchyma]
    
    # Ventricles are dark (CSF)
    img[ventricles] = 0.08
    
    # Interhemispheric fissure
    img[:, 118:122] = np.minimum(img[:, 118:122], 0.15)
    
    ax.imshow(img, cmap='gray', vmin=0, vmax=1)
    ax.axis('off')
    ax.text(12, 22, "sMRI T1w Axial\nHealthy Adult (45y)", color='#38bdf8', fontsize=9, fontweight='bold', fontfamily='sans-serif')
    ax.text(12, 228, "Normal Ventricles | Intact Cortical Ribbon", color='#94a3b8', fontsize=7.5, fontfamily='sans-serif')
    save_image(fig, "demo_smri_healthy_axial.png")
    plt.close(fig)

# 2. MCI / Accelerated Aging sMRI Coronal (68yo) - Marked Hippocampal Atrophy
def generate_mci_smri_coronal():
    fig, ax = plt.subplots(figsize=(5, 5), facecolor='black')
    ax.set_facecolor('black')
    
    y, x = np.ogrid[-120:120, -120:120]
    cranium = (x / 98)**2 + (y / 105)**2
    parenchyma = (x / 90)**2 + (y / 96)**2 <= 1.0
    
    # Enlarged lateral ventricles and temporal horns
    v_left = ((x + 22) / 16)**2 + ((y + 12) / 34)**2 <= 1.0
    v_right = ((x - 22) / 16)**2 + ((y + 12) / 34)**2 <= 1.0
    # Dilated temporal horns around hippocampus
    th_left = ((x + 38) / 9)**2 + ((y - 32) / 11)**2 <= 1.0
    th_right = ((x - 38) / 9)**2 + ((y - 32) / 11)**2 <= 1.0
    ventricles = v_left | v_right | th_left | th_right
    
    # Shrunken hippocampus (atrophy)
    hip_left = ((x + 36) / 8)**2 + ((y - 34) / 7)**2 <= 1.0
    hip_right = ((x - 36) / 8)**2 + ((y - 34) / 7)**2 <= 1.0
    
    img = np.zeros((240, 240))
    img[cranium <= 1.04] = 0.32
    img[parenchyma] = 0.65
    cortex_rim = (cranium <= 0.88) & (cranium > 0.68)
    img[cortex_rim] = 0.48
    
    # Sulcal widening (atrophy)
    np.random.seed(101)
    noise = np.sin(x/4.0) * np.cos(y/4.0) * 0.16
    img[parenchyma] += noise[parenchyma]
    
    # Dark CSF in ventricles and expanded temporal horns
    img[ventricles] = 0.06
    # Hippocampal remnant
    img[hip_left | hip_right] = 0.44
    
    # Midline
    img[:, 118:122] = np.minimum(img[:, 118:122], 0.12)
    
    ax.imshow(img, cmap='gray', vmin=0, vmax=1)
    # Highlight hippocampal atrophy zones with clinical annotations
    ax.plot([-36+120, -36+120], [-34+120-15, -34+120-5], color='#f43f5e', linewidth=1.5)
    ax.plot([36+120, 36+120], [-34+120-15, -34+120-5], color='#f43f5e', linewidth=1.5)
    
    ax.axis('off')
    ax.text(12, 22, "sMRI T1w Coronal\naMCI / Accelerated (68y)", color='#f43f5e', fontsize=9, fontweight='bold', fontfamily='sans-serif')
    ax.text(12, 228, "Bilateral Hippocampal Atrophy (Z = -2.45)", color='#fca5a5', fontsize=7.5, fontfamily='sans-serif')
    save_image(fig, "demo_smri_mci_coronal.png")
    plt.close(fig)

# 3. Super-Ager sMRI Sagittal (74yo) - High Brain Reserve
def generate_superager_smri_sagittal():
    fig, ax = plt.subplots(figsize=(5, 5), facecolor='black')
    ax.set_facecolor('black')
    
    y, x = np.ogrid[-120:120, -120:120]
    # Sagittal oval
    cranium = ((x + 10) / 105)**2 + (y / 95)**2
    parenchyma = ((x + 8) / 96)**2 + (y / 88)**2 <= 1.0
    
    # Robust Corpus Callosum C-shaped arch
    cc_outer = ((x + 5) / 46)**2 + ((y - 8) / 28)**2 <= 1.0
    cc_inner = ((x + 5) / 38)**2 + ((y - 8) / 18)**2 <= 1.0
    corpus_callosum = cc_outer & (~cc_inner) & (y > 0)
    
    # Cerebellum and brainstem
    cerebellum = ((x + 50) / 28)**2 + ((y + 45) / 24)**2 <= 1.0
    brainstem = ((x + 10) / 14)**2 + ((y + 48) / 30)**2 <= 1.0
    
    img = np.zeros((240, 240))
    img[cranium <= 1.05] = 0.30
    img[parenchyma] = 0.62
    img[cerebellum] = 0.58
    img[brainstem] = 0.65
    
    # Thick frontal cortex
    frontal = (x < -20) & parenchyma
    img[frontal] = 0.68
    
    # High-density corpus callosum
    img[corpus_callosum] = 0.92
    
    ax.imshow(img, cmap='bone', vmin=0, vmax=1)
    ax.axis('off')
    ax.text(12, 22, "sMRI T1w Sagittal\nSuper-Ager Control (74y)", color='#34d399', fontsize=9, fontweight='bold', fontfamily='sans-serif')
    ax.text(12, 228, "Preserved Cortical Ribbon | Intact Callosum", color='#6ee7b7', fontsize=7.5, fontfamily='sans-serif')
    save_image(fig, "demo_smri_superager_sagittal.png")
    plt.close(fig)

# 4. fMRI BOLD Functional Connectivity Axial (52yo) - Default Mode Network
def generate_fmri_bold_axial():
    fig, ax = plt.subplots(figsize=(5, 5), facecolor='black')
    ax.set_facecolor('black')
    
    y, x = np.ogrid[-120:120, -120:120]
    parenchyma = (x / 90)**2 + (y / 102)**2 <= 1.0
    
    # Underlay structural T1
    underlay = np.zeros((240, 240))
    underlay[parenchyma] = 0.35
    
    # DMN hubs (mPFC, Precuneus / PCC, Bilateral IPL)
    mpfc = ((x) / 18)**2 + ((y + 65) / 18)**2 <= 1.0
    pcc_precuneus = ((x) / 22)**2 + ((y - 48) / 22)**2 <= 1.0
    l_ipl = ((x + 58) / 16)**2 + ((y - 15) / 18)**2 <= 1.0
    r_ipl = ((x - 58) / 16)**2 + ((y - 15) / 18)**2 <= 1.0
    
    bold_signal = np.zeros((240, 240))
    # Gaussian heat around hubs
    d_mpfc = np.exp(-(((x)**2 + (y + 65)**2) / 350.0))
    d_pcc = np.exp(-(((x)**2 + (y - 48)**2) / 450.0))
    d_lipl = np.exp(-(((x + 58)**2 + (y - 15)**2) / 300.0))
    d_ripl = np.exp(-(((x - 58)**2 + (y - 15)**2) / 300.0))
    
    dmn_activation = (d_mpfc + d_pcc + d_lipl + d_ripl) * parenchyma
    
    # Plot underlay
    ax.imshow(underlay, cmap='gray', vmin=0, vmax=1)
    # Overlay fMRI BOLD thermal colormap
    overlay = np.ma.masked_where(dmn_activation < 0.25, dmn_activation)
    ax.imshow(overlay, cmap='plasma', alpha=0.85, vmin=0.25, vmax=1.0)
    
    ax.axis('off')
    ax.text(12, 22, "fMRI BOLD Functional Connectivity\nDefault Mode Network (52y)", color='#c084fc', fontsize=9, fontweight='bold', fontfamily='sans-serif')
    ax.text(12, 228, "Resting-State BOLD Synchrony | ALFF Index", color='#e9d5ff', fontsize=7.5, fontfamily='sans-serif')
    save_image(fig, "demo_fmri_bold_axial.png")
    plt.close(fig)

# 5. dMRI FA Tractography Coronal (61yo) - Directional Color Map
def generate_dmri_tractography_coronal():
    fig, ax = plt.subplots(figsize=(5, 5), facecolor='black')
    ax.set_facecolor('black')
    
    y, x = np.ogrid[-120:120, -120:120]
    parenchyma = (x / 90)**2 + (y / 96)**2 <= 1.0
    
    # Standard directional DTI colormap:
    # Red: Left-Right (e.g. Corpus Callosum)
    # Green: Anterior-Posterior (e.g. Longitudinal Fasciculus)
    # Blue: Superior-Inferior (e.g. Corticospinal Tract)
    rgb = np.zeros((240, 240, 3))
    
    # Corpus callosum (Red - Left/Right)
    cc = ((x) / 60)**2 + ((y - 5) / 12)**2 <= 1.0
    rgb[cc, 0] = 0.95 # Red
    rgb[cc, 1] = 0.15
    rgb[cc, 2] = 0.15
    
    # Corticospinal tracts (Blue - Superior/Inferior)
    cst_l = ((x + 28) / 10)**2 + ((y + 20) / 50)**2 <= 1.0
    cst_r = ((x - 28) / 10)**2 + ((y + 20) / 50)**2 <= 1.0
    rgb[cst_l | cst_r, 2] = 0.95 # Blue
    rgb[cst_l | cst_r, 0] = 0.12
    rgb[cst_l | cst_r, 1] = 0.20
    
    # Longitudinal fasciculus (Green - Anterior/Posterior)
    slf_l = ((x + 60) / 12)**2 + ((y - 10) / 38)**2 <= 1.0
    slf_r = ((x - 60) / 12)**2 + ((y - 10) / 38)**2 <= 1.0
    rgb[slf_l | slf_r, 1] = 0.92 # Green
    rgb[slf_l | slf_r, 0] = 0.15
    rgb[slf_l | slf_r, 2] = 0.25
    
    # Mask out background
    for c in range(3):
        rgb[~parenchyma, c] = 0.0
        
    ax.imshow(rgb)
    ax.axis('off')
    ax.text(12, 22, "dMRI Directional FA Map\nWhite Matter Tractography (61y)", color='#f59e0b', fontsize=9, fontweight='bold', fontfamily='sans-serif')
    ax.text(12, 228, "Red: L-R (CC) | Blue: S-I (CST) | Green: A-P (SLF)", color='#fde68a', fontsize=7.5, fontfamily='sans-serif')
    save_image(fig, "demo_dmri_tractography_coronal.png")
    plt.close(fig)

# 6. Severe Alzheimer's / Neurodegeneration sMRI Axial (78yo) - Ventriculomegaly
def generate_severe_alzheimers_smri_axial():
    fig, ax = plt.subplots(figsize=(5, 5), facecolor='black')
    ax.set_facecolor('black')
    
    y, x = np.ogrid[-120:120, -120:120]
    cranium = (x / 96)**2 + (y / 110)**2
    # Shrunken parenchyma with severe cortical thinning
    parenchyma = (x / 80)**2 + (y / 92)**2 <= 1.0
    
    # Massive compensatory ventricular enlargement (ex-vacuo hydrocephalus)
    v_left = ((x + 24) / 22)**2 + ((y - 6) / 44)**2 <= 1.0
    v_right = ((x - 24) / 22)**2 + ((y - 6) / 44)**2 <= 1.0
    ventricles = v_left | v_right
    
    img = np.zeros((240, 240))
    img[cranium <= 1.05] = 0.28
    img[parenchyma] = 0.58
    
    # Deep, prominent sulcal crevasses (severe atrophy)
    np.random.seed(999)
    sulcal_grooves = np.sin(x/2.8) * np.cos(y/2.8)
    img[parenchyma & (sulcal_grooves < -0.45)] = 0.08
    
    # Dark fluid in huge ventricles
    img[ventricles] = 0.04
    # Wide interhemispheric gap
    img[:, 114:126] = np.minimum(img[:, 114:126], 0.06)
    
    ax.imshow(img, cmap='gray', vmin=0, vmax=1)
    ax.axis('off')
    ax.text(12, 22, "sMRI T1w Axial\nSevere Neurodegeneration (78y)", color='#ef4444', fontsize=9, fontweight='bold', fontfamily='sans-serif')
    ax.text(12, 228, "Ex-Vacuo Ventriculomegaly | Severe Cortical Thinning", color='#fca5a5', fontsize=7.5, fontfamily='sans-serif')
    save_image(fig, "demo_smri_severe_alzheimers_axial.png")
    plt.close(fig)

if __name__ == "__main__":
    print("Generating 6 clinical neuroimaging demonstration scans...")
    generate_healthy_smri_axial()
    generate_mci_smri_coronal()
    generate_superager_smri_sagittal()
    generate_fmri_bold_axial()
    generate_dmri_tractography_coronal()
    generate_severe_alzheimers_smri_axial()
    print("All 6 demonstration scans generated successfully!")
