import React, { useState } from 'react';
import { 
  Network, GitMerge, Cpu, Compass, 
  Layers, CheckCircle2, TrendingUp, Sparkles, 
  Share2, Activity 
} from 'lucide-react';
import { Module4Response, PatientInput } from '../types/pipeline';

interface Module4Props {
  data: Module4Response | null;
  patient: PatientInput;
  loading: boolean;
}

export const Module4Fusion: React.FC<Module4Props> = ({ data, patient, loading }) => {
  const [activeTab, setActiveTab] = useState<'graph' | 'attention' | 'latent'>('graph');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-gray-400">
        <Network className="w-8 h-8 animate-spin text-cyan-400 mb-3" />
        <p className="text-sm">Executing Multimodal Attention Fusion & Graph Neural Network (GNN)...</p>
      </div>
    );
  }

  const { 
    modality_attention, latent_space_projection, 
    brain_graph_nodes, brain_graph_edges, 
    final_predicted_age, final_corrected_age, final_bag, modality_fusion_gain 
  } = data;

  const selectedNode = brain_graph_nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 backdrop-blur">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-bold uppercase tracking-wider">
                MODULE 4
              </span>
              <h2 className="text-lg font-bold text-white m-0">
                Advanced Multimodal Learning (SNN Advanced Fusion)
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              sMRI + fMRI + dMRI → Multimodal Attention → SNN Advanced Fusion (Spiking GNN) → Final Brain Age & BAG.
              Spike-based message passing across structural tracts and functional resting-state networks.
            </p>
          </div>
          <div className="flex bg-gray-950 rounded-lg p-1 border border-gray-800 text-xs">
            {(['graph', 'attention', 'latent'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-3 py-1 rounded capitalize font-medium transition ${
                  activeTab === t ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {t === 'graph' ? 'Brain Graph (GNN)' : t === 'attention' ? 'Modality Attention' : 'Latent Manifold'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Banner: Final Model 4 Output vs Conv1D */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
          <span className="text-[11px] text-gray-400 block mb-1">Final Predicted Age (M4)</span>
          <div className="text-2xl font-black text-white font-mono">
            {final_predicted_age.toFixed(1)} <span className="text-xs font-normal text-gray-400">yrs</span>
          </div>
          <span className="text-[10px] text-gray-500 block mt-1">Transformer / GNN raw output</span>
        </div>

        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
          <span className="text-[11px] text-gray-400 block mb-1">Final Corrected Age</span>
          <div className="text-2xl font-black text-cyan-400 font-mono">
            {final_corrected_age.toFixed(1)} <span className="text-xs font-normal text-gray-400">yrs</span>
          </div>
          <span className="text-[10px] text-gray-500 block mt-1">Bias-corrected multimodal ensemble</span>
        </div>

        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
          <span className="text-[11px] text-gray-400 block mb-1">Final Brain Age Delta (BAG)</span>
          <div className={`text-2xl font-black font-mono ${
            final_bag > 2.5 ? 'text-rose-400' : final_bag < -2.5 ? 'text-emerald-400' : 'text-cyan-400'
          }`}>
            {final_bag > 0 ? `+${final_bag.toFixed(1)}` : final_bag.toFixed(1)} <span className="text-xs font-normal text-gray-400">yrs</span>
          </div>
          <span className="text-[10px] text-gray-500 block mt-1">Chronological: {patient.chronological_age} yrs</span>
        </div>

        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
          <span className="text-[11px] text-gray-400 block mb-1">Multimodal Fusion Gain</span>
          <div className="text-2xl font-black text-purple-400 font-mono flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-purple-400" />
            -{modality_fusion_gain.toFixed(2)} <span className="text-xs font-normal text-gray-400">yrs MAE</span>
          </div>
          <span className="text-[10px] text-gray-500 block mt-1">MAE improvement over single sMRI</span>
        </div>
      </div>

      {/* Tab 1: Interactive Brain Connectivity Graph (GNN) */}
      {activeTab === 'graph' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-gray-900/40 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-cyan-400" />
                  GNN Topological Message-Passing Brain Graph
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Nodes represent anatomical parcels; edges denote structural white-matter tracts (cyan) and functional BOLD synchrony (purple).
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-cyan-400 text-[11px]">
                  <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" /> Structural
                </span>
                <span className="flex items-center gap-1 text-purple-400 text-[11px]">
                  <span className="w-2.5 h-0.5 bg-purple-400 inline-block" /> Functional
                </span>
              </div>
            </div>

            {/* Interactive SVG Network Graph */}
            <div className="relative aspect-[16/10] w-full bg-black/60 rounded-lg border border-gray-800 overflow-hidden flex items-center justify-center">
              <svg viewBox="-60 -60 120 120" className="w-full h-full">
                {/* Edges */}
                {brain_graph_edges.map((edge, idx) => {
                  const src = brain_graph_nodes.find((n) => n.id === edge.source);
                  const tgt = brain_graph_nodes.find((n) => n.id === edge.target);
                  if (!src || !tgt) return null;

                  const isStructural = edge.edge_type === 'structural';
                  return (
                    <line
                      key={idx}
                      x1={src.x}
                      y1={src.y}
                      x2={tgt.x}
                      y2={tgt.y}
                      stroke={isStructural ? '#06b6d4' : '#a855f7'}
                      strokeWidth={edge.weight * 2.2}
                      strokeOpacity={0.65}
                      strokeDasharray={isStructural ? undefined : '3 2'}
                    />
                  );
                })}

                {/* Nodes */}
                {brain_graph_nodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  const nodeColor = 
                    node.network === 'Default Mode' ? '#06b6d4' :
                    node.network === 'Limbic' ? '#ec4899' :
                    node.network === 'Frontoparietal' ? '#6366f1' :
                    node.network === 'Somatomotor' ? '#10b981' : '#f59e0b';

                  return (
                    <g
                      key={node.id}
                      className="cursor-pointer transition-transform hover:scale-110"
                      onClick={() => setSelectedNodeId(node.id)}
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isSelected ? 6.5 : 4.5}
                        fill={nodeColor}
                        stroke="#ffffff"
                        strokeWidth={isSelected ? 2 : 1}
                      />
                      <text
                        x={node.x + 6}
                        y={node.y + 3}
                        fill="#e5e7eb"
                        fontSize="3.8"
                        fontFamily="sans-serif"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="absolute bottom-2 left-2 bg-gray-950/80 backdrop-blur px-2 py-1 rounded border border-gray-800 text-[10px] text-gray-400">
                Click any parcel node to view GNN attention & embedding details
              </div>
            </div>
          </div>

          {/* Node Inspector */}
          <div className="lg:col-span-4 bg-gray-900/40 border border-gray-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-400" />
                GNN Parcel Node Inspector
              </h3>

              {selectedNode ? (
                <div className="space-y-4">
                  <div className="bg-gray-950 border border-gray-800 rounded-lg p-3.5">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-bold text-white">{selectedNode.label}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                        {selectedNode.network}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Graph Degree:</span>
                        <span className="font-mono text-cyan-400 font-bold">{selectedNode.degree} Connections</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">MNI Coordinates:</span>
                        <span className="font-mono text-gray-300">({selectedNode.x}, {selectedNode.y}, {selectedNode.z})</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-950 border border-gray-800 rounded-lg p-3 text-xs leading-relaxed text-gray-400">
                    <span className="text-white font-semibold block mb-1">GNN Message Passing Role:</span>
                    Acts as a primary network hub. Aggregates multi-hop structural tract diffusion features with temporal resting-state BOLD embeddings.
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed border-gray-800 rounded-lg text-xs text-gray-500">
                  Select a node on the GNN brain graph to inspect its network connectivity, MNI coordinates, and cross-attention weight.
                </div>
              )}
            </div>

            <div className="border-t border-gray-800 pt-3 text-[11px] text-gray-500">
              Architecture: Multi-Head Graph Attention Network (GATv2) with 4 attention heads.
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Modality Attention Breakdown */}
      {activeTab === 'attention' && (
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <GitMerge className="w-4 h-4 text-purple-400" />
                Cross-Attention Modality Weighting (sMRI vs fMRI vs dMRI)
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                The attention mechanism dynamically allocates weights to each neuroimaging modality based on signal-to-noise ratio and pathology relevance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modality_attention.map((item, idx) => (
              <div key={idx} className="bg-gray-950 border border-gray-800 rounded-lg p-4 flex flex-col justify-between hover:border-gray-700 transition">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-white">{item.modality}</h4>
                    <span className="text-xs font-mono font-bold text-cyan-400">{item.percentage}%</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed mb-4">{item.description}</p>
                </div>

                <div>
                  <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full ${
                        idx === 0 ? 'bg-cyan-500' : idx === 1 ? 'bg-purple-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>Attention Weight:</span>
                    <span>{item.attention_weight.toFixed(3)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Latent Manifold Projection (t-SNE / UMAP) */}
      {activeTab === 'latent' && (
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Multimodal Latent Space Manifold Projection (t-SNE)
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                2D projection of the shared 128-dimensional multimodal representation space across reference cohorts.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1 text-gray-400">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-500 inline-block" /> Normal
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Accelerated
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Resilient
              </span>
              <span className="flex items-center gap-1 text-cyan-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block animate-ping" /> Current Patient
              </span>
            </div>
          </div>

          {/* t-SNE Scatter SVG */}
          <div className="h-64 w-full bg-black/40 border border-gray-800 rounded-lg p-3 relative flex items-center justify-center">
            <svg viewBox="-6 -5 12 10" className="w-full h-full overflow-visible">
              {/* Axes */}
              <line x1="-5.5" y1="0" x2="5.5" y2="0" stroke="#1f293d" strokeWidth="0.05" />
              <line x1="0" y1="-4.5" x2="0" y2="4.5" stroke="#1f293d" strokeWidth="0.05" />

              {/* Background Points */}
              {latent_space_projection.map((pt, i) => {
                const isCurrent = pt.category === 'Current Patient';
                const ptColor = 
                  pt.category === 'Normal' ? '#6b7280' :
                  pt.category === 'Accelerated' ? '#f43f5e' :
                  pt.category === 'Resilient' ? '#10b981' : '#06b6d4';

                if (isCurrent) {
                  return (
                    <g key={i}>
                      <circle cx={pt.tsne_x} cy={pt.tsne_y} r="0.6" fill="#06b6d4" fillOpacity="0.4" className="animate-ping" />
                      <circle cx={pt.tsne_x} cy={pt.tsne_y} r="0.3" fill="#06b6d4" stroke="#ffffff" strokeWidth="0.08" />
                      <text x={pt.tsne_x + 0.4} y={pt.tsne_y - 0.2} fill="#67e8f9" fontSize="0.35" fontWeight="bold">
                        Patient ({pt.chronological_age}y)
                      </text>
                    </g>
                  );
                }

                return (
                  <circle
                    key={i}
                    cx={pt.tsne_x}
                    cy={pt.tsne_y}
                    r="0.12"
                    fill={ptColor}
                    fillOpacity="0.75"
                  />
                );
              })}
            </svg>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
            <span>Projection clearly demarcates resilient super-agers from accelerated neurodegenerative trajectories</span>
            <span className="font-mono text-cyan-300">Latent Dimensions: 128 → 2D</span>
          </div>
        </div>
      )}
    </div>
  );
};
