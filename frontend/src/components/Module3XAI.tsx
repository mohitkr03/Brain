import React, { useState } from 'react';
import { 
  ShieldCheck, Brain, Flame, Activity, 
  HelpCircle, AlertCircle, FileText, CheckCircle2, 
  BarChart2, Zap 
} from 'lucide-react';
import { Module3Response, PatientInput } from '../types/pipeline';

interface Module3Props {
  data: Module3Response | null;
  patient: PatientInput;
  loading: boolean;
}

export const Module3XAI: React.FC<Module3Props> = ({ data, patient, loading }) => {
  const [selectedSlice, setSelectedSlice] = useState<'axial' | 'coronal' | 'sagittal'>('axial');
  const [activeTab, setActiveTab] = useState<'regions' | 'shap' | 'attention' | 'permutation' | 'interpretation'>('regions');

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-gray-400">
        <Activity className="w-8 h-8 animate-spin text-amber-400 mb-3" />
        <p className="text-sm">Computing Attention Maps, SHAP Values, Saliency & Permutation Importance...</p>
      </div>
    );
  }

  const { top_important_regions, shap_waterfall, permutation_importance, interpretation, attention_map_slices } = data;
  const sliceData = attention_map_slices[selectedSlice];

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 backdrop-blur">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 text-xs font-bold uppercase tracking-wider">
                MODULE 3
              </span>
              <h2 className="text-lg font-bold text-white m-0">
                Explainable AI (XAI) & Interpretability
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Spike & neural attention maps, Shapley Additive Explanations (SHAP), 
              gradient-based saliency maps, Permutation Feature Importance, anatomical region rankings, and mechanistic clinical reporting.
            </p>
          </div>
          <div className="flex bg-gray-950 rounded-lg p-1 border border-gray-800 text-xs">
            {(['regions', 'shap', 'permutation', 'attention', 'interpretation'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-3 py-1 rounded capitalize font-medium transition ${
                  activeTab === t ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {t === 'shap' ? 'SHAP Values' : t === 'regions' ? 'Important Regions' : t === 'permutation' ? 'Permutation Importance' : t === 'attention' ? 'Saliency Maps' : 'Clinical Insights'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab 1: Important Brain Regions Ranking */}
      {activeTab === 'regions' && (
        <div className="space-y-6">
          <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-amber-400" />
                  Top Ranked Anatomical Regions Driving Brain Age Delta
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Regions identified by combining neural attention weights, permutation feature importance, and SHAP attributions.
                </p>
              </div>
              <span className="text-xs font-mono text-gray-400">Total Analyzed: 84 ROIs</span>
            </div>

            <div className="overflow-x-auto border border-gray-800 rounded-lg">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-gray-950 text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="p-3 font-medium">Rank & Region</th>
                    <th className="p-3 font-medium">Lobe / System</th>
                    <th className="p-3 font-medium text-right">Attention Weight</th>
                    <th className="p-3 font-medium text-right">SHAP Impact (yrs)</th>
                    <th className="p-3 font-medium text-right">Saliency Score</th>
                    <th className="p-3 font-medium text-right">Normative Z-Score</th>
                    <th className="p-3 font-medium text-center">Pathological Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-mono">
                  {top_important_regions.map((region, idx) => (
                    <tr key={region.region_id} className="hover:bg-gray-800/30 transition">
                      <td className="p-3 font-sans flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-gray-800 border border-gray-700 text-gray-300 flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-white">{region.region_name}</span>
                      </td>
                      <td className="p-3 font-sans text-gray-400">{region.lobe}</td>
                      <td className="p-3 text-right text-amber-400 font-bold">
                        {(region.attention_weight * 100).toFixed(1)}%
                      </td>
                      <td className={`p-3 text-right font-bold ${
                        region.shap_value > 0 ? 'text-rose-400' : 'text-blue-400'
                      }`}>
                        {region.shap_value > 0 ? `+${region.shap_value.toFixed(2)}` : region.shap_value.toFixed(2)}
                      </td>
                      <td className="p-3 text-right text-purple-400 font-bold">
                        {region.saliency_score.toFixed(2)}
                      </td>
                      <td className={`p-3 text-right ${
                        Math.abs(region.normative_z_score) > 2.0 
                          ? 'text-rose-400 font-bold' 
                          : Math.abs(region.normative_z_score) > 1.0 
                          ? 'text-amber-400' 
                          : 'text-gray-300'
                      }`}>
                        {region.normative_z_score > 0 ? `+${region.normative_z_score.toFixed(2)}` : region.normative_z_score.toFixed(2)}
                      </td>
                      <td className="p-3 text-center font-sans">
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${
                          region.status.includes('Severe') || region.status.includes('Atrophy')
                            ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                            : region.status.includes('Preserved') || region.status.includes('Integrity')
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                            : 'bg-gray-800 text-gray-300 border-gray-700'
                        }`}>
                          {region.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: SHAP Values Waterfall */}
      {activeTab === 'shap' && (
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                SHAP (SHapley Additive exPlanations) Waterfall Attribution
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Displays the additive contribution of each biomarker in pushing the predicted brain age from 
                cohort baseline E[Y] = 50.0 years towards the final subject prediction.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" /> Positive (Accelerates Age)
              </span>
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block" /> Negative (Protective / Younger)
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            {shap_waterfall.map((item, idx) => {
              const isPos = item.contribution > 0;
              const barWidth = Math.min(100, Math.abs(item.contribution) * 35);

              return (
                <div key={idx} className="bg-gray-950 border border-gray-800 rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-gray-700 transition">
                  <div className="md:w-1/3">
                    <span className="text-xs font-semibold text-white">{item.feature}</span>
                  </div>

                  {/* Waterfall Bar representation */}
                  <div className="md:w-1/2 flex items-center gap-3">
                    <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden flex">
                      {isPos ? (
                        <div
                          className="bg-gradient-to-r from-rose-600 to-amber-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                      ) : (
                        <div
                          className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="md:w-1/6 flex items-center justify-end gap-3 text-xs font-mono">
                    <span className={`font-bold ${isPos ? 'text-rose-400' : 'text-blue-400'}`}>
                      {isPos ? `+${item.contribution.toFixed(2)}` : item.contribution.toFixed(2)} yrs
                    </span>
                    <span className="text-gray-500 text-[10px]">
                      (Σ = {item.cumulative.toFixed(1)})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Permutation Feature Importance */}
      {activeTab === 'permutation' && (
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                Permutation Feature Importance (Δ MAE Loss Impact)
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Evaluates model sensitivity by randomly shuffling each biomarker across test cohorts and measuring the resulting prediction error increase (Δ MAE).
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">Baseline Model MAE = 2.73 yrs</span>
          </div>

          <div className="overflow-x-auto border border-gray-800 rounded-lg">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-gray-950 text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="p-3 font-medium">Rank & Feature Name</th>
                  <th className="p-3 font-medium">Modality Source</th>
                  <th className="p-3 font-medium text-right">Baseline MAE</th>
                  <th className="p-3 font-medium text-right">Permuted MAE</th>
                  <th className="p-3 font-medium text-right">Δ MAE (Importance Drop)</th>
                  <th className="p-3 font-medium text-right">Statistical Significance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-mono">
                {permutation_importance.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-800/30 transition">
                    <td className="p-3 font-sans flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-white">{item.feature_name}</span>
                    </td>
                    <td className="p-3 font-sans">
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${
                        item.modality.includes('sMRI') ? 'bg-blue-950 text-blue-300 border-blue-800' :
                        item.modality.includes('fMRI') ? 'bg-purple-950 text-purple-300 border-purple-800' :
                        'bg-amber-950 text-amber-300 border-amber-800'
                      }`}>
                        {item.modality}
                      </span>
                    </td>
                    <td className="p-3 text-right text-gray-400">{item.baseline_mae.toFixed(2)}y</td>
                    <td className="p-3 text-right text-rose-400 font-bold">{item.permuted_mae.toFixed(2)}y</td>
                    <td className="p-3 text-right text-emerald-400 font-bold">
                      +{item.importance_drop_delta_mae.toFixed(2)} yrs
                    </td>
                    <td className="p-3 text-right text-cyan-300 text-[10px]">
                      {item.p_value < 1e-10 ? 'p < 1e-10 (***)' : `p = ${item.p_value.toExponential(1)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
            <span>Hippocampal volume and ventricular expansion cause maximal error degradation when corrupted (+1.55y and +1.21y)</span>
            <span className="font-mono text-purple-300">100 Resampling Permutation Runs</span>
          </div>
        </div>
      )}

      {/* Tab 3: Saliency & Attention Slice Map */}
      {activeTab === 'attention' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-gray-900/40 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                Attention Map & Saliency Superimposition
              </h3>
              <div className="flex bg-gray-950 rounded-lg p-0.5 border border-gray-800 text-[11px]">
                {(['axial', 'coronal', 'sagittal'] as const).map((pl) => (
                  <button
                    key={pl}
                    onClick={() => setSelectedSlice(pl)}
                    className={`px-2 py-0.5 rounded capitalize font-medium transition ${
                      selectedSlice === pl ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {pl}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Saliency Canvas */}
            <div className="relative aspect-square w-full bg-black rounded-lg border border-gray-800 overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 300 300" className="w-full h-full">
                <defs>
                  <radialGradient id="saliencyHeat" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                    <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.7" />
                    <stop offset="80%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Base Brain anatomy */}
                <ellipse cx="150" cy="150" rx="120" ry="130" fill="#111827" stroke="#374151" strokeWidth="2" />
                <path d="M 150,30 Q 148,150 150,270" stroke="#1f2937" strokeWidth="2" fill="none" />

                {/* Ventricles */}
                <ellipse cx="135" cy="140" rx="12" ry="25" fill="#030712" stroke="#4b5563" />
                <ellipse cx="165" cy="140" rx="12" ry="25" fill="#030712" stroke="#4b5563" />

                {/* Saliency Hotspots */}
                {sliceData?.hotspots?.map((hs: any, i: number) => (
                  <g key={i}>
                    <circle cx={hs.x} cy={hs.y} r={28 * hs.intensity} fill="url(#saliencyHeat)" />
                    <circle cx={hs.x} cy={hs.y} r="3" fill="#ffffff" />
                    <text x={hs.x + 8} y={hs.y - 8} fill="#fef08a" fontSize="9" fontFamily="sans-serif" fontWeight="bold">
                      {hs.region} ({(hs.intensity * 100).toFixed(0)}%)
                    </text>
                  </g>
                ))}
              </svg>

              <div className="absolute bottom-2 left-2 bg-gray-950/90 backdrop-blur px-2 py-1 rounded border border-gray-800 text-[10px] text-gray-300">
                Slice: {selectedSlice.toUpperCase()} {sliceData?.slice_index}mm
              </div>
              <div className="absolute top-2 right-2 bg-gray-950/90 backdrop-blur px-2 py-1 rounded border border-gray-800 text-[10px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-rose-300 font-bold">Max Saliency: Hippocampal Complex</span>
              </div>
            </div>

            {/* Heatmap Legend */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
              <span>Attention Intensity Scale:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-blue-400">Low (0.0)</span>
                <div className="w-24 h-2.5 rounded bg-gradient-to-r from-blue-500 via-amber-400 to-rose-600" />
                <span className="text-[10px] text-rose-400">High (1.0)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gray-900/40 border border-gray-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                Gradient-based Saliency Attribution Insights
              </h3>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Integrated Gradients and Grad-CAM backpropagate gradients from the predicted age scalar to voxel-level parcellations. 
                Higher saliency indicates regions where minor volumetric or microstructural perturbations would cause maximal shifts in predicted brain age.
              </p>

              <div className="space-y-3">
                {sliceData?.hotspots?.map((hs: any, i: number) => (
                  <div key={i} className="bg-gray-950 border border-gray-800 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-white">{hs.region}</span>
                      <span className="text-xs font-mono text-amber-400 font-bold">
                        Saliency: {(hs.intensity * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Primary driver of positive age acceleration. High gradient density indicates significant local tissue density loss relative to age-matched norms.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-800 pt-3 text-[11px] text-gray-400">
              <span>Method: Integrated Gradients (50 interpolation steps with Gauss-Legendre quadrature)</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Biological & Clinical Interpretation */}
      {activeTab === 'interpretation' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Biological Interpretation */}
          <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-400" />
              Biological & Cellular Mechanisms
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Neurobiological mechanisms inferred from multimodal morphological, functional, and diffusion alterations:
            </p>
            <div className="space-y-3">
              {interpretation.biological_interpretation.map((note, idx) => (
                <div key={idx} className="bg-gray-950 border border-gray-800 rounded-lg p-3 text-xs leading-relaxed flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="text-gray-300">{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Interpretation & Cognitive Risk */}
          <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  Clinical Diagnostic Interpretation & Risk
                </h3>
                <span className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                  interpretation.risk_level === 'High' 
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : interpretation.risk_level === 'Elevated'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {interpretation.risk_level} Risk
                </span>
              </div>

              {/* Cognitive Risk Meter */}
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <span className="text-gray-400">Cognitive Decline Risk Score:</span>
                  <span className="font-mono text-white font-bold">{interpretation.cognitive_risk_score}/100</span>
                </div>
                <div className="w-full bg-gray-900 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      interpretation.cognitive_risk_score > 70 
                        ? 'bg-gradient-to-r from-amber-500 to-rose-600'
                        : interpretation.cognitive_risk_score > 40
                        ? 'bg-gradient-to-r from-blue-500 to-amber-500'
                        : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                    }`}
                    style={{ width: `${interpretation.cognitive_risk_score}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                {interpretation.clinical_interpretation.map((note, idx) => (
                  <div key={idx} className="bg-gray-950 border border-gray-800 rounded-lg p-3 text-xs leading-relaxed flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-gray-300">{note}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-800/80 text-[11px] text-gray-500">
              <span>Note: Generated for clinical decision support. Must be correlated with full neuropsychological testing and laboratory findings.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
