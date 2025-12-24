import React, { useState, useEffect } from 'react';
import { UIContent } from '../types';
import { Link } from 'react-router-dom';

interface WelcomeProps {
  texts: UIContent;
}

const Welcome: React.FC<WelcomeProps> = ({ texts }) => {
  const [greeting, setGreeting] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const features = [
    {
      title: "AI Diagnosis",
      desc: "Instant disease detection",
      icon: "fa-camera",
      color: "bg-emerald-500",
      link: "/analyze",
      delay: "delay-100"
    },
    {
      title: "Crop Calendar",
      desc: "Seasonal planting guide",
      icon: "fa-calendar-days",
      color: "bg-blue-500",
      link: "/calendar",
      delay: "delay-200"
    },
    {
      title: "Insights",
      desc: "Market & Yield Stats",
      icon: "fa-chart-line",
      color: "bg-purple-500",
      link: "/stats",
      delay: "delay-300"
    },
    {
      title: "Prevention",
      desc: "Expert care tips",
      icon: "fa-shield-halved",
      color: "bg-amber-500",
      link: "/prevention",
      delay: "delay-500"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col font-sans">
      
      {/* Dynamic Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[20s] ease-linear transform scale-110 hover:scale-100"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1625246333195-03152b4c53fa?auto=format&fit=crop&w=1920&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-emerald-900/70 to-black/60"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center container mx-auto px-6 py-12">
        
        {/* Top Section: Weather & Greeting */}
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-12 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="mb-6 md:mb-0">
             <p className="text-emerald-300 font-medium tracking-wider uppercase text-sm mb-2"><i className="fa-solid fa-sun mr-2"></i> {greeting}, Farmer</p>
             <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight drop-shadow-xl">
               {texts.welcome_title}
             </h1>
          </div>

          {/* Glass Weather Widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 text-white shadow-2xl hover:bg-white/20 transition-colors cursor-default group">
             <div className="text-4xl text-yellow-400 group-hover:animate-spin-slow">
               <i className="fa-solid fa-cloud-sun"></i>
             </div>
             <div>
               <p className="text-3xl font-bold">28°C</p>
               <p className="text-sm text-emerald-100 opacity-80">Sunny • Humidity 65%</p>
             </div>
          </div>
        </div>

        {/* Main Content Split */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Left: Text & CTA */}
          <div className={`lg:w-1/2 space-y-8 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <p className="text-xl md:text-2xl text-emerald-50 font-light leading-relaxed max-w-xl border-l-4 border-emerald-500 pl-6">
              {texts.welcome_subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                to="/analyze"
                className="group relative px-8 py-4 bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                <i className="fa-solid fa-camera text-xl"></i>
                <span>{texts.start_diagnosis}</span>
              </Link>
              
              <Link 
                to="/calendar"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-3"
              >
                <i className="fa-solid fa-calendar-check"></i>
                <span>Plan Season</span>
              </Link>
            </div>
          </div>

          {/* Right: Interactive Feature Grid */}
          <div className="lg:w-1/2 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <Link 
                key={idx}
                to={feature.link}
                className={`bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/15 hover:scale-105 transition-all duration-300 group cursor-pointer ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} ${feature.delay}`}
              >
                <div className={`w-12 h-12 rounded-lg ${feature.color} text-white flex items-center justify-center text-xl mb-4 shadow-lg group-hover:rotate-12 transition-transform`}>
                  <i className={`fa-solid ${feature.icon}`}></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">{feature.title}</h3>
                <p className="text-emerald-100/70 text-sm">{feature.desc}</p>
                <div className="mt-4 flex items-center text-emerald-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                  Explore <i className="fa-solid fa-arrow-right ml-2"></i>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Footer / Stats Ticker */}
      <div className="relative z-10 bg-black/40 backdrop-blur-md border-t border-white/10 py-4">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-emerald-100/60">
           {/* 'Developed by' moved to the left side */}
           <div className="hidden md:block">
             {texts.developed_by}
           </div>

           {/* Stats Ticker moved to the right side */}
           <div className="flex items-center gap-6 mt-2 md:mt-0 overflow-hidden w-full md:w-auto">
             <div className="flex gap-8 animate-marquee whitespace-nowrap">
               <span className="flex items-center gap-2"><i className="fa-solid fa-users text-emerald-500"></i> 12k+ Farmers Active</span>
               <span className="flex items-center gap-2"><i className="fa-solid fa-leaf text-emerald-500"></i> 45k+ Plants Healed</span>
               <span className="flex items-center gap-2"><i className="fa-solid fa-earth-americas text-emerald-500"></i> 6 Languages Supported</span>
             </div>
           </div>

           {/* Mobile view 'Developed by' adjustment */}
           <div className="md:hidden mt-2 border-t border-white/5 pt-2 w-full text-center text-xs">
             {texts.developed_by}
           </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default Welcome;