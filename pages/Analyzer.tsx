import React, { useState, useRef, useEffect } from 'react';
import { UIContent, DiseaseAnalysisResult, LanguageCode } from '../types';
import { analyzePlantImage } from '../services/geminiService';

interface AnalyzerProps {
  texts: UIContent;
  lang: LanguageCode;
}

// BCP 47 Language Codes for Speech API
const SPEECH_LOCALES: Record<LanguageCode, string> = {
  English: 'en-US',
  Hindi: 'hi-IN',
  Bengali: 'bn-IN',
  Marathi: 'mr-IN',
  Tamil: 'ta-IN',
  Telugu: 'te-IN',
};

interface HistoryItem {
  id: string;
  timestamp: Date;
  image: string;
  result: DiseaseAnalysisResult;
}

const Analyzer: React.FC<AnalyzerProps> = ({ texts, lang }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'treatment' | 'prevention'>('diagnosis');
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setResult(null);
      setError(null);
      setSymptoms('');
    };
    reader.readAsDataURL(file);
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = SPEECH_LOCALES[lang];
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSymptoms(prev => prev ? `${prev} ${transcript}` : transcript);
    };
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    setActiveTab('diagnosis');

    try {
      const data = await analyzePlantImage(selectedImage, lang, symptoms);
      setResult(data);
      
      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date(),
        image: selectedImage,
        result: data
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 5)); // Keep last 5

    } catch (err: any) {
      setError(err.message || "Failed to analyze image");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setSelectedImage(item.image);
    setResult(item.result);
    setSymptoms('');
    setError(null);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const targetLocale = SPEECH_LOCALES[lang];
      const voice = voices.find(v => v.lang === targetLocale) || 
                    voices.find(v => v.lang.startsWith(targetLocale.split('-')[0]));
      
      if (voice) utterance.voice = voice;
      utterance.lang = targetLocale;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
           <h1 className="text-3xl font-bold text-emerald-900 flex items-center gap-3">
             <span className="bg-emerald-100 p-2 rounded-xl text-emerald-600"><i className="fa-solid fa-microscope"></i></span>
             {texts.ai_assistant_title}
           </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* COLUMN 1: INPUT & IMAGE */}
          <div className="space-y-6">
            
            {/* Image Preview & Scanner */}
            <div 
              className={`relative bg-gray-100 rounded-3xl overflow-hidden aspect-[4/3] shadow-inner flex flex-col items-center justify-center border-4 transition-colors group ${
                isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-white'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
               {selectedImage ? (
                 <>
                   <img src={selectedImage} alt="Analysis Target" className="w-full h-full object-contain relative z-10" />
                   
                   {/* Scanning Animation Overlay */}
                   {isAnalyzing && (
                     <div className="absolute inset-0 z-20 pointer-events-none">
                       <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-scan"></div>
                       <div className="absolute inset-0 bg-emerald-500/10 animate-pulse"></div>
                     </div>
                   )}

                   {/* Change Image Button */}
                   {!isAnalyzing && (
                     <button 
                       onClick={() => fileInputRef.current?.click()}
                       className="absolute bottom-4 right-4 z-30 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-sm text-sm font-medium transition-all"
                     >
                       <i className="fa-solid fa-camera-rotate mr-2"></i> Change
                     </button>
                   )}
                 </>
               ) : (
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="text-center p-8 cursor-pointer hover:scale-105 transition-transform"
                 >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 text-3xl">
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-700">{texts.upload_label}</h3>
                    <p className="text-gray-500 text-sm mt-2">Drag & Drop or Click to Upload</p>
                 </div>
               )}
               <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
               />
            </div>

            {/* Input Controls */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
               <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between">
                  <span><i className="fa-solid fa-notes-medical mr-2 text-emerald-500"></i> {texts.symptoms_label}</span>
                  {isListening && <span className="text-red-500 text-xs animate-pulse">● Recording...</span>}
               </label>
               <div className="flex gap-2">
                 <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="flex-1 bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-200 resize-none text-gray-700 text-sm"
                    rows={2}
                    placeholder={texts.symptoms_placeholder}
                  />
                  <button
                    onClick={toggleListening}
                    className={`w-14 h-auto rounded-2xl flex items-center justify-center text-xl transition-all ${
                      isListening 
                        ? 'bg-red-500 text-white shadow-red-200 shadow-lg scale-95' 
                        : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                    }`}
                  >
                    <i className={`fa-solid ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
                  </button>
               </div>

               <button
                  onClick={handleAnalyze}
                  disabled={!selectedImage || isAnalyzing}
                  className={`mt-4 w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 relative overflow-hidden group ${
                    !selectedImage || isAnalyzing
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-xl hover:-translate-y-1'
                  }`}
               >
                  {isAnalyzing ? (
                     <span className="flex items-center gap-2">
                       <i className="fa-solid fa-circle-notch fa-spin"></i> Analyzing...
                     </span>
                  ) : (
                     <>
                       <span className="relative z-10 flex items-center gap-2">
                         <i className="fa-solid fa-wand-magic-sparkles"></i> {texts.analyze_button}
                       </span>
                       <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                     </>
                  )}
               </button>
               
               {error && (
                 <div className="mt-3 p-3 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2 animate-fade-in">
                   <i className="fa-solid fa-circle-exclamation"></i> {error}
                 </div>
               )}
            </div>

            {/* Recent History (Horizontal List) */}
            {history.length > 0 && (
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-clock-rotate-left"></i> Recent Scans
                </p>
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {history.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => loadHistoryItem(item)}
                      className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-emerald-400 group transition-all"
                    >
                      <img src={item.image} alt="History" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <i className="fa-solid fa-eye text-white text-[10px]"></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COLUMN 2: RESULTS */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col min-h-[500px] relative">
            
            {/* Empty State */}
            {!result && !isAnalyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 p-8 text-center bg-gray-50/50">
                 <div className="w-32 h-32 border-4 border-dashed border-gray-200 rounded-full flex items-center justify-center mb-4">
                   <i className="fa-solid fa-leaf text-5xl"></i>
                 </div>
                 <h3 className="text-xl font-bold text-gray-400 mb-2">{texts.ready_to_analyze_title}</h3>
                 <p className="max-w-xs text-sm">{texts.ready_to_analyze_desc}</p>
              </div>
            )}

            {/* Results Content */}
            {result && (
              <div className="flex flex-col h-full animate-fade-in">
                 
                 {/* Result Header */}
                 <div className={`p-6 text-white ${result.status === 'Healthy' ? 'bg-gradient-to-br from-emerald-500 to-green-600' : 'bg-gradient-to-br from-orange-500 to-red-600'}`}>
                    <div className="flex justify-between items-start">
                       <div>
                          <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-2 backdrop-blur-sm">
                             {result.status}
                          </div>
                          <h2 className="text-3xl font-bold mb-1 break-words">
                             {result.status === 'Healthy' 
                               ? (lang === 'Hindi' ? 'स्वस्थ पौधा' : 'Healthy Plant') 
                               : result.disease_name}
                          </h2>
                          <p className="text-white/80 font-medium text-lg flex items-center gap-2">
                             <i className="fa-solid fa-seedling"></i> {result.plant_name}
                          </p>
                       </div>

                       {/* Confidence Gauge */}
                       <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center ml-2">
                          <svg className="w-full h-full transform -rotate-90">
                             <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-black/10" />
                             <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" 
                               strokeDasharray={226} 
                               strokeDashoffset={226 - (226 * result.confidence) / 100} 
                               className="text-white transition-all duration-1000 ease-out" 
                             />
                          </svg>
                          <span className="absolute text-sm font-bold">{Math.round(result.confidence)}%</span>
                       </div>
                    </div>
                 </div>

                 {/* Custom Tabs */}
                 <div className="flex border-b border-gray-100 bg-gray-50/50 p-2 gap-2">
                    {[
                      { id: 'diagnosis', label: texts.diagnosis_label, icon: 'fa-stethoscope' },
                      { id: 'treatment', label: texts.treatment_title.split(' ')[0], icon: 'fa-kit-medical', disabled: result.status === 'Healthy' },
                      { id: 'prevention', label: texts.prevention_list_title, icon: 'fa-shield-halved' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        disabled={tab.disabled}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-3 px-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                           activeTab === tab.id 
                             ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100' 
                             : tab.disabled 
                               ? 'text-gray-300 cursor-not-allowed' 
                               : 'text-gray-500 hover:bg-white/60'
                        }`}
                      >
                         <i className={`fa-solid ${tab.icon}`}></i> <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    ))}
                 </div>

                 {/* Tab Content */}
                 <div className="p-6 flex-1 overflow-y-auto bg-gray-50/30">
                    
                    {activeTab === 'diagnosis' && (
                      <div className="space-y-4 animate-fade-in">
                         <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                            <div className="flex justify-between items-center mb-2">
                               <h3 className="font-bold text-blue-900"><i className="fa-solid fa-droplet mr-2"></i> {texts.watering_title}</h3>
                               <button onClick={() => speakText(result.watering_advice)} className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200"><i className="fa-solid fa-volume-high text-xs"></i></button>
                            </div>
                            <p className="text-blue-800 text-sm leading-relaxed break-words">{result.watering_advice}</p>
                         </div>
                         
                         {result.status === 'Healthy' && (
                           <div className="text-center py-10">
                              <i className="fa-solid fa-heart text-red-400 text-5xl mb-4 animate-bounce"></i>
                              <h3 className="text-xl font-bold text-gray-700">Your plant looks great!</h3>
                              <p className="text-gray-500 mt-2">Keep up the good work with regular care.</p>
                           </div>
                         )}
                      </div>
                    )}

                    {activeTab === 'treatment' && result.status !== 'Healthy' && (
                       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in relative">
                          <button onClick={() => speakText(result.treatment_advice)} className="absolute top-4 right-4 text-emerald-500 hover:text-emerald-700"><i className="fa-solid fa-volume-high text-xl"></i></button>
                          <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                             <span className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center"><i className="fa-solid fa-user-doctor"></i></span>
                             Expert Advice
                          </h3>
                          <p className="text-gray-600 leading-relaxed text-base whitespace-pre-line break-words">{result.treatment_advice}</p>
                       </div>
                    )}

                    {activeTab === 'prevention' && (
                       <div className="space-y-3 animate-fade-in">
                          <div className="flex justify-between items-center mb-2">
                             <h3 className="font-bold text-gray-800">Future Protection</h3>
                             <button onClick={() => speakText(result.prevention_tips.join(". "))} className="text-emerald-500 hover:text-emerald-700"><i className="fa-solid fa-volume-high"></i> Listen</button>
                          </div>
                          {result.prevention_tips.map((tip, idx) => (
                             <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 flex gap-3 shadow-sm hover:shadow-md transition-shadow">
                                <div className="mt-1 bg-emerald-100 text-emerald-600 w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                                   <i className="fa-solid fa-check text-xs"></i>
                                </div>
                                <p className="text-gray-700 text-sm break-words">{tip}</p>
                             </div>
                          ))}
                       </div>
                    )}
                 </div>

                 {/* Quick Actions Footer */}
                 <div className="p-4 border-t border-gray-100 bg-white flex gap-3 justify-end">
                    <button onClick={() => window.print()} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors">
                       <i className="fa-solid fa-print mr-2"></i> Print
                    </button>
                    <button className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-sm font-bold transition-colors">
                       <i className="fa-solid fa-share-nodes mr-2"></i> Share Report
                    </button>
                 </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyzer;