import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NavigationTabs, TabKey } from './components/NavigationTabs';
import { ImageUploadAnalysis } from './components/ImageUploadAnalysis';
import { PipelineFlowOverview } from './components/PipelineFlowOverview';
import { Module1Optimization } from './components/Module1Optimization';
import { Module2SNN } from './components/Module2SNN';
import { Module3XAI } from './components/Module3XAI';
import { Module4Fusion } from './components/Module4Fusion';
import { PerformanceEvaluation } from './components/PerformanceEvaluation';
import { FinalOutput } from './components/FinalOutput';
import { 
  PatientInput, FinalPipelineResponse, ImageAnalysisResult,
  Module1OptimizationResponse, Module2SNNResponse,
  Module3Response, Module4Response, EvaluationResponse, PreprocessingResponse
} from './types/pipeline';
import { 
  fetchPresetPatients, runFullPipeline 
} from './services/api';

const DEFAULT_PRESETS: PatientInput[] = [
  {
    id: 'PAT-01',
    name: 'Eleanor Vance (Accelerated Aging / aMCI)',
    chronological_age: 68.0,
    gender: 'Female',
    clinical_status: 'Accelerated Aging',
    smri_quality: 0.94,
    fmri_quality: 0.89,
    dmri_quality: 0.86,
    hippocampal_volume_ratio: 0.74,
    ventricular_volume_ratio: 1.65,
  },
  {
    id: 'PAT-02',
    name: 'Marcus Hayes (Healthy Normal Control)',
    chronological_age: 45.0,
    gender: 'Male',
    clinical_status: 'Healthy',
    smri_quality: 0.98,
    fmri_quality: 0.95,
    dmri_quality: 0.93,
    hippocampal_volume_ratio: 1.01,
    ventricular_volume_ratio: 0.98,
  },
  {
    id: 'PAT-03',
    name: 'Dr. Arthur Pendelton (Super-Ager)',
    chronological_age: 74.0,
    gender: 'Male',
    clinical_status: 'Super-Ager',
    smri_quality: 0.96,
    fmri_quality: 0.94,
    dmri_quality: 0.92,
    hippocampal_volume_ratio: 1.12,
    ventricular_volume_ratio: 0.86,
  },
];

export function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('upload');
  const [presets, setPresets] = useState<PatientInput[]>(DEFAULT_PRESETS);
  const [selectedPatient, setSelectedPatient] = useState<PatientInput>(DEFAULT_PRESETS[0]);
  
  const [pipelineData, setPipelineData] = useState<FinalPipelineResponse | null>(null);
  const [m1Data, setM1Data] = useState<Module1OptimizationResponse | null>(null);
  const [m2Data, setM2Data] = useState<Module2SNNResponse | null>(null);
  const [m3Data, setM3Data] = useState<Module3Response | null>(null);
  const [m4Data, setM4Data] = useState<Module4Response | null>(null);
  const [evalData, setEvalData] = useState<EvaluationResponse | null>(null);
  const [preData, setPreData] = useState<PreprocessingResponse | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [isRunningPipeline, setIsRunningPipeline] = useState<boolean>(false);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);

  // Initialize: Check backend connection and fetch presets
  useEffect(() => {
    async function init() {
      try {
        const fetchedPresets = await fetchPresetPatients();
        if (fetchedPresets && fetchedPresets.length > 0) {
          setPresets(fetchedPresets);
          setSelectedPatient(fetchedPresets[0]);
        }
        setBackendOnline(true);
        executePipeline(fetchedPresets?.[0] || DEFAULT_PRESETS[0]);
      } catch (err) {
        console.warn('Backend connecting or offline, will retry:', err);
        setBackendOnline(false);
      }
    }
    init();
  }, []);

  const handleSelectPatient = (patient: PatientInput) => {
    setSelectedPatient(patient);
    executePipeline(patient);
  };

  const executePipeline = async (patient: PatientInput) => {
    setLoading(true);
    try {
      const result = await runFullPipeline(patient);
      setPipelineData(result);
      setPreData(result.preprocessing);
      setM1Data(result.module1_optimization);
      setM2Data(result.module2_snn);
      setM3Data(result.module3_xai);
      setM4Data(result.module4_fusion);
      setEvalData(result.evaluation);
      setBackendOnline(true);
    } catch (err) {
      console.error('Pipeline execution error:', err);
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRunFullPipeline = async () => {
    setIsRunningPipeline(true);
    try {
      const result = await runFullPipeline(selectedPatient);
      setPipelineData(result);
      setPreData(result.preprocessing);
      setM1Data(result.module1_optimization);
      setM2Data(result.module2_snn);
      setM3Data(result.module3_xai);
      setM4Data(result.module4_fusion);
      setEvalData(result.evaluation);
      setBackendOnline(true);
      setActiveTab('final_output');
    } catch (err) {
      console.error('Error running full pipeline:', err);
    } finally {
      setIsRunningPipeline(false);
    }
  };

  // Called when image is analyzed
  const handleImageAnalyzed = (analysis: ImageAnalysisResult) => {
    // Optionally add derived patient to presets if not existing
    const exists = presets.some((p) => p.id === analysis.derived_patient_profile.id);
    if (!exists) {
      setPresets((prev) => [analysis.derived_patient_profile, ...prev]);
    }
    setSelectedPatient(analysis.derived_patient_profile);
  };

  // Called when user clicks "Run SNN 4-Stage Pipeline with this Image"
  const handleRunPipelineWithImage = async (derivedPatient: PatientInput) => {
    setSelectedPatient(derivedPatient);
    setIsRunningPipeline(true);
    try {
      const result = await runFullPipeline(derivedPatient);
      setPipelineData(result);
      setPreData(result.preprocessing);
      setM1Data(result.module1_optimization);
      setM2Data(result.module2_snn);
      setM3Data(result.module3_xai);
      setM4Data(result.module4_fusion);
      setEvalData(result.evaluation);
      setBackendOnline(true);
      setActiveTab('final_output');
    } catch (err) {
      console.error('Error running pipeline with image profile:', err);
    } finally {
      setIsRunningPipeline(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Header */}
      <Header
        presets={presets}
        selectedPatient={selectedPatient}
        onSelectPatient={handleSelectPatient}
        onRunFullPipeline={handleRunFullPipeline}
        isRunningPipeline={isRunningPipeline}
        backendOnline={backendOnline}
      />

      {/* Navigation tabs matching SNN PhD framework */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {/* TAB 1: Image Upload & Vision Analysis */}
        {activeTab === 'upload' && (
          <ImageUploadAnalysis
            onAnalyzeSuccess={handleImageAnalyzed}
            onRunPipelineWithImage={handleRunPipelineWithImage}
            isRunningPipeline={isRunningPipeline}
          />
        )}

        {/* TAB 2: Overview & SNN Flow */}
        {activeTab === 'overview' && (
          <PipelineFlowOverview
            pipelineData={pipelineData}
            patient={selectedPatient}
            onNavigate={(tab) => setActiveTab(tab)}
            onRunFullPipeline={handleRunFullPipeline}
            isRunning={isRunningPipeline}
          />
        )}

        {/* TAB 3: Module 1 — Evolutionary Optimization (GA + CSA) */}
        {activeTab === 'module1' && (
          <Module1Optimization
            data={m1Data}
            patient={selectedPatient}
            loading={loading}
          />
        )}

        {/* TAB 4: Module 2 — SNN Brain Age Prediction */}
        {activeTab === 'module2' && (
          <Module2SNN
            data={m2Data}
            patient={selectedPatient}
            loading={loading}
          />
        )}

        {/* TAB 5: Module 3 — Explainable AI (Attention + SHAP + Saliency + Permutation) */}
        {activeTab === 'module3' && (
          <Module3XAI
            data={m3Data}
            patient={selectedPatient}
            loading={loading}
          />
        )}

        {/* TAB 6: Module 4 — Advanced Multimodal Learning (SNN Fusion) */}
        {activeTab === 'module4' && (
          <Module4Fusion
            data={m4Data}
            patient={selectedPatient}
            loading={loading}
          />
        )}

        {/* TAB 7: Performance & SNN Energy Evaluation */}
        {activeTab === 'evaluation' && (
          <PerformanceEvaluation
            data={evalData}
            loading={loading}
          />
        )}

        {/* TAB 8: Final Combined Output */}
        {activeTab === 'final_output' && (
          <FinalOutput
            patient={selectedPatient}
            module1={preData}
            module2={m2Data}
            module3={m3Data}
            module4={m4Data}
            evaluation={evalData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 bg-gray-950 py-4 px-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SNN NeuroAge XAI Platform • Spiking Neural Networks (sMRI, fMRI, dMRI)</span>
          <span className="font-mono text-[11px]">
            Module 1 (GA+CSA) • Module 2 (SNN LIF) • Module 3 (XAI + Permutation) • Module 4 (SNN Fusion)
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
