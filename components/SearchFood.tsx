
import React, { useState, useRef, useEffect } from 'react';
import { analyzeFoodText } from '../services/geminiService';
import { NutritionData, FoodLog } from '../types';

interface SearchFoodProps {
  onLogAdded: (log: FoodLog) => void;
  onBack: () => void;
}

const SearchFood: React.FC<SearchFoodProps> = ({ onLogAdded, onBack }) => {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<NutritionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeFoodText(query);
      setAnalysisResult(result);
    } catch (err: any) {
      setError("Analysis incomplete. Provide precise portions.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addTag = (text: string) => {
    setQuery(prev => prev ? `${prev}, ${text}` : text);
    inputRef.current?.focus();
  };

  const confirmLog = () => {
    if (analysisResult) {
      onLogAdded({
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        data: analysisResult,
        type: 'manual'
      });
    }
  };

  return (
    <div className="h-full bg-red-50/30 flex flex-col">
      {/* Header - Red High Contrast */}
      <div className="p-5 flex justify-between items-center bg-white border-b-4 border-red-900">
        <button onClick={onBack} className="p-3 bg-red-600 text-white rounded-xl active:scale-95 transition-transform shadow-[0_4px_0_0_rgba(153,27,27,1)]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-red-950 font-black uppercase tracking-tighter italic text-xl">Command Console</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 p-5 space-y-6 overflow-y-auto">
        {!analysisResult ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-4">
               <div className="flex gap-2 flex-wrap">
                  {['Lean Protein', 'Fast Carbs', 'Cheat Day', 'Fiber Boost'].map(tag => (
                    <button 
                      key={tag} 
                      onClick={() => addTag(tag)}
                      className="px-3 py-2 bg-white border-2 border-red-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-red-600 hover:border-red-600 hover:bg-red-50 transition-all shadow-sm"
                    >
                      + {tag}
                    </button>
                  ))}
               </div>

               <div className="relative group">
                  <div className="absolute -inset-1 bg-red-600 rounded-[2.5rem] opacity-20 blur-xl animate-pulse group-focus-within:opacity-40 transition-opacity"></div>
                  <div className="relative bg-red-950 rounded-[2.5rem] p-8 shadow-2xl border-4 border-red-900 transition-all">
                    <div className="flex justify-between items-center mb-6">
                       <label className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] italic">Neural Prompt</label>
                       <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
                       </div>
                    </div>
                    <textarea
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g. 150g Ribeye steak, grilled mushrooms, half avocado"
                      className="w-full bg-transparent border-none focus:ring-0 text-2xl text-white font-black italic tracking-tighter placeholder-red-900/60 resize-none min-h-[220px] leading-tight"
                    />
                    <div className="absolute bottom-8 right-8 text-red-800 font-black italic text-[9px] uppercase tracking-[0.2em]">Ready for input...</div>
                  </div>
               </div>
            </div>
            
            <button
              onClick={handleSearch}
              disabled={!query.trim() || isAnalyzing}
              className={`w-full py-6 rounded-[2.5rem] font-black uppercase tracking-widest flex items-center justify-center space-x-3 transition-all shadow-[0_10px_0_0_rgba(153,27,27,1)] active:shadow-none active:translate-y-2 ${
                !query.trim() || isAnalyzing 
                ? 'bg-red-200 text-red-400 shadow-none translate-y-2' 
                : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="animate-pulse">Analyzing Macros...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <span>Execute Scan</span>
                </>
              )}
            </button>

            {error && <p className="text-red-600 text-[10px] text-center font-black uppercase tracking-[0.2em] bg-red-100/50 p-4 rounded-xl border-2 border-red-200">{error}</p>}

            <div className="bg-white border-2 border-red-100 rounded-3xl p-6 shadow-xl">
               <h4 className="text-[10px] font-black text-red-900/30 uppercase tracking-[0.3em] mb-4 italic">Analysis Optimization</h4>
               <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-6 w-6 rounded-lg bg-red-600 text-white flex items-center justify-center text-[10px] font-black italic">01</div>
                    <p className="text-[11px] font-black text-red-900/60 uppercase tracking-tight">Include exact gram measurements for accuracy.</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-6 w-6 rounded-lg bg-red-900 text-white flex items-center justify-center text-[10px] font-black italic">02</div>
                    <p className="text-[11px] font-black text-red-900/60 uppercase tracking-tight">List specific brand names or cooking oils used.</p>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-500 space-y-8">
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl border-4 border-red-900 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <div className="w-4 h-4 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.8)] animate-pulse"></div>
              </div>
              
              <div className="border-b-2 border-red-50 pb-10">
                <div className="min-w-0 flex-1">
                  <h3 className="text-5xl font-black text-red-950 italic uppercase tracking-tighter leading-none truncate pr-4">{analysisResult.name}</h3>
                  <div className="flex items-center space-x-3 mt-6">
                    <span className="bg-red-600 text-white px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest italic">{analysisResult.estimatedWeight}</span>
                    <span className="text-red-100">|</span>
                    <span className="text-red-400 font-black text-[10px] uppercase tracking-widest italic">Computed Profile</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gradient-to-br from-red-900 to-red-950 p-8 rounded-[2.5rem] text-center shadow-2xl border border-red-800">
                    <p className="text-white font-black text-7xl italic tracking-tighter leading-none drop-shadow-xl">{analysisResult.calories}</p>
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3 italic">Total Energy Output</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-red-50/50 p-5 rounded-2xl border-2 border-red-100 text-center">
                    <p className="text-red-950 font-black text-2xl italic tracking-tighter leading-none">{analysisResult.protein}g</p>
                    <p className="text-red-900/40 text-[9px] font-black uppercase tracking-widest mt-2">Protein</p>
                  </div>
                  <div className="bg-red-50/50 p-5 rounded-2xl border-2 border-red-100 text-center">
                    <p className="text-red-950 font-black text-2xl italic tracking-tighter leading-none">{analysisResult.carbs}g</p>
                    <p className="text-red-900/40 text-[9px] font-black uppercase tracking-widest mt-2">Carbs</p>
                  </div>
                  <div className="bg-red-50/50 p-5 rounded-2xl border-2 border-red-100 text-center">
                    <p className="text-red-950 font-black text-2xl italic tracking-tighter leading-none">{analysisResult.fat}g</p>
                    <p className="text-red-900/40 text-[9px] font-black uppercase tracking-widest mt-2">Lipids</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-red-900/20 uppercase tracking-[0.3em] italic">Vitamins & Minerals</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.vitamins.map((vit, i) => (
                    <span key={i} className="bg-white border-2 border-red-600 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic shadow-[3px_3px_0px_0px_rgba(153,27,27,1)]">
                      {vit}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setAnalysisResult(null)}
                className="flex-1 py-6 border-4 border-red-900 rounded-[2.5rem] font-black uppercase tracking-widest text-red-900 hover:bg-red-50 transition-all shadow-[0_6px_0_0_rgba(153,27,27,1)] active:shadow-none active:translate-y-1"
              >
                Discard
              </button>
              <button 
                onClick={confirmLog}
                className="flex-[2] py-6 bg-red-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest shadow-[0_10px_0_0_rgba(153,27,27,1)] hover:bg-red-700 active:shadow-none active:translate-y-2 transition-all"
              >
                Apply to Log
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFood;
