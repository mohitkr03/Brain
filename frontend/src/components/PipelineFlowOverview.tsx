import React from 'react';
import { 
  ArrowDown, Brain, Zap, ShieldCheck, Network, 
  BarChart3, Award, Play, CheckCircle2, RefreshCw, 
  Dna, Sparkles, Upload, Layers, ArrowRight 
} from 'lucide-react';
import { TabKey } from './NavigationTabs';
import { PatientInput, FinalPipelineResponse } from '../types/pipeline';

interface OverviewProps {
  pipelineData: FinalPipelineResponse | null;
  patient: PatientInput;
  onNavigate: (tab: TabKey) => void;
  onRunFullPipeline: () => void;
  isRunning: boolean;
}

export const PipelineFlowOverview: React.FC<OverviewProps> = ({
  pipelineData,
  patient,
  onNavigate,
  onRunFullPipeline,
  isRunning
}) => {
  return (
    <div className="space-y-6">
      {/* Overview Intro Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950/40 to-gray-900 border border-indigo-900/40 rounded-xl p-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-bold uppercase tracking-wider">
                PhD Research Framework
              </span>
              <span className="text-xs text-gray-400 font-mono">
                Spiking Neural Networks (SNN) & Neuromorphic Neuroimaging
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight mb-2">
              SNN-Based Multimodal Brain Age Prediction Pipeline
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              Neuromorphic multimodal framework combining <strong className="text-cyan-400">sMRI</strong>, <strong className="text-purple-400">fMRI</strong>, and <strong className="text-amber-400">dMRI</strong>. 
              Module 1 (Evolutionary GA+CSA) selects optimal biomarkers; Module 2 (LIF SNN) computes brain age delta with 4.4x energy savings; 
              Module 3 (XAI + Permutation) explains regional drivers; and Module 4 (SNN Fusion) performs topological graph fusion.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onNavigate('upload')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-gray-200 bg-gray-800 hover:bg-gray-700 border border-gray-700 transition"
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              Upload Brain MRI
            </button>

            <button
              onClick={onRunFullPipeline}
              disabled={isRunning}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white shadow-lg transition-all ${
                isRunning
                  ? 'bg-indigo-700/60 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 hover:shadow-cyan-500/25 active:scale-95'
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running SNN Pipeline...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Execute Full Pipeline
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive System Flow Diagram matching the PhD framework */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Proposed SNN-Based PhD Framework Architecture (Click any module to inspect live outputs)
          </h3>
          <span className="text-xs text-gray-400 font-mono">Status: {pipelineData ? 'Synchronized' : 'Ready'}</span>
        </div>

        {/* 1. INPUT BOX */}
        <div className="border border-blue-900/60 bg-blue-950/20 rounded-xl p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded bg-blue-900 text-blue-200 font-black text-xs uppercase tracking-wider">
                INPUT
              </span>
              <span className="text-xs font-bold text-white">Multimodal Neuroimaging Data & Chronological Demographics</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-2.5 py-1 rounded bg-gray-900 border border-gray-800 text-cyan-300 font-mono">
                Structural MRI (sMRI)
              </span>
              <span className="px-2.5 py-1 rounded bg-gray-900 border border-gray-800 text-purple-300 font-mono">
                Functional MRI (fMRI)
              </span>
              <span className="px-2.5 py-1 rounded bg-gray-900 border border-gray-800 text-amber-300 font-mono">
                Diffusion MRI (dMRI)
              </span>
              <span className="px-2.5 py-1 rounded bg-gray-900 border border-gray-800 text-emerald-300 font-mono font-bold">
                Age: {patient.chronological_age} yrs
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowDown className="w-5 h-5 text-indigo-500 animate-bounce" />
        </div>

        {/* 2. MODULE 1: Evolutionary Optimization (GA + CSA) */}
        <div
          onClick={() => onNavigate('module1')}
          className="group border border-purple-900/50 hover:border-purple-500/80 bg-purple-950/10 hover:bg-purple-950/25 rounded-xl p-4 cursor-pointer transition-all shadow-sm hover:shadow-purple-950/40"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800 font-black text-xs uppercase tracking-wider">
                MODULE 1
              </span>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                  Evolutionary Optimization (GA + CSA)
                </h4>
                <p className="text-[11px] text-gray-400">
                  Genetic Algorithm (GA) • Clonal Selection Algorithm (CSA) • SNN Hyperparameter Tuning • Optimal Feature Mask
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              {pipelineData ? (
                <span className="flex items-center gap-1.5 text-purple-300 font-mono font-bold">
                  CSA Affinity: {pipelineData.module1_optimization.csa_best_affinity.toFixed(4)}
                </span>
              ) : (
                <span className="text-gray-500 font-mono">Ready to Optimize</span>
              )}
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowDown className="w-5 h-5 text-indigo-500 animate-bounce" />
        </div>

        {/* 3. MODULE 2: SNN-Based Brain Age Prediction */}
        <div
          onClick={() => onNavigate('module2')}
          className="group border border-cyan-900/50 hover:border-cyan-500/80 bg-cyan-950/10 hover:bg-cyan-950/25 rounded-xl p-4 cursor-pointer transition-all shadow-sm hover:shadow-cyan-950/40"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-black text-xs uppercase tracking-wider">
                MODULE 2
              </span>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                  SNN-Based Brain Age Prediction (Spiking Neural Network)
                </h4>
                <p className="text-[11px] text-gray-400">
                  Leaky Integrate-and-Fire (LIF) Dynamics • Temporal Spike Raster • Conv1D-SNN • Bias Correction • Brain Age Delta (BAG)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              {pipelineData ? (
                <span className="flex items-center gap-1.5 text-cyan-300 font-mono font-bold">
                  BAG: {pipelineData.module2_snn.brain_age_delta > 0 ? `+${pipelineData.module2_snn.brain_age_delta}` : pipelineData.module2_snn.brain_age_delta}y ({pipelineData.module2_snn.energy_metrics.energy_efficiency_gain_x}x Less Energy)
                </span>
              ) : (
                <span className="text-gray-500 font-mono">Ready to Simulate</span>
              )}
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowDown className="w-5 h-5 text-indigo-500 animate-bounce" />
        </div>

        {/* 4. MODULE 3: Explainable AI (Attention + SHAP + Saliency + Permutation Importance) */}
        <div
          onClick={() => onNavigate('module3')}
          className="group border border-amber-900/50 hover:border-amber-500/80 bg-amber-950/10 hover:bg-amber-950/25 rounded-xl p-4 cursor-pointer transition-all shadow-sm hover:shadow-amber-950/40"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800 font-black text-xs uppercase tracking-wider">
                MODULE 3
              </span>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                  Explainable AI (Attention + SHAP + Saliency + Permutation Importance)
                </h4>
                <p className="text-[11px] text-gray-400">
                  Spike/Neural Attention • SHAP Values • Gradient Saliency • Permutation Feature Importance (Δ MAE) • Clinical Report
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              {pipelineData ? (
                <span className="flex items-center gap-1.5 text-amber-300 font-mono">
                  <Brain className="w-3.5 h-3.5" /> Top Driver: {pipelineData.module3_xai.top_important_regions[0]?.region_name}
                </span>
              ) : (
                <span className="text-gray-500 font-mono">Awaiting Execution</span>
              )}
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowDown className="w-5 h-5 text-indigo-500 animate-bounce" />
        </div>

        {/* 5. MODULE 4: Advanced Multimodal Learning */}
        <div
          onClick={() => onNavigate('module4')}
          className="group border border-emerald-900/50 hover:border-emerald-500/80 bg-emerald-950/10 hover:bg-emerald-950/25 rounded-xl p-4 cursor-pointer transition-all shadow-sm hover:shadow-emerald-950/40"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-black text-xs uppercase tracking-wider">
                MODULE 4
              </span>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                  Advanced Multimodal Learning (SNN Advanced Fusion)
                </h4>
                <p className="text-[11px] text-gray-400">
                  sMRI + fMRI + dMRI → Multimodal Attention → SNN Advanced Fusion (Spiking GNN) → Brain Age & BAG
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              {pipelineData ? (
                <span className="flex items-center gap-1.5 text-emerald-300 font-mono font-bold">
                  Final Fused Age: {pipelineData.module4_fusion.final_corrected_age.toFixed(1)}y
                </span>
              ) : (
                <span className="text-gray-500 font-mono">Awaiting Execution</span>
              )}
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowDown className="w-5 h-5 text-indigo-500 animate-bounce" />
        </div>

        {/* 6. PERFORMANCE EVALUATION & FINAL OUTPUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => onNavigate('evaluation')}
            className="group border border-blue-900/50 hover:border-blue-500/80 bg-blue-950/10 hover:bg-blue-950/25 rounded-xl p-4 cursor-pointer transition-all shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold text-xs uppercase tracking-wider">
                PERFORMANCE & SNN ENERGY
              </span>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">MAE, RMSE, R² Score, Bland-Altman & Synaptic SOPs</h4>
            <p className="text-[11px] text-gray-400 leading-tight">
              Benchmarking across N=500 cohort subjects. Demonstrating 4.4x energy reduction and 83.2% spiking sparsity.
            </p>
          </div>

          <div
            onClick={() => onNavigate('final_output')}
            className="group border border-emerald-900/60 hover:border-emerald-400 bg-gradient-to-r from-emerald-950/30 to-indigo-950/30 rounded-xl p-4 cursor-pointer transition-all shadow-md hover:shadow-emerald-950/50"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-900 text-emerald-200 font-bold text-xs uppercase tracking-wider">
                FINAL OUTPUT
              </span>
              <Award className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              Predicted Age • Corrected Age • BAG • Important Regions • Clinical Diagnostic Report
            </h4>
            <p className="text-[11px] text-emerald-300/80 leading-tight">
              Integrated multi-stage synthesis combining all 4 modules into a printable diagnostic report.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
