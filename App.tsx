import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Welcome from './pages/Welcome';
import Analyzer from './pages/Analyzer';
import Calendar from './pages/Calendar';
import Insights from './pages/Insights';
import Prevention from './pages/Prevention';
import { LANGUAGES } from './constants';
import { LanguageCode } from './types';

const App: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('English');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const texts = LANGUAGES[currentLang];

  return (
    <Router>
      <div className="flex bg-gray-100 min-h-screen font-sans">
        <Sidebar 
          currentLang={currentLang} 
          setLang={setCurrentLang} 
          texts={texts} 
          isOpen={isSidebarOpen}
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        />
        
        <main className="flex-1 md:ml-64 relative w-full">
           {/* Mobile Header */}
           <div className="md:hidden bg-emerald-900 text-white p-4 flex items-center justify-between sticky top-0 z-20 shadow-md">
             <span className="font-bold text-lg"><i className="fa-solid fa-leaf"></i> PlantiFi</span>
             <button onClick={() => setSidebarOpen(true)} className="text-white focus:outline-none">
               <i className="fa-solid fa-bars text-2xl"></i>
             </button>
           </div>

           <Routes>
             <Route path="/" element={<Welcome texts={texts} />} />
             <Route path="/analyze" element={<Analyzer texts={texts} lang={currentLang} />} />
             <Route path="/calendar" element={<Calendar texts={texts} />} />
             <Route path="/stats" element={<Insights texts={texts} />} />
             <Route path="/prevention" element={<Prevention texts={texts} />} />
           </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
