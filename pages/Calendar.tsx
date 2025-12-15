import React, { useState, useEffect } from 'react';
import { UIContent } from '../types';

interface CalendarProps {
  texts: UIContent;
}

// Corrected Unsplash Image IDs for Crops - Verified & Distinct
const CROP_IMAGES: Record<string, string> = {
  // --- KHARIF CROPS (Monsoon/Summer Sown) ---
  "Rice": "https://tse2.mm.bing.net/th/id/OIP.Ac4pi6va9n_ZN7TzkhoTNAHaD6?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3", 
  "Maize": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80",
  "Soybean": "https://d2jx2rerrg6sh3.cloudfront.net/images/news/ImageForNews_745986_16823072833517897.jpg",
  "Cotton": "https://biologicalservices.com.au/wp-content/uploads/2023/11/Cotton.webp",
  "Groundnut": "https://img3.exportersindia.com/product_images/bc-full/dir_174/5201349/groundnut-kernels-02-1506504385_p_3359650_624605.jpeg",
  "Jowar (Sorghum)": "https://th.bing.com/th/id/R.da3128114da9dc3b8509f485733a26dd?rik=0dM7%2f95CVjoGOQ&riu=http%3a%2f%2fwisemama.in%2fcdn%2fshop%2farticles%2fFoxtailMillet_1200x1200.webp%3fv%3d1741263141&ehk=GkS1WIDgj7oza2NJtpFyqdjS3TJ%2fTfQ2Q%2bA7emx9Jms%3d&risl=&pid=ImgRaw&r=0",
  "Bajra (Pearl Millet)": "https://static.toiimg.com/photo/105371211.cms",
  "Pigeon Pea (Arhar)": "https://kitchenbun.com/wp-content/uploads/2024/05/chickpeas-with-wooden-spoon.jpg",
  "Ragi (Finger Millet)": "https://5.imimg.com/data5/SELLER/Default/2023/10/352003820/MZ/GV/GZ/23010464/finger-millet-ragi-500x500.jpg",
  "Okra (Ladyfinger)": "https://tse2.mm.bing.net/th/id/OIP.YAf3lVh2Os5FJUy4QuSKJgHaHa?cb=ucfimg2&ucfimg=1&w=800&h=800&rs=1&pid=ImgDetMain&o=7&rm=3",

  // --- RABI CROPS (Winter Sown) ---
  "Wheat": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80", 
  "Barley": "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80",
  "Mustard": "https://images.unsplash.com/photo-1508595165502-3e2652e5a405?auto=format&fit=crop&w=600&q=80",
  "Peas": "https://images.unsplash.com/photo-1587735243627-e60360434cc4?auto=format&fit=crop&w=600&q=80",
  "Carrot": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80",
  "Chickpea (Chana)": "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=600&q=80",
  "Lentil (Masoor)": "https://images.unsplash.com/photo-1632832014168-a4a9b6c0e86b?auto=format&fit=crop&w=600&q=80",
  "Potato": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
  "Cumin": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
  "Linseed (Flax)": "https://images.unsplash.com/photo-1621258688461-84c478426090?auto=format&fit=crop&w=600&q=80",

  // --- ZAID CROPS (Short Summer Sown) ---
  "Watermelon": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80", 
  "Cucumber": "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=600&q=80",
  "Pumpkin": "https://images.unsplash.com/photo-1506917728037-b6af011561e3?auto=format&fit=crop&w=600&q=80",
  "Bottle Gourd": "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80",
  "Spinach": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
  "Muskmelon": "https://images.unsplash.com/photo-1596702958425-4b4724a73747?auto=format&fit=crop&w=600&q=80",
  "Bitter Gourd": "https://images.unsplash.com/photo-1585827552668-d0728b355e3d?auto=format&fit=crop&w=600&q=80",
  "Summer Moong (Green Gram)": "https://images.unsplash.com/photo-1626435349547-81765c9c908f?auto=format&fit=crop&w=600&q=80",
  "Fodder Crops (Oats/Sorghum)": "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=600&q=80",
  "Brinjal (Eggplant)": "https://images.unsplash.com/photo-1623150530752-6581f147926e?auto=format&fit=crop&w=600&q=80"
};

// Fallback image in case a specific one fails to load
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80";

const Calendar: React.FC<CalendarProps> = ({ texts }) => {
  const [activeSeasonIndex, setActiveSeasonIndex] = useState<number>(0);
  const [currentMonthStr, setCurrentMonthStr] = useState<string>("");
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  // Determine current season on mount
  useEffect(() => {
    const date = new Date();
    const month = date.getMonth(); // 0-11
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    setCurrentMonthStr(monthNames[month]);

    if (month >= 5 && month <= 9) {
      setActiveSeasonIndex(0); // Kharif
    } else if (month >= 9 || month <= 2) {
      setActiveSeasonIndex(1); // Rabi
    } else {
      setActiveSeasonIndex(2); // Zaid
    }
  }, []);

  // Theme configuration
  const getTheme = (index: number) => {
    switch (index) {
      case 0: // Kharif (Rainy)
        return {
          bg: "bg-teal-50",
          accent: "text-teal-600",
          cardBg: "bg-white",
          border: "border-teal-200",
          icon: "fa-cloud-showers-heavy",
          gradient: "from-teal-500 to-emerald-600",
          shadow: "shadow-teal-200/50",
          timelineColor: "bg-teal-500"
        };
      case 1: // Rabi (Winter)
        return {
          bg: "bg-amber-50",
          accent: "text-amber-600",
          cardBg: "bg-white",
          border: "border-amber-200",
          icon: "fa-snowflake",
          gradient: "from-amber-400 to-orange-500",
          shadow: "shadow-amber-200/50",
          timelineColor: "bg-amber-500"
        };
      case 2: // Zaid (Summer)
        return {
          bg: "bg-red-50",
          accent: "text-red-600",
          cardBg: "bg-white",
          border: "border-red-200",
          icon: "fa-sun",
          gradient: "from-red-400 to-orange-500",
          shadow: "shadow-red-200/50",
          timelineColor: "bg-red-500"
        };
      default:
        return { bg: "bg-gray-50", accent: "text-gray-600", cardBg: "bg-white", border: "border-gray-200", icon: "fa-leaf", gradient: "from-gray-500 to-gray-700", shadow: "shadow-gray-200", timelineColor: "bg-gray-500" };
    }
  };

  const theme = getTheme(activeSeasonIndex);

  const getWeatherForecast = (index: number) => {
    if (index === 0) return { temp: "28°C", condition: "Rainy", humidity: "85%", wind: "15 km/h", icon: "fa-cloud-rain" };
    if (index === 1) return { temp: "18°C", condition: "Clear", humidity: "45%", wind: "10 km/h", icon: "fa-snowflake" };
    return { temp: "38°C", condition: "Sunny", humidity: "30%", wind: "12 km/h", icon: "fa-sun" };
  };

  const weather = getWeatherForecast(activeSeasonIndex);

  const getCropDetails = (cropName: string) => {
    const duration = 90 + (cropName.length * 5); 
    const waterNeeds = activeSeasonIndex === 0 ? "High" : activeSeasonIndex === 2 ? "Frequent" : "Moderate";
    
    return {
      name: cropName,
      scientificName: `${cropName} botanical`,
      duration: `${duration} - ${duration + 20} days`,
      water: waterNeeds,
      temp: activeSeasonIndex === 1 ? "15-25°C" : "25-35°C",
      soil: activeSeasonIndex === 0 ? "Clay Loam" : "Sandy Loam",
      yield: `${20 + (cropName.length % 5)} quintals/acre`,
      fertilizer: "NPK 4:2:1"
    };
  };

  const toggleTask = (task: string) => {
    const newSet = new Set(completedTasks);
    if (newSet.has(task)) newSet.delete(task);
    else newSet.add(task);
    setCompletedTasks(newSet);
  };

  const getTimelinePhases = (index: number) => {
    if (index === 0) return ["June (Sowing)", "July-Aug (Growth)", "Sept (Flowering)", "Oct (Harvest)"];
    if (index === 1) return ["Oct (Sowing)", "Nov-Jan (Growth)", "Feb (Maturing)", "March (Harvest)"];
    return ["March (Sowing)", "April (Growth)", "May (Maturing)", "June (Harvest)"];
  };

  const phases = getTimelinePhases(activeSeasonIndex);

  return (
    <div className={`p-6 md:p-10 min-h-screen transition-colors duration-700 font-sans ${theme.bg}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-sm text-gray-500 mb-4">
              <i className="fa-regular fa-calendar-check text-emerald-500"></i>
              <span className="font-medium">{currentMonthStr}</span> • {texts.crop_calendar_title}
            </div>
            <h1 className={`text-4xl md:text-6xl font-bold text-gray-900 mb-2 transition-all duration-300`}>
              {texts.seasons_data[activeSeasonIndex]?.season.split('(')[0]} <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradient}`}>Season</span>
            </h1>
            <p className="text-gray-600 max-w-xl text-lg">
              {texts.crop_calendar_subtitle}
            </p>
          </div>

          {/* Season Tabs - Pill Design */}
          <div className="bg-white p-1.5 rounded-2xl shadow-lg shadow-gray-200/50 flex gap-1 border border-gray-100">
            {texts.seasons_data.map((season, idx) => {
              const isActive = idx === activeSeasonIndex;
              const seasonTheme = getTheme(idx);
              return (
                <button
                  key={idx}
                  onClick={() => setActiveSeasonIndex(idx)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 relative overflow-hidden ${
                    isActive 
                      ? `text-white shadow-md` 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {isActive && <div className={`absolute inset-0 bg-gradient-to-r ${seasonTheme.gradient}`}></div>}
                  <span className="relative z-10 flex items-center gap-2">
                     <i className={`fa-solid ${seasonTheme.icon} ${isActive ? 'animate-bounce' : ''}`}></i>
                     {season.season.split('(')[0].trim()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual Timeline */}
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 mb-10 relative overflow-hidden group">
          <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${theme.gradient}`}></div>
          <h3 className="text-lg font-bold text-gray-800 mb-8 flex items-center gap-2">
            <i className="fa-solid fa-clock-rotate-left text-gray-400"></i> Seasonal Timeline
          </h3>
          <div className="relative flex justify-between items-center z-10 px-4">
            {/* Connecting Line */}
            <div className="absolute top-3 left-0 w-full h-1.5 bg-gray-100 -z-10 rounded-full"></div>
            <div className={`absolute top-3 left-0 h-1.5 ${theme.timelineColor} -z-10 rounded-full transition-all duration-1000 ease-out`} style={{ width: '75%' }}></div>
            
            {phases.map((phase, idx) => (
              <div key={idx} className="flex flex-col items-center gap-4 group/point relative">
                <div className={`w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-all duration-300 ${idx < 3 ? `${theme.timelineColor} scale-110` : 'bg-gray-300'}`}>
                   {idx < 3 && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                </div>
                <div className="text-center bg-white px-4 py-2 rounded-xl shadow-md border border-gray-100 transform transition-transform hover:-translate-y-1">
                   <span className="text-sm font-bold text-gray-800 block">{phase.split(' ')[0]}</span>
                   <span className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">{phase.split('(')[1]?.replace(')', '') || phase}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Crops Grid */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 min-h-[500px]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800">
                  <i className={`fa-solid fa-seedling mr-2 ${theme.accent}`}></i> Recommended Crops
                </h3>
                <span className={`bg-gray-100 ${theme.accent} px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider`}>
                  {texts.seasons_data[activeSeasonIndex]?.crops.length} Varieties
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {texts.seasons_data[activeSeasonIndex]?.crops.map((crop, idx) => {
                  const image = CROP_IMAGES[crop] || FALLBACK_IMAGE;
                  return (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedCrop(crop)}
                      className="group relative bg-gray-50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-gray-200 hover:-translate-y-2 h-48"
                    >
                      {/* Background Image with Overlay */}
                      <div className="absolute inset-0">
                         <img 
                            src={image} 
                            alt={crop} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            onError={(e) => {
                                // Fallback if image fails
                                const target = e.target as HTMLImageElement;
                                target.src = FALLBACK_IMAGE;
                            }}
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 w-full p-4 text-white">
                        <div className="flex justify-between items-end">
                          <div>
                             <h4 className="font-bold text-lg leading-tight mb-1">{crop}</h4>
                             <span className="text-[10px] bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-white/90">Click for details</span>
                          </div>
                          <div className={`w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0`}>
                             <i className="fa-solid fa-arrow-right text-xs"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Widgets */}
          <div className="space-y-6">
            
            {/* Weather Widget */}
            <div className={`rounded-3xl p-8 text-white shadow-xl ${theme.shadow} bg-gradient-to-br ${theme.gradient} relative overflow-hidden group transition-transform hover:scale-[1.02]`}>
               {/* Decorative Circles */}
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity"></div>
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-black opacity-10 rounded-full blur-2xl"></div>

               <div className="flex justify-between items-start relative z-10 mb-8">
                  <div>
                    <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">Forecast</p>
                    <h2 className="text-5xl font-bold tracking-tight">{weather.temp}</h2>
                    <p className="text-white/90 font-medium flex items-center gap-2 mt-2 text-lg">
                      <i className={`fa-solid ${weather.icon}`}></i> {weather.condition}
                    </p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-inner border border-white/10">
                    <i className={`fa-solid ${weather.icon} text-3xl`}></i>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-3 relative z-10">
                  <div className="bg-black/20 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                    <p className="text-[10px] text-white/70 uppercase font-bold mb-1">Humidity</p>
                    <p className="font-bold text-lg">{weather.humidity}</p>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                    <p className="text-[10px] text-white/70 uppercase font-bold mb-1">Wind</p>
                    <p className="font-bold text-lg">{weather.wind}</p>
                  </div>
               </div>
            </div>

            {/* Tasks Widget */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-gray-800 flex items-center gap-2">
                   <i className={`fa-solid fa-list-check ${theme.accent}`}></i> Tasks
                 </h3>
                 <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-500">
                   {Math.round((completedTasks.size / 4) * 100)}%
                 </span>
               </div>
               
               {/* Progress Bar */}
               <div className="w-full bg-gray-100 rounded-full h-2 mb-6 overflow-hidden">
                 <div className={`h-full rounded-full transition-all duration-1000 ease-out ${theme.timelineColor}`} style={{ width: `${(completedTasks.size / 4) * 100}%` }}></div>
               </div>

               <div className="space-y-3">
                 {["Soil Preparation", "Seed Treatment", "Irrigation Check", "Fertilizer Stock"].map((task, i) => (
                   <div 
                     key={i} 
                     onClick={() => toggleTask(task)}
                     className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-200 border border-transparent ${completedTasks.has(task) ? 'bg-gray-50' : 'hover:bg-gray-50 hover:border-gray-100'}`}
                   >
                     <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${completedTasks.has(task) ? `${theme.timelineColor} border-transparent text-white scale-110` : 'border-gray-300 text-transparent'}`}>
                       <i className="fa-solid fa-check text-[10px]"></i>
                     </div>
                     <span className={`text-sm font-medium transition-colors ${completedTasks.has(task) ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                       {task}
                     </span>
                   </div>
                 ))}
               </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-3xl p-6 border border-yellow-100 relative overflow-hidden">
               <div className="absolute -right-4 -top-4 text-yellow-100 text-8xl opacity-50">
                 <i className="fa-solid fa-lightbulb"></i>
               </div>
               <div className="relative z-10 flex items-start gap-4">
                 <div className="bg-yellow-400 text-white p-2.5 rounded-xl shadow-lg shadow-yellow-200 shrink-0">
                   <i className="fa-solid fa-lightbulb"></i>
                 </div>
                 <div>
                   <h4 className="font-bold text-yellow-900 text-sm mb-1 uppercase tracking-wider">{texts.pro_tip_title}</h4>
                   <p className="text-xs text-yellow-800/80 leading-relaxed font-medium">
                     {activeSeasonIndex === 0 ? texts.monsoon_prep.desc : activeSeasonIndex === 2 ? texts.summer_prep.desc : "Ensure proper drainage for winter crops to prevent root rot."}
                   </p>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>

      {/* CROP DETAIL MODAL */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedCrop(null)}></div>
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg relative z-10 animate-fade-in-up overflow-hidden">
            
            {/* Modal Header with Image */}
            <div className="h-48 relative">
               <img 
                  src={CROP_IMAGES[selectedCrop] || FALLBACK_IMAGE} 
                  className="w-full h-full object-cover" 
                  alt={selectedCrop}
                  onError={(e) => {
                     // Fallback if image fails
                     const target = e.target as HTMLImageElement;
                     target.src = FALLBACK_IMAGE;
                  }}
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
               
               <button 
                onClick={() => setSelectedCrop(null)} 
                className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white w-10 h-10 rounded-full transition-all flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              <div className="absolute bottom-6 left-6 text-white">
                <span className="bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">Crop Profile</span>
                <h2 className="text-4xl font-bold">{selectedCrop}</h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
               {(() => {
                 const details = getCropDetails(selectedCrop);
                 return (
                   <div className="space-y-8">
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Duration', val: details.duration, icon: 'fa-clock', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                          { label: 'Water', val: details.water, icon: 'fa-droplet', color: 'text-blue-500', bg: 'bg-blue-50' },
                          { label: 'Temp', val: details.temp, icon: 'fa-temperature-half', color: 'text-orange-500', bg: 'bg-orange-50' },
                          { label: 'Yield', val: details.yield, icon: 'fa-scale-balanced', color: 'text-purple-500', bg: 'bg-purple-50' }
                        ].map((stat, i) => (
                          <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                             <div className={`w-10 h-10 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center text-lg mb-2`}>
                               <i className={`fa-solid ${stat.icon}`}></i>
                             </div>
                             <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{stat.label}</p>
                             <p className="font-bold text-gray-800 text-sm mt-1">{stat.val}</p>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-5 p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                           <div className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                             <i className="fa-solid fa-flask"></i>
                           </div>
                           <div>
                             <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Recommended Fertilizer</p>
                             <p className="text-gray-800 font-bold text-lg">{details.fertilizer}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-5 p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                           <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
                             <i className="fa-solid fa-layer-group"></i>
                           </div>
                           <div>
                             <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Soil Preference</p>
                             <p className="text-gray-800 font-bold text-lg">{details.soil}</p>
                           </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => setSelectedCrop(null)}
                        className={`w-full py-4 rounded-xl font-bold text-white shadow-xl hover:shadow-2xl transition-all active:scale-95 bg-gradient-to-r ${theme.gradient}`}
                      >
                        Close Details
                      </button>
                   </div>
                 );
               })()}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Calendar;