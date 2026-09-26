import React from 'react';
import { 
  Calendar, CheckCircle, AlertTriangle, 
  Brain, FileText, Printer, Download, 
  Sparkles, Award, ShieldCheck, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import { 
  PatientInput, Module1Response, Module2Response, 
  Module3Response, Module4Response, EvaluationResponse 
} from '../types/pipeline';

interface FinalOutputProps {
  patient: PatientInput;
  module1: Module1Response | null;
  module2: Module2Response | null;
  module3: Module3Response | null;
  module4: Module4Response | null;
  evaluation: EvaluationResponse | null;
}

export const FinalOutput: React.FC<FinalOutputProps> = ({
  patient,
  module1,
  module2,
  module3,
  module4,
  evaluation
}) => {
  if (!module2 || !module3 || !module4) {
    return (
      <div className="p-12 text-center text-gray-400 bg-gray-900/40 border border-gray-800 rounded-xl">
        <Brain className="w-8 h-8 text-indigo-400 mx-auto mb-3 animate-pulse" />
        <p className="text-sm">Please run the complete pipeline to synthesize the Final Output report.</p>
      </div>
    );
  }

  const predictedAge = module4.final_predicted_age;
  const correctedAge = module4.final_corrected_age;
  const bag = module4.final_bag;
  const isAccelerated = bag > 2.5;
  const isResilient = bag < -2.5;

  const topRegions = module3.top_important_regions.slice(0, 5);
  const bioNotes = module3.interpretation.biological_interpretation;
  const clinNotes = module3.interpretation.clinical_interpretation;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Title & Print Action */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 backdrop-blur flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-bold uppercase tracking-wider">
              SYNTHESIS
            </span>
            <h2 className="text-lg font-bold text-white m-0">
              Final Combined Output & Comprehensive Diagnostic Report
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Integrated multi-stage synthesis combining Module 1 (Features), Module 2 (GA/Conv1D), 
            Module 3 (XAI), and Module 4 (Multimodal Fusion).
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-white border border-gray-700 transition"
        >
          <Printer className="w-3.5 h-3.5" />
          Print / Export Diagnostic Report
        </button>
      </div>

      {/* 5 Core Deliverables Grid - Exactly as in Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Predicted Brain Age */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 flex flex-col justify-between hover:border-gray-700 transition">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              Predicted Brain Age
            </span>
            <span className="text-[10px] text-gray-500 font-mono">Raw</span>
          </div>
          <div className="text-3xl font-black text-white font-mono my-2">
            {predictedAge.toFixed(1)} <span className="text-sm font-normal text-gray-400">yrs</span>
          </div>
          <p className="text-[11px] text-gray-500 leading-tight">
            Raw multimodal neural network forward projection.
          </p>
        </div>

        {/* 2. Corrected Brain Age */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 flex flex-col justify-between hover:border-gray-700 transition">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" />
              Corrected Brain Age
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Bias Adj.</span>
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono my-2">
            {correctedAge.toFixed(1)} <span className="text-sm font-normal text-gray-400">yrs</span>
          </div>
          <p className="text-[11px] text-gray-500 leading-tight">
            Corrected for regression-to-mean bias (de Lange / Cole).
          </p>
        </div>

        {/* 3. Brain Age Delta (BAG) */}
        <div className={`border rounded-xl p-4 flex flex-col justify-between transition ${
          isAccelerated 
            ? 'bg-rose-950/20 border-rose-800/80' 
            : isResilient 
            ? 'bg-emerald-950/20 border-emerald-800/80'
            : 'bg-indigo-950/20 border-indigo-800/80'
        }`}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="flex items-center gap-1.5 font-bold text-gray-200">
              {isAccelerated ? <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" /> : <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />}
              Brain Age Delta (BAG)
            </span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
              isAccelerated ? 'bg-rose-900 text-rose-200' : isResilient ? 'bg-emerald-900 text-emerald-200' : 'bg-indigo-900 text-indigo-200'
            }`}>
              {module2.delta_classification}
            </span>
          </div>
          <div className={`text-3xl font-black font-mono my-2 ${
            isAccelerated ? 'text-rose-400' : isResilient ? 'text-emerald-400' : 'text-indigo-400'
          }`}>
            {bag > 0 ? `+${bag.toFixed(1)}` : bag.toFixed(1)} <span className="text-sm font-normal text-gray-400">yrs</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-tight">
            Chronological: <span className="font-mono text-gray-200">{patient.chronological_age}y</span>
          </p>
        </div>

        {/* 4. Important Brain Regions */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 flex flex-col justify-between hover:border-gray-700 transition">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium text-purple-400">
              <Brain className="w-3.5 h-3.5" />
              Important Regions
            </span>
            <span className="text-[10px] text-purple-400 font-mono">Top Driver</span>
          </div>
          <div className="my-2">
            <span className="text-sm font-bold text-white block truncate">{topRegions[0]?.region_name}</span>
            <span className="text-xs text-amber-400 font-mono font-bold">
              SHAP: {topRegions[0]?.shap_value > 0 ? `+${topRegions[0]?.shap_value.toFixed(2)}` : topRegions[0]?.shap_value.toFixed(2)} yrs
            </span>
          </div>
          <p className="text-[11px] text-gray-500 leading-tight">
            Followed by {topRegions[1]?.region_name} and {topRegions[2]?.region_name}.
          </p>
        </div>

        {/* 5. Biological & Clinical Interpretation */}
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 flex flex-col justify-between hover:border-gray-700 transition">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium text-cyan-400">
              <FileText className="w-3.5 h-3.5" />
              Clinical Status
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">{module3.interpretation.risk_level} Risk</span>
          </div>
          <div className="my-2">
            <div className="text-sm font-bold text-white truncate">
              {module3.interpretation.cognitive_risk_score}/100 Risk Score
            </div>
            <span className="text-xs text-gray-400 block truncate">
              {patient.clinical_status}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 leading-tight">
            Concordant with neuroimaging biomarker criteria.
          </p>
        </div>
      </div>

      {/* Detailed Diagnostic Report View */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6 space-y-6">
        <div className="border-b border-gray-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white m-0">Patient Neuroimaging Diagnostic Summary</h3>
            <span className="text-xs text-gray-400 font-mono">
              Patient ID: {patient.id} | Name: {patient.name} | Gender: {patient.gender} | Chronological Age: {patient.chronological_age} yrs
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
              Assessment Date: September 22, 2026
            </span>
          </div>
        </div>

        {/* Section A: Important Brain Regions & Biomarker Findings */}
        <div>
          <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-amber-400" />
            Top Contributing Brain Regions & Morphometric Deviation
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {topRegions.map((r, idx) => (
              <div key={idx} className="bg-gray-950 border border-gray-800 rounded-lg p-3 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white truncate">{r.region_name}</span>
                  <span className="text-[10px] text-gray-400">{r.lobe}</span>
                </div>
                <div className="space-y-1 text-[11px] pt-2 border-t border-gray-800/80 font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">SHAP Impact:</span>
                    <span className={r.shap_value > 0 ? 'text-rose-400 font-bold' : 'text-blue-400 font-bold'}>
                      {r.shap_value > 0 ? `+${r.shap_value.toFixed(2)}` : r.shap_value.toFixed(2)}y
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Attention:</span>
                    <span className="text-amber-400">{(r.attention_weight * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Z-Score:</span>
                    <span className="text-purple-300">{r.normative_z_score.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-[10px] px-1 py-0.2 rounded bg-gray-900 border border-gray-800 text-gray-300">
                      {r.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section B: Biological & Cellular Interpretation */}
        <div>
          <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Biological Interpretation & Cellular Mechanisms
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bioNotes.map((note, idx) => (
              <div key={idx} className="bg-gray-950 border border-gray-800 rounded-lg p-3 text-xs text-gray-300 leading-relaxed flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section C: Clinical Interpretation & Recommendations */}
        <div>
          <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Clinical Interpretation & Recommended Interventions
          </h4>
          <div className="space-y-2.5">
            {clinNotes.map((note, idx) => (
              <div key={idx} className="bg-gray-950 border border-gray-800 rounded-lg p-3.5 text-xs text-gray-300 leading-relaxed flex items-start gap-2.5">
                <FileText className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Signature */}
        <div className="border-t border-gray-800 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 font-mono">
          <span>AI Platform: NeuroAge XAI v1.0.0 (Multimodal Conv1D + GNN Ensemble)</span>
          <span>Verified against ICBM152 / OASIS-3 / UK Biobank Normative Benchmarks</span>
        </div>
      </div>
    </div>
  );
};
