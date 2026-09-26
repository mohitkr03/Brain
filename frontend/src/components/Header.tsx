import React from 'react';
import { Activity, Play, RefreshCw, UserCheck, ShieldAlert, Sparkles, Brain } from 'lucide-react';
import { PatientInput } from '../types/pipeline';

interface HeaderProps {
  presets: PatientInput[];
  selectedPatient: PatientInput;
  onSelectPatient: (patient: PatientInput) => void;
  onRunFullPipeline: () => void;
  isRunningPipeline: boolean;
  backendOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  presets,
  selectedPatient,
  onSelectPatient,
  onRunFullPipeline,
  isRunningPipeline,
  backendOnline,
}) => {
  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white m-0">NeuroAge XAI</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 font-medium">
                Multimodal 4-Stage
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 font-medium ${
                backendOnline 
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800' 
                  : 'bg-amber-950/80 text-amber-400 border-amber-800'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {backendOnline ? 'API Active' : 'Connecting...'}
              </span>
            </div>
            <p className="text-xs text-gray-400 m-0">
              Structural (sMRI) • Functional (fMRI) • Diffusion (dMRI) • Explainable AI
            </p>
          </div>
        </div>

        {/* Middle & Right Controls */}
        <div className="flex items-center gap-3 flex-wrap justify-end">
          {/* Patient Selector */}
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg p-1.5">
            <span className="text-xs text-gray-400 pl-2 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> Patient:
            </span>
            <select
              value={selectedPatient.id}
              onChange={(e) => {
                const found = presets.find((p) => p.id === e.target.value);
                if (found) onSelectPatient(found);
              }}
              className="bg-gray-800 text-white text-xs font-medium rounded px-2.5 py-1 border border-gray-700 focus:outline-none focus:border-indigo-500"
            >
              {presets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.chronological_age}y - {p.clinical_status})
                </option>
              ))}
            </select>
          </div>

          {/* Run Full Pipeline Button */}
          <button
            onClick={onRunFullPipeline}
            disabled={isRunningPipeline}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white shadow-md transition-all ${
              isRunningPipeline
                ? 'bg-indigo-700/60 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 hover:shadow-indigo-500/25 active:scale-95'
            }`}
          >
            {isRunningPipeline ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Executing Pipeline...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Run Full Pipeline
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
