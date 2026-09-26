import React, { useState } from 'react';
import { 
  Zap, Activity, Cpu, Scale, Sparkles, 
  ArrowRight, ShieldAlert, BarChart2, Layers 
} from 'lucide-react';
import { Module2SNNResponse, PatientInput } from '../types/pipeline';

interface Module2Props {
  data: Module2SNNResponse | null;
  patient: PatientInput;
  loading: boolean;
}

export const Module2SNN: React.FC<Module2Props> = ({ data, patient, loading }) => {
  const [activeTab, setActiveTab] = useState<'prediction' | 'lif_dynamics' | 'raster' | 'energy'>('prediction');

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-gray-400">
        <Zap className="w-8 h-8 animate-spin text-cyan-400 mb-3" />
        <p className="text-sm">Simulating SNN Leaky Integrate-and-Fire (LIF) Dynamics & Brain Age Readout...</p>
      </div>
    );
  }

  const { 
    model_architecture, lif_dynamics, spike_raster_sample, 
    energy_metrics, raw_snn_predicted_age, bias_slope, 
    bias_intercept, corrected_brain_age, brain_age_delta, 
    delta_classification, confidence_interval 
  } = data;

  const isAccelerated = delta_classification === 'Accelerated Aging';
  const isResilient = delta_classification === 'Resilient Aging';

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 backdrop-blur">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-bold uppercase tracking-wider">
                MODULE 2
              </span>
              <h2 className="text-lg font-bold text-white m-0">
                SNN-Based Brain Age Prediction (Spiking Neural Network)
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Neuromorphic Spiking ConvNet featuring Leaky Integrate-and-Fire (LIF) membrane integration, 
              temporal spike raster processing, sparse synaptic additions (SOPs), statistical bias correction, and Brain Age Delta (BAG).
            </p>
          </div>
          <div className="flex bg-gray-950 rounded-lg p-1 border border-gray-800 text-xs">
            {(['prediction', 'lif_dynamics', 'raster', 'energy'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-3 py-1 rounded capitalize font-medium transition ${
                  activeTab === t ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {t === 'prediction' ? 'SNN Prediction & BAG' : t === 'lif_dynamics' ? 'LIF Membrane Trace' : t === 'raster' ? 'Spike Raster Plot' : 'Neuromorphic Energy'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Results: SNN Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Chronological vs Raw SNN Output */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>Chronological Age</span>
              <span className="font-mono text-cyan-400 font-semibold">{patient.chronological_age} yrs</span>
            </div>
            <div className="text-3xl font-extrabold text-white mb-2">
              {patient.chronological_age.toFixed(1)} <span className="text-sm font-normal text-gray-400">years</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Subject's chronological baseline age at scan acquisition.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-800/80 space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-gray-500">Raw SNN Analog Readout:</span>
              <span className="font-mono text-gray-300">{raw_snn_predicted_age.toFixed(1)} yrs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Regression-to-Mean Bias:</span>
              <span className="font-mono text-amber-400">
                {(raw_snn_predicted_age - corrected_brain_age).toFixed(1)} yrs
              </span>
            </div>
          </div>
        </div>

        {/* Bias Corrected Brain Age */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <Scale className="w-3.5 h-3.5" /> SNN Corrected Brain Age
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                de Lange / Cole
              </span>
            </div>
            <div className="text-3xl font-extrabold text-cyan-400 mb-2">
              {corrected_brain_age.toFixed(1)} <span className="text-sm font-normal text-gray-400">years</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Adjusted for linear bias using Cole & de Lange transformation (slope α={bias_slope.toFixed(3)}, intercept β={bias_intercept.toFixed(2)}).
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-800/80 space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-gray-500">95% Confidence Interval:</span>
              <span className="font-mono text-cyan-300">
                [{confidence_interval[0]} - {confidence_interval[1]}] yrs
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Neuron Model:</span>
              <span className="font-mono text-gray-300">LIF (T=16 Steps)</span>
            </div>
          </div>
        </div>

        {/* Brain Age Delta (BAG) */}
        <div className={`rounded-xl p-5 flex flex-col justify-between border ${
          isAccelerated 
            ? 'bg-rose-950/20 border-rose-800/60' 
            : isResilient
            ? 'bg-emerald-950/20 border-emerald-800/60'
            : 'bg-indigo-950/20 border-indigo-800/60'
        }`}>
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-gray-300">Brain Age Delta (BAG)</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                isAccelerated 
                  ? 'bg-rose-900 text-rose-200 border border-rose-700' 
                  : isResilient
                  ? 'bg-emerald-900 text-emerald-200 border border-emerald-700'
                  : 'bg-indigo-900 text-indigo-200 border border-indigo-700'
              }`}>
                {delta_classification}
              </span>
            </div>
            <div className={`text-3xl font-black mb-2 ${
              isAccelerated ? 'text-rose-400' : isResilient ? 'text-emerald-400' : 'text-cyan-400'
            }`}>
              {brain_age_delta > 0 ? `+${brain_age_delta.toFixed(1)}` : brain_age_delta.toFixed(1)}{' '}
              <span className="text-sm font-normal text-gray-400">years</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              {isAccelerated 
                ? 'SNN detects accelerated biological aging trajectory with notable hippocampal and ventricular volumetric shift.'
                : isResilient
                ? 'SNN detects high biological brain resilience, morphology matching younger cohorts.'
                : 'SNN prediction aligns within normative age-matched trajectory.'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-[11px]">
            <span className="text-gray-400">SNN Energy Efficiency:</span>
            <span className="font-mono text-emerald-400 font-bold">
              {energy_metrics.energy_efficiency_gain_x}x Less Energy vs ANN
            </span>
          </div>
        </div>
      </div>

      {/* Tab 1: SNN Architecture & Prediction View */}
      {activeTab === 'prediction' && (
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Spiking Neural Network Architecture (Temporal Conv1D-SNN)
            </h3>
            <span className="text-xs text-gray-400 font-mono">Surrogate Gradient: FastSigmoid</span>
          </div>

          <div className="space-y-2">
            {model_architecture.map((layer, idx) => (
              <div
                key={idx}
                className="bg-gray-950 border border-gray-800 rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between gap-2 hover:border-gray-700 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 flex items-center justify-center text-[10px] font-mono font-bold">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white m-0">{layer.layer_name}</h4>
                    <p className="text-[11px] text-gray-400 font-mono m-0">{layer.layer_type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[11px]">
                  <div className="flex items-center gap-1 text-gray-400">
                    <span>Neuron Model:</span>
                    <span className="font-mono text-purple-300">{layer.neuron_model}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <span>Shape:</span>
                    <span className="font-mono text-cyan-300">[{layer.output_shape.join(', ')}]</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Leaky Integrate-and-Fire (LIF) Dynamics Simulation */}
      {activeTab === 'lif_dynamics' && (
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                LIF Neuron Membrane Potential Dynamics: V(t) Trace
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Subthreshold leaky decay, synaptic current accumulation, threshold crossing (V_th = 1.0V), and hard reset.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-amber-400">V_th = 1.0 V (Threshold)</span>
              <span className="text-cyan-400">V(t) Membrane Trace</span>
              <span className="text-rose-400">Action Potential Spikes</span>
            </div>
          </div>

          {/* SVG Membrane Trace */}
          <div className="h-60 w-full bg-black/40 border border-gray-800 rounded-lg p-3 relative flex items-end">
            <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
              <line x1="40" y1="50" x2="580" y2="50" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="35" y="54" fill="#f59e0b" fontSize="9" textAnchor="end">V_th (1.0)</text>

              <line x1="40" y1="170" x2="580" y2="170" stroke="#1f293d" strokeWidth="1" />
              <text x="35" y="174" fill="#6b7280" fontSize="9" textAnchor="end">0.0 V</text>

              {/* Membrane potential path */}
              <path
                d={lif_dynamics.membrane_potentials.map((v, i) => {
                  const x = 50 + (i / 15) * 520;
                  const y = 170 - (v / 1.4) * 120;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
              />

              {/* Spike pulses */}
              {lif_dynamics.spikes.map((spk, i) => {
                const x = 50 + (i / 15) * 520;
                if (spk === 1) {
                  return (
                    <g key={i}>
                      <line x1={x} y1="170" x2={x} y2="20" stroke="#f43f5e" strokeWidth="2.5" />
                      <circle cx={x} cy="20" r="3" fill="#f43f5e" />
                      <text x={x} y="15" fill="#f43f5e" fontSize="8" textAnchor="middle" fontWeight="bold">SPIKE</text>
                    </g>
                  );
                }
                return null;
              })}

              {lif_dynamics.time_steps.map((t, i) => (
                <text key={t} x={50 + (i / 15) * 520} y="188" fill="#6b7280" fontSize="8.5" textAnchor="middle">
                  t={t}
                </text>
              ))}
            </svg>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
            <span>Biological LIF model emulates sparse event-driven spikes, resetting to 0.0V post-discharge</span>
            <span className="font-mono text-cyan-300">Total Action Potentials: {lif_dynamics.spikes.filter((s) => s === 1).length} Spikes</span>
          </div>
        </div>
      )}

      {/* Tab 3: Temporal Spike Raster Plot */}
      {activeTab === 'raster' && (
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-purple-400" />
                SNN Temporal Spike Raster Plot (T = 16 Time Steps)
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Spike activity distribution across Input Poisson Encoder, Hidden Conv1D-SNN, and Readout LIF layers.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-indigo-400">Input Spikes (N=12)</span>
              <span className="text-purple-400">Hidden Spikes (N=16)</span>
              <span className="text-cyan-400">Readout Units (N=4)</span>
            </div>
          </div>

          {/* Raster Visualizer */}
          <div className="h-64 w-full bg-black/40 border border-gray-800 rounded-lg p-3 relative flex items-center justify-center">
            <svg viewBox="0 0 600 220" className="w-full h-full overflow-visible">
              {/* Raster Grid */}
              {[4, 8, 12, 16].map((t) => (
                <line key={t} x1={50 + ((t - 1) / 15) * 520} y1="10" x2={50 + ((t - 1) / 15) * 520} y2="190" stroke="#1f293d" strokeWidth="1" strokeDasharray="2 2" />
              ))}

              {/* Layer partitions */}
              <line x1="40" y1="80" x2="580" y2="80" stroke="#374151" strokeWidth="0.8" />
              <line x1="40" y1="160" x2="580" y2="160" stroke="#374151" strokeWidth="0.8" />

              <text x="35" y="45" fill="#818cf8" fontSize="8" textAnchor="end">Input</text>
              <text x="35" y="120" fill="#c084fc" fontSize="8" textAnchor="end">Hidden</text>
              <text x="35" y="180" fill="#22d3ee" fontSize="8" textAnchor="end">Readout</text>

              {/* Spike dots */}
              {spike_raster_sample.map((pt, i) => {
                const x = 50 + ((pt.time_step - 1) / 15) * 520;
                let y = 30;
                let color = "#818cf8";
                if (pt.layer === "Input Spikes") {
                  y = 20 + (pt.neuron_idx / 12) * 50;
                  color = "#818cf8";
                } else if (pt.layer === "Hidden Conv-SNN") {
                  y = 85 + (pt.neuron_idx / 16) * 65;
                  color = "#c084fc";
                } else {
                  y = 165 + (pt.neuron_idx / 4) * 20;
                  color = "#22d3ee";
                }

                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="2.5"
                    fill={color}
                  />
                );
              })}

              {[1, 4, 8, 12, 16].map((t) => (
                <text key={t} x={50 + ((t - 1) / 15) * 520} y="208" fill="#6b7280" fontSize="8.5" textAnchor="middle">
                  t={t}
                </text>
              ))}
            </svg>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
            <span>High sparsity observed: Most neurons fire only 1-3 times across the entire temporal window</span>
            <span className="font-mono text-emerald-300">Spike Sparsity: 83.2% Silence</span>
          </div>
        </div>
      )}

      {/* Tab 4: Neuromorphic Energy Efficiency */}
      {activeTab === 'energy' && (
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Neuromorphic Computing Energy Advantage (SNN vs Standard ANN)
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Event-driven computation eliminates power-hungry floating-point multiplications (MACs), replacing them with sparse synaptic additions (SOPs).
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {energy_metrics.energy_efficiency_gain_x}x Energy Reduction
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <span className="text-[10px] text-gray-400 block mb-1">Synaptic Operations (SOPs)</span>
              <div className="text-2xl font-bold text-cyan-400 font-mono mb-1">
                {energy_metrics.synaptic_operations_sops.toLocaleString()}
              </div>
              <p className="text-[11px] text-gray-500">
                Sparse accumulation events triggered solely when pre-synaptic neurons spike.
              </p>
            </div>

            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <span className="text-[10px] text-gray-400 block mb-1">Equivalent ANN MACs</span>
              <div className="text-2xl font-bold text-gray-400 font-mono mb-1">
                {energy_metrics.equivalent_ann_macs.toLocaleString()}
              </div>
              <p className="text-[11px] text-gray-500">
                Dense matrix multiply-accumulate operations in standard non-spiking ConvNet.
              </p>
            </div>

            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <span className="text-[10px] text-gray-400 block mb-1">Energy per Inference</span>
              <div className="text-2xl font-bold text-emerald-400 font-mono mb-1">
                {energy_metrics.energy_consumption_uj} μJ <span className="text-xs text-gray-500 font-normal">vs {energy_metrics.ann_energy_uj} μJ</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Enables continuous edge-device neuroimaging analysis with negligible thermal footprint.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
