import React, { useState } from 'react';
import { 
  Dna, Sliders, TrendingUp, CheckCircle2, 
  Cpu, Layers, Sparkles, Filter 
} from 'lucide-react';
import { Module1OptimizationResponse, PatientInput } from '../types/pipeline';

interface Module1Props {
  data: Module1OptimizationResponse | null;
  patient: PatientInput;
  loading: boolean;
}

export const Module1Optimization: React.FC<Module1Props> = ({ data, patient, loading }) => {
  const [activeTab, setActiveTab] = useState<'convergence' | 'features' | 'hyperparameters'>('convergence');
  const [filterModality, setFilterModality] = useState<'all' | 'Structural' | 'Functional' | 'Diffusion'>('all');

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-gray-400">
        <Dna className="w-8 h-8 animate-spin text-purple-400 mb-3" />
        <p className="text-sm">Running Evolutionary Optimization (GA + CSA) & SNN Hyperparameter Search...</p>
      </div>
    );
  }

  const { optimization_history, feature_selection_matrix, optimal_snn_hyperparameters, sparsity_ratio_pct, ga_best_fitness, csa_best_affinity } = data;

  const filteredFeatures = feature_selection_matrix.filter((item) => {
    if (filterModality === 'all') return true;
    return item.modality.toLowerCase() === filterModality.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Module Title & Overview */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 backdrop-blur">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800 text-xs font-bold uppercase tracking-wider">
                MODULE 1
              </span>
              <h2 className="text-lg font-bold text-white m-0">
                Evolutionary Optimization (GA + CSA)
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Dual-evolutionary pipeline combining Genetic Algorithm (GA) crossover/mutation and Clonal Selection Algorithm (CSA) 
              somatic hypermutation to optimize multimodal feature selection and SNN Leaky Integrate-and-Fire (LIF) hyperparameters.
            </p>
          </div>
          <div className="flex bg-gray-950 rounded-lg p-1 border border-gray-800 text-xs">
            {(['convergence', 'features', 'hyperparameters'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-3 py-1 rounded capitalize font-medium transition ${
                  activeTab === t ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {t === 'convergence' ? 'GA / CSA Convergence' : t === 'features' ? 'Feature Selection Matrix' : 'SNN Hyperparameters'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
          <span className="text-[11px] text-gray-400 block mb-1">GA Best Fitness</span>
          <div className="text-2xl font-black text-indigo-400 font-mono">
            {ga_best_fitness.toFixed(4)}
          </div>
          <span className="text-[10px] text-gray-500 block mt-1">Tournament selection + 2-pt crossover</span>
        </div>

        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
          <span className="text-[11px] text-gray-400 block mb-1">CSA Best Affinity</span>
          <div className="text-2xl font-black text-purple-400 font-mono">
            {csa_best_affinity.toFixed(4)}
          </div>
          <span className="text-[10px] text-gray-500 block mt-1">Somatic hypermutation convergence</span>
        </div>

        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
          <span className="text-[11px] text-gray-400 block mb-1">Feature Pruning Sparsity</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {sparsity_ratio_pct}%
          </div>
          <span className="text-[10px] text-gray-500 block mt-1">Reduced from 18 to consensus set</span>
        </div>

        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
          <span className="text-[11px] text-gray-400 block mb-1">SNN Time Window</span>
          <div className="text-2xl font-black text-cyan-400 font-mono">
            T = {optimal_snn_hyperparameters.time_window_steps} <span className="text-xs font-normal text-gray-400">steps</span>
          </div>
          <span className="text-[10px] text-gray-500 block mt-1">Optimized temporal integration</span>
        </div>
      </div>

      {/* Tab 1: Evolutionary GA & CSA Convergence Curves */}
      {activeTab === 'convergence' && (
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <Dna className="w-4 h-4 text-purple-400" />
                Evolutionary Trajectory: Genetic Algorithm vs Clonal Selection Algorithm
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Comparison of fitness / affinity maturation across 25 generations of multimodal neuroimaging feature optimization.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <span className="w-2.5 h-2.5 rounded bg-indigo-500 inline-block" /> GA Fitness (Line)
              </span>
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-2.5 h-2.5 rounded bg-purple-500 inline-block" /> CSA Affinity (Dashed)
              </span>
            </div>
          </div>

          {/* Convergence Chart SVG */}
          <div className="h-60 w-full bg-black/40 border border-gray-800 rounded-lg p-3 relative flex items-end">
            <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
              <line x1="40" y1="20" x2="580" y2="20" stroke="#1f293d" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="40" y1="70" x2="580" y2="70" stroke="#1f293d" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="40" y1="120" x2="580" y2="120" stroke="#1f293d" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="40" y1="170" x2="580" y2="170" stroke="#1f293d" strokeWidth="1" />

              <text x="35" y="24" fill="#6b7280" fontSize="9" textAnchor="end">1.0</text>
              <text x="35" y="74" fill="#6b7280" fontSize="9" textAnchor="end">0.8</text>
              <text x="35" y="124" fill="#6b7280" fontSize="9" textAnchor="end">0.6</text>
              <text x="35" y="174" fill="#6b7280" fontSize="9" textAnchor="end">0.4</text>

              {/* GA Fitness Line */}
              <path
                d={optimization_history.map((it, idx) => {
                  const x = 50 + (idx / 24) * 520;
                  const y = 170 - ((it.ga_fitness - 0.4) / 0.6) * 150;
                  return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
              />

              {/* CSA Affinity Line */}
              <path
                d={optimization_history.map((it, idx) => {
                  const x = 50 + (idx / 24) * 520;
                  const y = 170 - ((it.csa_affinity - 0.4) / 0.6) * 150;
                  return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />

              {optimization_history.filter((_, i) => i % 4 === 0 || i === 24).map((it) => {
                const x = 50 + ((it.generation - 1) / 24) * 520;
                const yGA = 170 - ((it.ga_fitness - 0.4) / 0.6) * 150;
                const yCSA = 170 - ((it.csa_affinity - 0.4) / 0.6) * 150;
                return (
                  <g key={it.generation}>
                    <circle cx={x} cy={yGA} r="3.5" fill="#6366f1" />
                    <circle cx={x} cy={yCSA} r="3.5" fill="#a855f7" />
                    <text x={x} y="190" fill="#6b7280" fontSize="9" textAnchor="middle">
                      G{it.generation}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
            <span>CSA somatic hypermutation demonstrated faster escape from local minima than standard GA crossover</span>
            <span className="font-mono text-purple-300">Feature Count pruned: 18 → 12 optimal biomarkers</span>
          </div>
        </div>
      )}

      {/* Tab 2: Feature Selection Matrix */}
      {activeTab === 'features' && (
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-400" />
                Evolutionary Feature Selection Consensus Matrix
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Features evaluated by GA fitness and CSA affinity across sMRI, fMRI, and dMRI.
              </p>
            </div>

            {/* Modality Filter */}
            <div className="flex bg-gray-950 rounded-lg p-0.5 border border-gray-800 text-[11px]">
              {(['all', 'Structural', 'Functional', 'Diffusion'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setFilterModality(m)}
                  className={`px-2.5 py-0.5 rounded capitalize font-medium transition ${
                    filterModality === m ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredFeatures.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-xs flex flex-col justify-between ${
                  item.consensus_selected
                    ? 'bg-purple-950/20 border-purple-800/60 text-gray-200'
                    : item.selected_by_csa
                    ? 'bg-indigo-950/20 border-indigo-800/40 text-gray-300'
                    : 'bg-gray-950 border-gray-800/60 text-gray-500 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-white">{item.feature_name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    item.modality === 'Structural'
                      ? 'bg-blue-950 text-blue-300 border border-blue-800'
                      : item.modality === 'Functional'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {item.modality}
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-gray-800/60 font-mono text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Importance Weight:</span>
                    <span className="text-purple-300 font-bold">{item.importance_weight.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Optimization Status:</span>
                    <span>
                      {item.consensus_selected ? (
                        <span className="text-emerald-400 font-bold">Consensus Selected</span>
                      ) : item.selected_by_csa ? (
                        <span className="text-purple-400">CSA Only</span>
                      ) : (
                        <span className="text-gray-500">Pruned</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Optimal SNN Hyperparameters */}
      {activeTab === 'hyperparameters' && (
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Evolutionary-Discovered SNN Hyperparameters
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Parameters optimized by GA+CSA to maximize spiking information capacity and minimize surrogate gradient loss.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400">Surrogate Model: FastSigmoid</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <span className="text-[10px] text-gray-400 block mb-1">LIF Membrane Threshold (V_th)</span>
              <div className="text-xl font-bold text-white font-mono mb-1">
                {optimal_snn_hyperparameters.lif_threshold_v.toFixed(2)} V
              </div>
              <p className="text-[11px] text-gray-500">Determines voltage at which all-or-none action potential fires.</p>
            </div>

            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <span className="text-[10px] text-gray-400 block mb-1">Membrane Decay Constant (tau_m)</span>
              <div className="text-xl font-bold text-purple-400 font-mono mb-1">
                {optimal_snn_hyperparameters.membrane_time_constant_tau.toFixed(1)} ms
              </div>
              <p className="text-[11px] text-gray-500">Controls exponential leaky decay of subthreshold potential.</p>
            </div>

            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <span className="text-[10px] text-gray-400 block mb-1">Temporal Window Length (T)</span>
              <div className="text-xl font-bold text-cyan-400 font-mono mb-1">
                {optimal_snn_hyperparameters.time_window_steps} Steps
              </div>
              <p className="text-[11px] text-gray-500">Number of discrete time steps for temporal spike train integration.</p>
            </div>

            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <span className="text-[10px] text-gray-400 block mb-1">Refractory Period</span>
              <div className="text-xl font-bold text-amber-400 font-mono mb-1">
                {optimal_snn_hyperparameters.refractory_period_steps} Steps
              </div>
              <p className="text-[11px] text-gray-500">Absolute refractory duration where neuron cannot fire consecutive spikes.</p>
            </div>

            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <span className="text-[10px] text-gray-400 block mb-1">Surrogate Gradient Temperature</span>
              <div className="text-xl font-bold text-emerald-400 font-mono mb-1">
                {optimal_snn_hyperparameters.surrogate_gradient_temp.toFixed(2)}
              </div>
              <p className="text-[11px] text-gray-500">Smoothness parameter for pseudo-derivative of the Heaviside step function.</p>
            </div>

            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <span className="text-[10px] text-gray-400 block mb-1">Synaptic Learning Rate</span>
              <div className="text-xl font-bold text-indigo-400 font-mono mb-1">
                {optimal_snn_hyperparameters.learning_rate}
              </div>
              <p className="text-[11px] text-gray-500">Adam optimizer step size for surrogate gradient backpropagation.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
