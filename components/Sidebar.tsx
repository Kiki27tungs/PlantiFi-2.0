import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LanguageCode, UIContent } from '../types';

interface SidebarProps {
  currentLang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  texts: UIContent;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentLang, setLang, texts, isOpen, toggleSidebar }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: texts.welcome_title, icon: 'fa-house-chimney' },
    { path: '/analyze', label: texts.ai_assistant_title, icon: 'fa-wand-magic-sparkles' },
    { path: '/calendar', label: texts.crop_calendar_title, icon: 'fa-calendar-check' },
    { path: '/stats', label: texts.crop_stats_title, icon: 'fa-chart-pie' },
    { path: '/prevention', label: texts.prevention_title, icon: 'fa-shield-virus' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-emerald-900 via-teal-900 to-emerald-950 text-white transform transition-all duration-300 ease-in-out z-30 ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} md:translate-x-0 flex flex-col border-r border-white/5`}>
        
        {/* Brand Header */}
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <i className="fa-solid fa-leaf text-white text-lg"></i>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Planti<span className="text-emerald-400">Fi</span>
            </h2>
          </div>
          <p className="text-emerald-200/60 text-xs ml-1">AI-Powered Agriculture</p>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            <p className="px-4 text-xs font-bold text-emerald-500/80 uppercase tracking-wider mb-2 mt-2">Menu</p>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => { if(window.innerWidth < 768) toggleSidebar() }}
                className={`relative group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                  isActive(item.path) 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/50 translate-x-1' 
                    : 'text-emerald-100/70 hover:bg-white/10 hover:text-white hover:translate-x-1'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-5 text-center transition-transform group-hover:scale-110 ${isActive(item.path) ? 'text-white' : 'text-emerald-400/80'}`}></i>
                <span className="font-medium text-sm">{item.label}</span>
                
                {/* Active Indicator Dot */}
                {isActive(item.path) && (
                  <div className="absolute right-3 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Language Selector Box */}
          <div className="mt-8 mx-2 bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/5">
            <label className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-3 uppercase tracking-wide">
              <i className="fa-solid fa-language"></i> Select Language
            </label>
            <div className="relative">
              <select 
                value={currentLang}
                onChange={(e) => setLang(e.target.value as LanguageCode)}
                className="w-full appearance-none bg-emerald-950/50 border border-emerald-700/50 rounded-xl px-4 py-3 text-sm text-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all cursor-pointer hover:bg-emerald-900/50"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Bengali">Bengali (বাংলা)</option>
                <option value="Marathi">Marathi (मराठी)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
                <option value="Telugu">Telugu (తెలుగు)</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-400">
                <i className="fa-solid fa-chevron-down text-xs"></i>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-black/10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
               KT
             </div>
             <div>
               <p className="text-xs text-white font-medium">Kiki Tungoe</p>
               <p className="text-[10px] text-emerald-400/70">Pro Version</p>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;