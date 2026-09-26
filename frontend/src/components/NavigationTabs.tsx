import React from 'react';
import { 
  Upload, Layers, Dna, Zap, ShieldCheck, 
  Network, BarChart3, Award 
} from 'lucide-react';

export type TabKey = 
  | 'upload'
  | 'overview' 
  | 'module1' 
  | 'module2' 
  | 'module3' 
  | 'module4' 
  | 'evaluation' 
  | 'final_output';

interface NavigationTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { key: 'upload', label: 'Image Upload & Vision Analysis', icon: Upload, badge: 'New', highlight: false },
    { key: 'overview', label: 'Overview & SNN Flow', icon: Layers, badge: 'Flow' },
    { key: 'module1', label: 'Module 1: Evolutionary Optimization (GA + CSA)', icon: Dna, badge: 'M1' },
    { key: 'module2', label: 'Module 2: SNN Brain Age Prediction', icon: Zap, badge: 'M2' },
    { key: 'module3', label: 'Module 3: Explainable AI (XAI)', icon: ShieldCheck, badge: 'M3' },
    { key: 'module4', label: 'Module 4: Advanced Multimodal Learning', icon: Network, badge: 'M4' },
    { key: 'evaluation', label: 'Performance & SNN Energy', icon: BarChart3, badge: 'Eval' },
    { key: 'final_output', label: 'Final Combined Output', icon: Award, badge: 'Final', highlight: true },
  ];

  return (
    <div className="border-b border-gray-800 bg-gray-950 px-6 overflow-x-auto scrollbar-none sticky top-16 z-40">
      <div className="max-w-7xl mx-auto flex gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key as TabKey)}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 font-medium text-xs whitespace-nowrap transition-all ${
                isActive
                  ? tab.highlight
                    ? 'border-emerald-400 text-emerald-400 bg-emerald-950/20'
                    : 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${
                isActive 
                  ? (tab.highlight ? 'text-emerald-400' : 'text-cyan-400') 
                  : 'text-gray-500'
              }`} />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                isActive 
                  ? (tab.highlight ? 'bg-emerald-900/60 text-emerald-300' : 'bg-cyan-900/60 text-cyan-300') 
                  : 'bg-gray-800 text-gray-400'
              }`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
