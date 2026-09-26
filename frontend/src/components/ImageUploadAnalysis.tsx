import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Image as ImageIcon, Sparkles, AlertCircle, 
  CheckCircle2, Download, ArrowRight, Brain, 
  Activity, Play, FileCheck, Layers, Eye, RefreshCw 
} from 'lucide-react';
import { ImageAnalysisResult, DemoScanItem, PatientInput } from '../types/pipeline';
import { uploadAndAnalyzeBrainImage, analyzeDemoScan, fetchDemoScans } from '../services/api';

interface ImageUploadAnalysisProps {
  onAnalyzeSuccess: (analysis: ImageAnalysisResult) => void;
  onRunPipelineWithImage: (patient: PatientInput) => void;
  isRunningPipeline: boolean;
}

export const ImageUploadAnalysis: React.FC<ImageUploadAnalysisProps> = ({
  onAnalyzeSuccess,
  onRunPipelineWithImage,
  isRunningPipeline,
}) => {
  const [demos, setDemos] = useState<DemoScanItem[]>([]);
  const [selectedDemoId, setSelectedDemoId] = useState<string>('demo-2');
  const [currentAnalysis, setCurrentAnalysis] = useState<ImageAnalysisResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('/demo_scans/demo_smri_mci_coronal.png');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load demo scans on mount
  useEffect(() => {
    async function loadDemos() {
      try {
        const demoList = await fetchDemoScans();
        setDemos(demoList);
        if (demoList.length > 0) {
          // Default analyze demo-2 (MCI Coronal) to show immediate rich clinical findings
          handleAnalyzeDemo('demo-2');
        }
      } catch (err) {
        console.warn('Failed to load demo scans:', err);
      }
    }
    loadDemos();
  }, []);

  const handleAnalyzeDemo = async (demoId: string) => {
    setSelectedDemoId(demoId);
    setAnalyzing(true);
    try {
      const result = await analyzeDemoScan(demoId);
      setCurrentAnalysis(result);
      setPreviewUrl(result.image_url || `/demo_scans/${result.filename}`);
      onAnalyzeSuccess(result);
    } catch (err) {
      console.error('Demo analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processUploadedFile(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processUploadedFile(file);
  };

  const processUploadedFile = async (file: File) => {
    setAnalyzing(true);
    // Create local object URL for instant preview
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    try {
      const result = await uploadAndAnalyzeBrainImage(file);
      setCurrentAnalysis(result);
      onAnalyzeSuccess(result);
    } catch (err) {
      console.error('File upload analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950/40 to-gray-900 border border-indigo-800/50 rounded-xl p-5 backdrop-blur">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-bold uppercase tracking-wider">
                VISION ENGINE
              </span>
              <h2 className="text-lg font-bold text-white m-0">
                Brain MRI Upload & Automated Morphometric Analysis
              </h2>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              Upload any brain neuroimaging scan (sMRI, fMRI, dMRI) or select from the 6 clinical demonstration scans below. 
              The automated computer vision engine extracts modality, plane, tissue volumetry, and hippocampal atrophy, then feeds directly into the SNN 4-stage pipeline.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded bg-gray-800 text-gray-300 border border-gray-700 font-mono">
              Supported: PNG • JPG • TIFF • DICOM/NIfTI Slices
            </span>
          </div>
        </div>
      </div>

      {/* 6 Demonstration Clinical Scans Gallery */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-gray-200 m-0">
              Demonstration Clinical Scans (6 Pre-Loaded Scans for Instant Evaluation)
            </h3>
          </div>
          <span className="text-xs text-gray-400 font-mono">Click any scan to analyze or download</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {demos.map((d) => {
            const isSelected = selectedDemoId === d.id;
            return (
              <div
                key={d.id}
                onClick={() => handleAnalyzeDemo(d.id)}
                className={`group relative rounded-xl border p-2 cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-950/60 border-cyan-400 shadow-md shadow-cyan-950/40 scale-[1.02]'
                    : 'bg-gray-950 border-gray-800 hover:border-gray-700 hover:bg-gray-900/60'
                }`}
              >
                <div>
                  <div className="aspect-square w-full rounded-lg overflow-hidden bg-black mb-2 relative border border-gray-800">
                    <img
                      src={d.image_url}
                      alt={d.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-cyan-300">
                      {d.plane}
                    </span>
                  </div>

                  <h4 className="text-[11px] font-bold text-white line-clamp-1 group-hover:text-cyan-300">
                    {d.title.split(':')[1] || d.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 line-clamp-2 mt-0.5 leading-tight">
                    {d.clinical_note}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-gray-800/80 flex items-center justify-between text-[10px]">
                  <span className={`font-mono font-bold ${
                    d.expected_bag.includes('+') ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {d.expected_bag.split(' ')[0]}
                  </span>
                  <a
                    href={d.image_url}
                    download={d.filename}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 text-gray-500 hover:text-white transition"
                    title="Download demo image"
                  >
                    <Download className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Work Area: Upload Drag-and-Drop + Interactive Image Vision Analysis Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Drag and Drop Upload Zone & Image Viewer */}
        <div className="lg:col-span-5 space-y-4">
          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center ${
              dragActive
                ? 'border-cyan-400 bg-cyan-950/20'
                : 'border-gray-800 hover:border-indigo-500 bg-gray-950/60'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="w-10 h-10 rounded-full bg-indigo-950 text-indigo-400 flex items-center justify-center mb-2">
              <Upload className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Click to browse or Drag & Drop Brain MRI</h4>
            <p className="text-[11px] text-gray-400">
              Upload custom sMRI, fMRI, or dMRI slice to run automated morphometric analysis
            </p>
          </div>

          {/* Active Image Visualizer */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-3.5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span className="flex items-center gap-1.5 font-medium text-white">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                Active Scan Preview
              </span>
              <span className="font-mono text-[10px] text-gray-400">
                {currentAnalysis?.filename || 'MRI Preview'}
              </span>
            </div>

            <div className="aspect-square w-full rounded-lg overflow-hidden bg-black border border-gray-800 relative flex items-center justify-center">
              {analyzing ? (
                <div className="flex flex-col items-center justify-center text-cyan-400">
                  <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                  <span className="text-xs font-mono">Running Vision Engine...</span>
                </div>
              ) : previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Brain Scan"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-gray-500 text-xs">No scan loaded</div>
              )}

              {/* Grid overlay for medical measurement feel */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>
          </div>
        </div>

        {/* Right: Computer Vision & Morphometric Analysis Results */}
        <div className="lg:col-span-7 bg-gray-900/40 border border-gray-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2 m-0">
                  <Brain className="w-4 h-4 text-cyan-400" />
                  Automated Computer Vision & Biomarker Extraction
                </h3>
                <span className="text-xs text-gray-400 font-mono">
                  Engine: NeuroVision Morphometric Feature Extractor
                </span>
              </div>

              {currentAnalysis && (
                <span className="text-xs px-2.5 py-0.5 rounded font-bold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {currentAnalysis.suggested_clinical_status}
                </span>
              )}
            </div>

            {currentAnalysis ? (
              <div className="space-y-4">
                {/* Modality & Plane Detection Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-gray-950 border border-gray-800 rounded-lg p-3">
                    <span className="text-[10px] text-gray-400 block mb-1">Detected Modality</span>
                    <div className="text-xs font-bold text-cyan-400 flex items-center justify-between">
                      <span>{currentAnalysis.detected_modality}</span>
                      <span className="font-mono text-[10px] text-gray-400">
                        {(currentAnalysis.modality_confidence * 100).toFixed(1)}% Conf.
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-950 border border-gray-800 rounded-lg p-3">
                    <span className="text-[10px] text-gray-400 block mb-1">Acquisition Plane</span>
                    <div className="text-xs font-bold text-purple-400 flex items-center justify-between">
                      <span>{currentAnalysis.detected_plane} View</span>
                      <span className="font-mono text-[10px] text-gray-400">
                        {(currentAnalysis.plane_confidence * 100).toFixed(1)}% Conf.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tissue Volumetry & Segmentation */}
                <div className="bg-gray-950 border border-gray-800 rounded-lg p-3.5 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white">Intracranial Tissue Segmentation</span>
                    <span className="font-mono text-[11px] text-gray-400">
                      SNR: {currentAnalysis.snr_quality} dB | CNR: {currentAnalysis.contrast_to_noise}
                    </span>
                  </div>

                  {/* Multi-segmented tissue bar */}
                  <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden flex">
                    <div
                      className="bg-indigo-500 h-full"
                      style={{ width: `${currentAnalysis.tissue_segmentation.gray_matter_pct}%` }}
                      title={`Gray Matter: ${currentAnalysis.tissue_segmentation.gray_matter_pct}%`}
                    />
                    <div
                      className="bg-cyan-500 h-full"
                      style={{ width: `${currentAnalysis.tissue_segmentation.white_matter_pct}%` }}
                      title={`White Matter: ${currentAnalysis.tissue_segmentation.white_matter_pct}%`}
                    />
                    <div
                      className="bg-amber-500 h-full"
                      style={{ width: `${currentAnalysis.tissue_segmentation.csf_pct}%` }}
                      title={`CSF: ${currentAnalysis.tissue_segmentation.csf_pct}%`}
                    />
                  </div>

                  <div className="grid grid-cols-3 text-center text-[10px] font-mono pt-1">
                    <div className="text-indigo-400">
                      Gray Matter: {currentAnalysis.tissue_segmentation.gray_matter_pct}%
                    </div>
                    <div className="text-cyan-400">
                      White Matter: {currentAnalysis.tissue_segmentation.white_matter_pct}%
                    </div>
                    <div className="text-amber-400">
                      CSF / Ventricles: {currentAnalysis.tissue_segmentation.csf_pct}%
                    </div>
                  </div>
                </div>

                {/* Morphometric Proxies */}
                <div className="grid grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-center">
                    <span className="text-[10px] text-gray-500 block">Ventriculo-Cranial</span>
                    <span className="font-mono font-bold text-white text-sm">
                      {currentAnalysis.ventriculo_cranial_ratio.toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-center">
                    <span className="text-[10px] text-gray-500 block">Hippocampal Vol.</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {currentAnalysis.hippocampal_volume_ratio.toFixed(2)}x
                    </span>
                  </div>
                  <div className="bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-center">
                    <span className="text-[10px] text-gray-500 block">Cortical Width</span>
                    <span className="font-mono font-bold text-purple-400 text-sm">
                      {currentAnalysis.cortical_thickness_proxy_mm.toFixed(2)} mm
                    </span>
                  </div>
                </div>

                {/* Pathological Anomalies Detected */}
                <div className="bg-gray-950 border border-gray-800 rounded-lg p-3 space-y-1.5">
                  <span className="text-xs font-semibold text-gray-200 block mb-1">
                    Computer Vision Morphometric Findings:
                  </span>
                  {currentAnalysis.anomalies_detected.map((anomaly, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{anomaly}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 text-xs">
                Select a demonstration scan above or upload an image to view automated morphometric findings.
              </div>
            )}
          </div>

          {/* Action Button: Run SNN 4-Stage Pipeline with this Image */}
          <div className="mt-4 pt-3 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-gray-400">
              Ready to feed extracted markers into Module 1 (GA+CSA) → Module 2 (SNN) → Module 3 (XAI) → Module 4 (SNN Fusion)
            </span>
            <button
              onClick={() => {
                if (currentAnalysis) {
                  onRunPipelineWithImage(currentAnalysis.derived_patient_profile);
                }
              }}
              disabled={!currentAnalysis || isRunningPipeline}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white shadow-lg transition-all ${
                !currentAnalysis || isRunningPipeline
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 hover:shadow-cyan-500/25 active:scale-95'
              }`}
            >
              {isRunningPipeline ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Executing SNN Pipeline...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Run SNN 4-Stage Pipeline with this Image
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
