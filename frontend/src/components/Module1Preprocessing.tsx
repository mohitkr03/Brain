import React, { useState } from 'react';
import { 
  CheckCircle2, Sliders, Eye, FileText, 
  Layers, Activity, Compass, Cpu 
} from 'lucide-react';
import { Module1Response, PatientInput } from '../types/pipeline';

interface Module1Props {
  data: Module1Response | null;
  patient: PatientInput;
  loading: boolean;
}

export const Module1Preprocessing: React.FC<Module1Props> = ({ data, patient, loading }) => {
  const [activeSlice, setActiveSlice] = useState<'axial' | 'coronal' | 'sagittal'>('axial');
  const [sliceIndex, setSliceIndex] = useState<number>(78);
  const [showParcellation, setShowParcellation] = useState<boolean>(true);
  const [selectedModality, setSelectedModality] = useState<'all' | 'structural' | 'functional' | 'diffusion'>('all');
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-gray-400">
        <Activity className="w-8 h-8 animate-spin text-indigo-400 mb-3" />
        <p className="text-sm">Executing Multimodal Preprocessing & Feature Extraction...</p>
      </div>
    );
  }

  const filteredRegions = data.parcellation_regions.filter((r) => {
    if (selectedModality === 'all') return true;
    if (selectedModality === 'structural') return r.structural_thickness > 0;
    if (selectedModality === 'functional') return r.functional_alff > 0;
    if (selectedModality === 'diffusion') return r.diffusion_fa > 0;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Module Title & Overview */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 backdrop-blur">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold uppercase tracking-wider">
                MODULE 1
              </span>
              <h2 className="text-lg font-bold text-white m-0">
                Multimodal Preprocessing & Feature Extraction
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Standardized preprocessing pipeline (N4ITK Bias Correction, MNI152 Affine+Non-linear SyN Registration), 
              automated DKT anatomical parcellation, and biological grouping across Yeo canonical functional networks.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded bg-gray-800 text-gray-300 border border-gray-700 font-mono">
              Patient: {patient.name} ({patient.chronological_age}y)
            </span>
          </div>
        </div>
      </div>

      {/* 1. Standardized Preprocessing Steps */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Standardized Preprocessing Pipeline (Executed)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {data.preprocessing_steps.map((step, idx) => (
            <div key={idx} className="bg-gray-950 border border-gray-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-gray-700 transition">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-indigo-400">Step {idx + 1}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                    {step.status}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-white mb-1">{step.name}</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-3">{step.description}</p>
              </div>
              <div className="border-t border-gray-800/80 pt-2 space-y-1">
                {Object.entries(step.metrics).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-[10px]">
                    <span className="text-gray-500 capitalize">{k.replace(/_/g, ' ')}:</span>
                    <span className="text-gray-300 font-mono font-medium">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Anatomical Parcellation & Interactive Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Brain Slice Display */}
        <div className="lg:col-span-5 bg-gray-900/40 border border-gray-800 rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              Anatomical Parcellation Viewer
            </h3>
            {/* Plane Switcher */}
            <div className="flex bg-gray-950 rounded-lg p-0.5 border border-gray-800 text-[11px]">
              {(['axial', 'coronal', 'sagittal'] as const).map((plane) => (
                <button
                  key={plane}
                  onClick={() => setActiveSlice(plane)}
                  className={`px-2 py-0.5 rounded capitalize font-medium transition ${
                    activeSlice === plane ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {plane}
                </button>
              ))}
            </div>
          </div>

          {/* Simulated Neuroimaging Canvas */}
          <div className="relative aspect-square w-full bg-black rounded-lg border border-gray-800 overflow-hidden flex items-center justify-center">
            {/* SVG Brain Representation */}
            <svg viewBox="0 0 300 300" className="w-full h-full">
              <defs>
                <radialGradient id="brainGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#252b3b" />
                  <stop offset="85%" stopColor="#121622" />
                  <stop offset="100%" stopColor="#05070c" />
                </radialGradient>
                <linearGradient id="parcellationGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.7" />
                </linearGradient>
              </defs>

              {/* Outer Cranium */}
              <ellipse cx="150" cy="150" rx="125" ry="135" fill="none" stroke="#2e384d" strokeWidth="2" strokeDasharray="4 2" />

              {/* Brain Parenchyma Outline */}
              <path
                d="M 150,30 C 220,30 260,80 260,150 C 260,220 220,270 150,270 C 80,270 40,220 40,150 C 40,80 80,30 150,30 Z"
                fill="url(#brainGrad)"
                stroke="#4338ca"
                strokeWidth="1.5"
              />

              {/* Sulci / Gyri contours */}
              <path d="M 150,35 Q 148,120 150,265" stroke="#1f293d" strokeWidth="2" fill="none" />
              <path d="M 80,100 Q 120,130 148,130" stroke="#1f293d" strokeWidth="1.5" fill="none" />
              <path d="M 220,100 Q 180,130 152,130" stroke="#1f293d" strokeWidth="1.5" fill="none" />
              <path d="M 70,170 Q 110,160 148,170" stroke="#1f293d" strokeWidth="1.5" fill="none" />
              <path d="M 230,170 Q 190,160 152,170" stroke="#1f293d" strokeWidth="1.5" fill="none" />

              {/* Ventricles */}
              <path
                d="M 140,135 C 135,110 120,115 125,145 C 130,165 142,160 142,145 Z"
                fill="#0b0f19"
                stroke="#6366f1"
                strokeWidth="1"
              />
              <path
                d="M 160,135 C 165,110 180,115 175,145 C 170,165 158,160 158,145 Z"
                fill="#0b0f19"
                stroke="#6366f1"
                strokeWidth="1"
              />

              {/* Parcellation Overlays */}
              {showParcellation && (
                <g className="transition-opacity duration-300">
                  {/* Left Hippocampus */}
                  <ellipse
                    cx="115"
                    cy="185"
                    rx="18"
                    ry="12"
                    fill={selectedRegionId === 'R01' ? '#f43f5e' : '#ec4899'}
                    fillOpacity={selectedRegionId === 'R01' ? '0.85' : '0.55'}
                    stroke="#fda4af"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:opacity-100"
                    onClick={() => setSelectedRegionId('R01')}
                  />
                  {/* Right Hippocampus */}
                  <ellipse
                    cx="185"
                    cy="185"
                    rx="18"
                    ry="12"
                    fill={selectedRegionId === 'R01' ? '#f43f5e' : '#ec4899'}
                    fillOpacity={selectedRegionId === 'R01' ? '0.85' : '0.55'}
                    stroke="#fda4af"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:opacity-100"
                    onClick={() => setSelectedRegionId('R01')}
                  />

                  {/* Superior Frontal */}
                  <path
                    d="M 100,55 Q 150,45 200,55 Q 180,85 150,85 Q 120,85 100,55 Z"
                    fill={selectedRegionId === 'R02' ? '#3b82f6' : '#6366f1'}
                    fillOpacity="0.6"
                    stroke="#93c5fd"
                    strokeWidth="1"
                    className="cursor-pointer hover:opacity-100"
                    onClick={() => setSelectedRegionId('R02')}
                  />

                  {/* Precuneus / Posterior Cingulate */}
                  <ellipse
                    cx="150"
                    cy="210"
                    rx="26"
                    ry="18"
                    fill={selectedRegionId === 'R03' ? '#10b981' : '#06b6d4'}
                    fillOpacity="0.6"
                    stroke="#67e8f9"
                    strokeWidth="1"
                    className="cursor-pointer hover:opacity-100"
                    onClick={() => setSelectedRegionId('R03')}
                  />
                </g>
              )}

              {/* Slice crosshair */}
              <line x1="20" y1={sliceIndex * 2} x2="280" y2={sliceIndex * 2} stroke="#4f46e5" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
              <text x="25" y={sliceIndex * 2 - 4} fill="#818cf8" fontSize="9" fontFamily="monospace">
                z = {sliceIndex} mm
              </text>
            </svg>

            {/* Overlay Info Badges */}
            <div className="absolute top-2 left-2 bg-gray-950/80 backdrop-blur px-2 py-1 rounded border border-gray-800 text-[10px] font-mono text-gray-300">
              Plane: {activeSlice.toUpperCase()} | Slice: {sliceIndex}/160
            </div>
            <div className="absolute bottom-2 right-2 bg-gray-950/80 backdrop-blur px-2 py-1 rounded border border-gray-800 text-[10px] text-gray-400">
              Atlas: Desikan-Killiany (DKT)
            </div>
          </div>

          {/* Slice Slider & Parcellation Toggle */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                Slice Depth
              </span>
              <span className="font-mono text-gray-200">{sliceIndex} mm</span>
            </div>
            <input
              type="range"
              min="20"
              max="140"
              value={sliceIndex}
              onChange={(e) => setSliceIndex(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-gray-800 rounded-lg h-1.5 cursor-pointer"
            />
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showParcellation}
                  onChange={(e) => setShowParcellation(e.target.checked)}
                  className="rounded border-gray-700 text-indigo-600 focus:ring-indigo-500 bg-gray-800"
                />
                Show Parcellation ROI Map
              </label>
              {selectedRegionId && (
                <button
                  onClick={() => setSelectedRegionId(null)}
                  className="text-[11px] text-indigo-400 hover:underline"
                >
                  Clear Selection
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Parcellation Feature Extraction Table */}
        <div className="lg:col-span-7 bg-gray-900/40 border border-gray-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Extracted Parcellation Features ({filteredRegions.length} Regions)
              </h3>
              {/* Modality Filter */}
              <div className="flex bg-gray-950 rounded-lg p-0.5 border border-gray-800 text-[11px]">
                {(['all', 'structural', 'functional', 'diffusion'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedModality(m)}
                    className={`px-2 py-0.5 rounded capitalize font-medium transition ${
                      selectedModality === m ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto max-h-[360px] border border-gray-800 rounded-lg">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-gray-950/80 sticky top-0 text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="p-2.5 font-medium">ROI Name</th>
                    <th className="p-2.5 font-medium">Network</th>
                    <th className="p-2.5 font-medium text-right">Thickness (mm)</th>
                    <th className="p-2.5 font-medium text-right">Volume (mm³)</th>
                    <th className="p-2.5 font-medium text-right">ALFF (fMRI)</th>
                    <th className="p-2.5 font-medium text-right">FA (dMRI)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-mono">
                  {filteredRegions.map((region) => {
                    const isSelected = selectedRegionId === region.id;
                    return (
                      <tr
                        key={region.id}
                        onClick={() => setSelectedRegionId(region.id)}
                        className={`cursor-pointer transition ${
                          isSelected 
                            ? 'bg-indigo-950/60 text-white font-semibold' 
                            : 'hover:bg-gray-800/40 text-gray-300'
                        }`}
                      >
                        <td className="p-2.5 flex items-center gap-1.5 font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                          {region.name}
                        </td>
                        <td className="p-2.5 font-sans">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                            {region.network}
                          </span>
                        </td>
                        <td className="p-2.5 text-right">
                          {region.structural_thickness > 0 ? region.structural_thickness.toFixed(2) : '-'}
                        </td>
                        <td className="p-2.5 text-right text-cyan-400">
                          {region.structural_volume.toLocaleString()}
                        </td>
                        <td className="p-2.5 text-right text-emerald-400">
                          {region.functional_alff.toFixed(2)}
                        </td>
                        <td className="p-2.5 text-right text-amber-400">
                          {region.diffusion_fa.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-gray-400 flex items-center justify-between border-t border-gray-800/80 pt-2">
            <span>Showing parcellation values aligned to MNI152 space</span>
            <span className="text-gray-500 font-mono">Total Parcels: 84 | DK Atlas</span>
          </div>
        </div>
      </div>

      {/* 3. Biological Feature Grouping */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-400" />
          Biological Feature Grouping across Canonical Brain Systems
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Features extracted from sMRI, fMRI, and dMRI are hierarchically clustered into canonical functional networks 
          (Yeo 7 Networks + Subcortical) to evaluate network-level biological aging and vulnerability.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {data.biological_groups.map((grp, idx) => (
            <div key={idx} className="bg-gray-950 border border-gray-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-gray-700 transition">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-white">{grp.network_name}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                    grp.composite_aging_index < 60 
                      ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                      : grp.composite_aging_index > 80
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    Score: {grp.composite_aging_index}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-3">{grp.description}</p>
              </div>

              <div className="space-y-1.5 border-t border-gray-800 pt-2 text-[10px]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Structural Score:</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${grp.structural_score}%` }} />
                    </div>
                    <span className="font-mono text-gray-300">{grp.structural_score}%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Functional ALFF:</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${grp.functional_score}%` }} />
                    </div>
                    <span className="font-mono text-gray-300">{grp.functional_score}%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Diffusion FA:</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${grp.diffusion_score}%` }} />
                    </div>
                    <span className="font-mono text-gray-300">{grp.diffusion_score}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
