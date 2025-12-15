import React, { useState, useMemo } from 'react';
import { UIContent, SeasonalTip } from '../types';

interface PreventionProps {
  texts: UIContent;
}

type TabType = 'general' | 'soil' | 'seasonal';

const Prevention: React.FC<PreventionProps> = ({ texts }) => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [completedTips, setCompletedTips] = useState<Set<string>>(new Set());

  const toggleTip = (id: string) => {
    const newSet = new Set(completedTips);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setCompletedTips(newSet);
  };

  // Combine data for search
  const filteredContent = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    
    const filterList = (list: string[], prefix: string) => 
      list.map((text, idx) => ({ id: `${prefix}-${idx}`, text, type: prefix }))
          .filter(item => item.text.toLowerCase().includes(lowerQuery));

    const filterSeasonal = (list: SeasonalTip[]) =>
      list.map((item, idx) => ({ ...item, id: `seasonal-${idx}`, type: 'seasonal' }))
          .filter(item => item.name.toLowerCase().includes(lowerQuery) || item.desc.toLowerCase().includes(lowerQuery));

    return {
      general: filterList(texts.general_tips, 'general'),
      soil: filterList(texts.soil_tips, 'soil'),
      seasonal: filterSeasonal(texts.seasonal_tips)
    };
  }, [searchQuery, texts]);

  // Calculate Progress
  const totalTips = texts.general_tips.length + texts.soil_tips.length + texts.seasonal_tips.length;
  const progress = Math.round((completedTips.size / totalTips) * 100);

  const renderTabButton = (id: TabType, label: string, icon: string, colorClass: string) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-4 px-2 md:px-6 rounded-xl font-bold transition-all duration-300 flex flex-col md:flex-row items-center justify-center gap-2 ${
        activeTab === id 
          ? `${colorClass} text-white shadow-lg transform -translate-y-1` 
          : 'bg-white text-gray-500 hover:bg-gray-50'
      }`}
    >
      <i className={`fa-solid ${icon} text-lg`}></i>
      <span className="text-sm md:text-base">{label}</span>
    </button>
  );

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto">
        
        {/* Header with Progress */}
        <div className="bg-emerald-900 rounded-3xl p-8 text-white shadow-2xl mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{texts.prevention_title}</h1>
              <p className="text-emerald-200">Track your garden safety measures</p>
            </div>
            
            <div className="bg-emerald-800/50 p-4 rounded-2xl backdrop-blur-sm border border-emerald-700 w-full md:w-auto min-w-[250px]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">My Checklist</span>
                <span className="font-bold">{progress}% Done</span>
              </div>
              <div className="w-full bg-emerald-950 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls: Tabs & Search */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
           <div className="flex bg-gray-200 p-1 rounded-2xl flex-1">
              {renderTabButton('general', texts.general_prevention_title.split(' ')[0], 'fa-shield-virus', 'bg-emerald-600')}
              {renderTabButton('soil', 'Soil', 'fa-flask', 'bg-amber-600')}
              {renderTabButton('seasonal', 'Seasonal', 'fa-calendar-check', 'bg-blue-600')}
           </div>
           
           <div className="relative md:w-1/3">
             <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
             <input 
                type="text" 
                placeholder="Search tips..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-md focus:ring-2 focus:ring-emerald-500 outline-none"
             />
           </div>
        </div>

        {/* Content Area */}
        <div className="space-y-4">
          
          {/* General Tips List */}
          {activeTab === 'general' && (
            <div className="grid gap-4 animate-fade-in">
              {filteredContent.general.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => toggleTip(item.id)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between group ${
                    completedTips.has(item.id)
                      ? 'bg-emerald-50 border-emerald-200 shadow-none'
                      : 'bg-white border-transparent shadow-md hover:border-emerald-200 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      completedTips.has(item.id) ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-emerald-100 group-hover:text-emerald-500'
                    }`}>
                      <i className={`fa-solid ${completedTips.has(item.id) ? 'fa-check' : 'fa-leaf'}`}></i>
                    </div>
                    <span className={`text-lg font-medium ${completedTips.has(item.id) ? 'text-gray-500 line-through decoration-emerald-500' : 'text-gray-800'}`}>
                      {item.text}
                    </span>
                  </div>
                  {completedTips.has(item.id) && <span className="text-xs font-bold text-emerald-600 uppercase bg-emerald-100 px-2 py-1 rounded">Done</span>}
                </div>
              ))}
              {filteredContent.general.length === 0 && <p className="text-center text-gray-400 py-10">No tips found matching your search.</p>}
            </div>
          )}

          {/* Soil Tips List */}
          {activeTab === 'soil' && (
            <div className="grid gap-4 animate-fade-in">
              {filteredContent.soil.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => toggleTip(item.id)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between group ${
                    completedTips.has(item.id)
                      ? 'bg-amber-50 border-amber-200 shadow-none'
                      : 'bg-white border-transparent shadow-md hover:border-amber-200 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      completedTips.has(item.id) ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-amber-100 group-hover:text-amber-500'
                    }`}>
                      <i className={`fa-solid ${completedTips.has(item.id) ? 'fa-check' : 'fa-mound'}`}></i>
                    </div>
                    <span className={`text-lg font-medium ${completedTips.has(item.id) ? 'text-gray-500 line-through decoration-amber-500' : 'text-gray-800'}`}>
                      {item.text}
                    </span>
                  </div>
                  {completedTips.has(item.id) && <span className="text-xs font-bold text-amber-600 uppercase bg-amber-100 px-2 py-1 rounded">Done</span>}
                </div>
              ))}
              {filteredContent.soil.length === 0 && <p className="text-center text-gray-400 py-10">No soil tips found.</p>}
            </div>
          )}

          {/* Seasonal Cards */}
          {activeTab === 'seasonal' && (
            <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
              {filteredContent.seasonal.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => toggleTip(item.id)}
                  className={`relative overflow-hidden rounded-3xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                    completedTips.has(item.id)
                      ? 'bg-blue-50 border-blue-200 opacity-80'
                      : 'bg-white border-transparent shadow-lg hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                       completedTips.has(item.id) ? 'bg-blue-200 text-blue-600' : 'bg-blue-100 text-blue-600'
                     }`}>
                        <i className={`fa-solid ${item.icon}`}></i>
                     </div>
                     <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                       completedTips.has(item.id) ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-200 text-transparent'
                     }`}>
                       <i className="fa-solid fa-check text-xs"></i>
                     </div>
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 ${completedTips.has(item.id) ? 'text-gray-500' : 'text-gray-800'}`}>{item.name}</h3>
                  <p className={`text-sm leading-relaxed ${completedTips.has(item.id) ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Pro Tip Footer */}
        <div className="mt-12 bg-yellow-50 rounded-2xl p-6 border border-yellow-100 flex gap-4 items-start shadow-sm">
           <div className="bg-yellow-100 p-3 rounded-full text-yellow-600 shrink-0">
             <i className="fa-solid fa-lightbulb text-xl"></i>
           </div>
           <div>
             <h4 className="font-bold text-yellow-800 uppercase text-sm mb-1">{texts.pro_tip_title}</h4>
             <p className="text-yellow-900/80">{texts.pro_tip_desc}</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Prevention;
