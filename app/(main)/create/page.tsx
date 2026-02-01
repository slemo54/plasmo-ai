'use client';

import React, { useState } from 'react';
import { 
  Wand2, 
  Image as ImageIcon, 
  Type, 
  Settings2, 
  Sparkles,
  Maximize2,
  Loader2,
  Check,
  Download
} from 'lucide-react';
import { useCreateVideo } from '@/lib/hooks';
import { AspectRatio, Resolution } from '@/types';
import { PromptEnhancer } from '@/components/dashboard';

export default function VideoGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.LANDSCAPE);
  const [resolution, setResolution] = useState<Resolution>(Resolution.P720);
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [duration, setDuration] = useState(4);
  
  const { generateVideo, isGenerating, progress, result, error, reset } = useCreateVideo();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    try {
      await generateVideo({
        prompt,
        aspectRatio,
        resolution,
        duration,
      });
    } catch (err) {
      console.error('Generation failed:', err);
    }
  };

  const handleEnhancedPrompt = (enhanced: string) => {
    setPrompt(enhanced);
  };

  return (
    <div className="flex h-screen overflow-hidden animate-fade-in">
      
      {/* Main Creation Area */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Preview Area */}
        <div className="flex-1 bg-[#050608] relative flex items-center justify-center p-8">
          <div className="w-full max-w-4xl aspect-video bg-[#0f1014] rounded-xl border border-slate-800/50 relative overflow-hidden group shadow-2xl">
            {/* Empty State / Placeholder */}
            {!result && !isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                <div className="size-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="size-8 opacity-50" />
                </div>
                <p className="text-sm">Your masterpiece will appear here</p>
              </div>
            )}

            {/* Generating State */}
            {isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 z-10">
                <div className="w-64 space-y-4">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Generating video...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 text-center">Powered by Google Veo 3.1</p>
                </div>
              </div>
            )}

            {/* Result */}
            {result && !isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <video 
                  src={result} 
                  controls 
                  autoPlay 
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Overlay Controls */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {result && (
                <a 
                  href={result} 
                  download 
                  className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-colors"
                >
                  <Download size={18} />
                </a>
              )}
              <button className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-colors">
                <Maximize2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Prompt Input Area */}
        <div className="h-auto bg-[#111218] border-t border-slate-800/60 p-6 lg:p-8 shrink-0">
          <div className="max-w-4xl mx-auto space-y-4">
            
            {/* Input Tabs */}
            <div className="flex gap-4 mb-2">
              <button 
                onClick={() => setActiveTab('text')}
                className={`flex items-center gap-2 text-sm font-medium pb-2 transition-all ${
                  activeTab === 'text'
                    ? 'text-blue-400 border-b-2 border-blue-500'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Type size={16} /> Text to Video
              </button>
              <button 
                onClick={() => setActiveTab('image')}
                className={`flex items-center gap-2 text-sm font-medium pb-2 transition-all ${
                  activeTab === 'image'
                    ? 'text-blue-400 border-b-2 border-blue-500'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <ImageIcon size={16} /> Image to Video
              </button>
            </div>

            {/* Prompt Box */}
            <div className="relative">
              <textarea 
                className="w-full h-32 bg-[#161821] border border-slate-700 rounded-xl p-4 pr-32 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none transition-all"
                placeholder="Describe your video in detail... e.g., A futuristic drone shot of a neon-lit Tokyo street at night, rain reflecting on the pavement, cinematic lighting, 8k"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isGenerating}
              />
              
              <div className="absolute bottom-3 left-3 flex gap-2">
                 <PromptEnhancer prompt={prompt} onEnhanced={handleEnhancedPrompt} />
              </div>

              <div className="absolute bottom-4 right-4">
                <button 
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transform hover:scale-[1.02] transition-all"
                >
                  {isGenerating ? (
                    <><Loader2 size={18} className="animate-spin" /> Generating...</>
                  ) : result ? (
                    <><Check size={18} /> Done</>
                  ) : (
                    <><Sparkles size={18} /> Generate</>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

             <p className="text-center text-xs text-slate-500">
               Powered by Google Veo 3.1 • {resolution === '4k' ? '20' : resolution === '1080p' ? '15' : '10'} credits per generation
             </p>

          </div>
        </div>
      </div>

      {/* Settings Sidebar (Right) */}
      <aside className="w-80 border-l border-slate-800/60 bg-[#111218] p-6 hidden xl:flex flex-col h-full overflow-y-auto shrink-0">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Settings2 className="size-5 text-blue-500" />
          Configuration
        </h2>

        <div className="space-y-8">
          {/* Aspect Ratio */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-2">
              <AspectRatioBtn 
                label="16:9" 
                icon={<div className="w-6 h-3 border-2 border-current rounded-sm"/>} 
                active={aspectRatio === AspectRatio.LANDSCAPE}
                onClick={() => setAspectRatio(AspectRatio.LANDSCAPE)}
              />
              <AspectRatioBtn 
                label="9:16" 
                icon={<div className="w-3 h-6 border-2 border-current rounded-sm"/>} 
                active={aspectRatio === AspectRatio.PORTRAIT}
                onClick={() => setAspectRatio(AspectRatio.PORTRAIT)}
              />
              <AspectRatioBtn 
                label="1:1" 
                icon={<div className="w-4 h-4 border-2 border-current rounded-sm"/>} 
                active={aspectRatio === AspectRatio.SQUARE}
                onClick={() => setAspectRatio(AspectRatio.SQUARE)}
              />
            </div>
          </div>

          {/* Resolution */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quality</label>
            <div className="space-y-2">
              <QualityOption 
                label="720p HD" 
                credits={10} 
                active={resolution === Resolution.P720}
                onClick={() => setResolution(Resolution.P720)}
              />
              <QualityOption 
                label="1080p Full HD" 
                credits={15} 
                active={resolution === Resolution.P1080}
                onClick={() => setResolution(Resolution.P1080)}
              />
              <QualityOption 
                label="4K Ultra HD" 
                credits={20} 
                badge="PRO"
                active={resolution === Resolution.P4K}
                onClick={() => setResolution(Resolution.P4K)}
              />
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-3">
             <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Duration</label>
             <input 
               type="range" 
               min="1" 
               max="10" 
               value={duration}
               onChange={(e) => setDuration(Number(e.target.value))}
               className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600" 
             />
             <div className="flex justify-between text-xs text-slate-500">
               <span>1s</span>
               <span className="text-blue-400 font-medium">{duration}s</span>
               <span>10s</span>
             </div>
          </div>

          {/* Style Preset */}
           <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Style</label>
            <select className="w-full bg-[#161821] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500">
              <option>Cinematic (Default)</option>
              <option>Anime</option>
              <option>3D Render</option>
              <option>Photorealistic</option>
            </select>
          </div>
        </div>

        <div className="mt-auto pt-8">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Cost:</span>
              <span className="text-white font-medium">
                {resolution === Resolution.P4K ? '20' : resolution === Resolution.P1080 ? '15' : '10'} Credits
              </span>
            </div>
             <div className="flex justify-between text-sm">
              <span className="text-slate-400">Balance:</span>
              <span className="text-blue-400">85 Credits</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

// Components

function AspectRatioBtn({ label, icon, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
        active 
          ? 'bg-blue-600/10 border-blue-500 text-blue-400' 
          : 'bg-[#161821] border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function QualityOption({ label, credits, active, badge, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex justify-between items-center p-3 rounded-lg border text-left transition-all ${
        active
          ? 'bg-blue-600/10 border-blue-500'
          : 'bg-[#161821] border-slate-800 hover:border-slate-700'
      }`}
    >
      <div>
        <div className={`text-sm font-medium ${active ? 'text-blue-400' : 'text-slate-300'}`}>{label}</div>
        <div className="text-xs text-slate-500">{credits} credits</div>
      </div>
      {badge && (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          {badge}
        </span>
      )}
      {active && <div className="size-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />}
    </button>
  );
}
