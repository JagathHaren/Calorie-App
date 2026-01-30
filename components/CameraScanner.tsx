
import React, { useState, useRef, useCallback } from 'react';
import { analyzeFoodImage } from '../services/geminiService';
import { NutritionData, FoodLog } from '../types';

interface CameraScannerProps {
  onLogAdded: (log: FoodLog) => void;
  onBack: () => void;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onLogAdded, onBack }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<NutritionData | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      setError("Unable to access camera. Please check permissions or try uploading a photo.");
      console.error(err);
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPhoto(dataUrl);
        stopCamera();
        performAnalysis(dataUrl);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setPhoto(dataUrl);
        performAnalysis(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const performAnalysis = async (imageData: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      // Remove data:image/jpeg;base64, prefix for the API
      const base64 = imageData.split(',')[1];
      const result = await analyzeFoodImage(base64);
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message || "Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const confirmLog = () => {
    if (analysisResult) {
      onLogAdded({
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        data: analysisResult,
        imageUrl: photo || undefined,
        type: 'photo'
      });
    }
  };

  React.useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <div className="h-full bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
        <button onClick={onBack} className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-white font-bold">AI Food Scan</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {!photo && !stream && !error && (
          <div className="text-center p-8">
            <div className="bg-indigo-600/20 p-6 rounded-full inline-block mb-6">
              <svg className="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Scan Your Food</h3>
            <p className="text-slate-400 mb-8 max-w-xs mx-auto">Point your camera at your meal and NutriLens will analyze calories and macros instantly.</p>
            <div className="space-y-4 w-full px-10">
              <button 
                onClick={startCamera}
                className="w-full bg-indigo-600 py-4 rounded-2xl text-white font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
              >
                Start Camera
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-white/10 backdrop-blur-md py-4 rounded-2xl text-white font-bold hover:bg-white/20 transition-colors"
              >
                Upload Photo
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>
        )}

        {stream && !photo && (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-8">
              <button 
                onClick={() => { stopCamera(); onBack(); }}
                className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button 
                onClick={capturePhoto}
                className="h-20 w-20 bg-white rounded-full flex items-center justify-center p-1"
              >
                <div className="h-full w-full rounded-full border-4 border-slate-900 bg-white"></div>
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </button>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/50 rounded-3xl pointer-events-none">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-lg"></div>
            </div>
          </>
        )}

        {photo && (
          <div className="w-full h-full flex flex-col relative overflow-hidden">
            <img src={photo} alt="Captured food" className="w-full h-2/5 object-cover" />
            
            <div className="flex-1 bg-white rounded-t-3xl -mt-6 p-6 overflow-y-auto">
              {isAnalyzing ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 py-12">
                  <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-center">
                    <p className="font-bold text-slate-800 text-lg">Analyzing Food...</p>
                    <p className="text-slate-400 text-sm">Identifying nutrients and ingredients</p>
                  </div>
                </div>
              ) : error ? (
                <div className="py-12 text-center">
                  <div className="text-rose-500 mb-4 flex justify-center">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="font-bold text-slate-800 mb-2">Something went wrong</p>
                  <p className="text-slate-500 text-sm mb-6 px-10">{error}</p>
                  <button 
                    onClick={() => { setPhoto(null); setAnalysisResult(null); startCamera(); }}
                    className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold"
                  >
                    Try Again
                  </button>
                </div>
              ) : analysisResult ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800 capitalize">{analysisResult.name}</h3>
                      <p className="text-slate-500 font-medium">{analysisResult.estimatedWeight}</p>
                    </div>
                    <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
                      <p className="text-indigo-600 font-bold text-xl">{analysisResult.calories}</p>
                      <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider">Calories</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 text-center">
                      <p className="text-emerald-700 font-bold text-lg">{analysisResult.protein}g</p>
                      <p className="text-emerald-600 text-[10px] font-bold uppercase">Protein</p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100 text-center">
                      <p className="text-amber-700 font-bold text-lg">{analysisResult.carbs}g</p>
                      <p className="text-amber-600 text-[10px] font-bold uppercase">Carbs</p>
                    </div>
                    <div className="bg-rose-50 p-3 rounded-2xl border border-rose-100 text-center">
                      <p className="text-rose-700 font-bold text-lg">{analysisResult.fat}g</p>
                      <p className="text-rose-600 text-[10px] font-bold uppercase">Fat</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Key Vitamins</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.vitamins.map((vit, i) => (
                        <span key={i} className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-semibold text-slate-600">
                          {vit}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4 sticky bottom-0 bg-white pb-4">
                    <button 
                      onClick={() => { setPhoto(null); setAnalysisResult(null); startCamera(); }}
                      className="flex-1 py-4 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                      Retake
                    </button>
                    <button 
                      onClick={confirmLog}
                      className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-colors"
                    >
                      Log Meal
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Hidden Canvas for capture */}
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    </div>
  );
};

export default CameraScanner;
