import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area, PieChart, Pie, Legend, LineChart, Line
} from 'recharts';
import { UIContent } from '../types';

interface InsightsProps {
  texts: UIContent;
}

// Simulated data for trends (since it's not in the static texts)
const YIELD_TRENDS = [
  { year: '2021', traditional: 4000, tech: 4200 },
  { year: '2022', traditional: 4100, tech: 4500 },
  { year: '2023', traditional: 3950, tech: 4900 },
  { year: '2024', traditional: 4200, tech: 5400 },
  { year: '2025', traditional: 4300, tech: 5900 },
];

const RESOURCE_DATA = [
  { name: 'Water', value: 35, color: '#3b82f6' },
  { name: 'Fertilizer', value: 25, color: '#f59e0b' },
  { name: 'Labor', value: 20, color: '#10b981' },
  { name: 'Energy', value: 20, color: '#6366f1' },
];

const Insights: React.FC<InsightsProps> = ({ texts }) => {
  const [activeTab, setActiveTab] = useState<'adoption' | 'trends'>('adoption');
  const [farmSize, setFarmSize] = useState<number>(5); // Acres
  const [selectedTechIdx, setSelectedTechIdx] = useState<number>(0);

  const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

  // Calculate ROI based on selected tech
  const roiCalculation = useMemo(() => {
    const tech = texts.impact_data[selectedTechIdx];
    // Parse "11-15%" to approx number 13
    const boostStr = tech.boost.replace('%', '');
    const parts = boostStr.split('-');
    const avgBoostPercent = parts.length > 1 
      ? (parseFloat(parts[0]) + parseFloat(parts[1])) / 2 
      : parseFloat(parts[0]);
    
    // Assumptions for calc
    const baseYieldPerAcre = 2000; // kg
    const pricePerKg = 25; // currency unit
    
    const totalBaseYield = baseYieldPerAcre * farmSize;
    const additionalYield = totalBaseYield * (avgBoostPercent / 100);
    const extraRevenue = additionalYield * pricePerKg;

    return {
      avgBoostPercent,
      extraRevenue: Math.round(extraRevenue).toLocaleString(),
      additionalYield: Math.round(additionalYield).toLocaleString()
    };
  }, [farmSize, selectedTechIdx, texts.impact_data]);

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wide mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Analytics
            </div>
            <h1 className="text-4xl font-bold text-gray-900">{texts.crop_stats_title}</h1>
            <p className="text-gray-500 mt-2">Data-driven insights for modern agriculture</p>
          </div>
          
          <div className="flex gap-2">
             <button 
               onClick={() => setActiveTab('adoption')}
               className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'adoption' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
             >
               Tech Adoption
             </button>
             <button 
               onClick={() => setActiveTab('trends')}
               className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'trends' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
             >
               Yield Trends
             </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Avg Yield Boost', val: '+12.5%', icon: 'fa-arrow-trend-up', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Tech Adoption', val: '65%', icon: 'fa-microchip', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Market Reach', val: 'Global', icon: 'fa-globe', color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Sustainability', val: 'High', icon: 'fa-leaf', color: 'text-green-600', bg: 'bg-green-50' },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
              <div className={`w-12 h-12 rounded-full ${kpi.bg} flex items-center justify-center text-xl ${kpi.color}`}>
                <i className={`fa-solid ${kpi.icon}`}></i>
              </div>
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase">{kpi.label}</p>
                <h3 className="text-2xl font-bold text-gray-800">{kpi.val}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          
          {/* Main Chart Area */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 min-h-[400px]">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              {activeTab === 'adoption' ? (
                <><i className="fa-solid fa-chart-bar text-emerald-500"></i> {texts.tech_adoption_title}</>
              ) : (
                <><i className="fa-solid fa-chart-area text-emerald-500"></i> Yield Comparison (kg/acre)</>
              )}
            </h3>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {activeTab === 'adoption' ? (
                  <BarChart data={texts.impact_data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                    <Tooltip 
                      cursor={{fill: '#f0fdf4'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={1500}>
                      {texts.impact_data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <AreaChart data={YIELD_TRENDS} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorTrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}/>
                    <Area type="monotone" dataKey="tech" stroke="#10b981" fillOpacity={1} fill="url(#colorTech)" name="Smart Farming" />
                    <Area type="monotone" dataKey="traditional" stroke="#94a3b8" fillOpacity={1} fill="url(#colorTrad)" name="Traditional" />
                    <Legend iconType="circle" />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side: Resource Efficiency */}
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Resource Efficiency</h3>
            <p className="text-sm text-gray-500 mb-4">Cost savings distribution using tech</p>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={RESOURCE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {RESOURCE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-xl text-blue-800 text-sm">
              <i className="fa-solid fa-circle-info mr-2"></i>
              Precision irrigation (Water) sees the highest cost reduction.
            </div>
          </div>

        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          
          {/* ROI Calculator */}
          <div className="bg-gradient-to-br from-gray-900 to-emerald-900 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
               <div className="bg-emerald-500 p-2 rounded-lg text-white">
                 <i className="fa-solid fa-calculator text-xl"></i>
               </div>
               <div>
                 <h2 className="text-2xl font-bold">ROI Calculator</h2>
                 <p className="text-emerald-300 text-sm">Estimate your potential gains</p>
               </div>
            </div>

            <div className="space-y-6">
              {/* Sliders and Inputs */}
              <div>
                <label className="flex justify-between text-sm font-bold mb-2">
                  <span>Farm Size (Acres)</span>
                  <span className="text-emerald-400">{farmSize} acres</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={farmSize} 
                  onChange={(e) => setFarmSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Select Technology</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {texts.impact_data.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTechIdx(idx)}
                      className={`text-xs py-2 px-3 rounded-lg border transition-all ${
                        selectedTechIdx === idx 
                          ? 'bg-emerald-500 border-emerald-500 text-white font-bold' 
                          : 'bg-transparent border-gray-600 text-gray-400 hover:border-gray-400'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Result Box */}
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/10 mt-4 animate-fade-in">
                 <div className="grid grid-cols-2 gap-8 text-center">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Yield Boost</p>
                      <p className="text-3xl font-bold text-emerald-400">+{roiCalculation.additionalYield} kg</p>
                      <p className="text-xs text-emerald-200/70 mt-1">Based on ~{roiCalculation.avgBoostPercent}% growth</p>
                    </div>
                    <div className="border-l border-white/10">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Est. Extra Revenue</p>
                      <p className="text-3xl font-bold text-yellow-400">₹{roiCalculation.extraRevenue}</p>
                      <p className="text-xs text-yellow-200/70 mt-1">@ ₹25/kg market rate</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Impact Table */}
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 mb-6">{texts.yield_impact_title}</h3>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                    <th className="p-4 rounded-tl-lg">{texts.table_headers.tech}</th>
                    <th className="p-4">{texts.table_headers.boost}</th>
                    <th className="p-4 rounded-tr-lg">{texts.table_headers.benefit}</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  {texts.impact_data.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-emerald-50/50 transition cursor-default">
                      <td className="p-4 font-semibold flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${idx === selectedTechIdx ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                        {item.name}
                      </td>
                      <td className="p-4 text-emerald-600 font-bold bg-emerald-50/30 rounded-lg">{item.boost}</td>
                      <td className="p-4 text-gray-500 text-xs">{item.benefit_desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Live Market Section */}
        <div className="bg-white rounded-2xl p-1 shadow-md border border-gray-200">
          <div className="bg-emerald-50 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-110"></div>
            
            <div className="relative z-10">
               <h2 className="text-2xl font-bold text-emerald-900 mb-2 flex items-center gap-2">
                 <i className="fa-solid fa-building-wheat"></i> {texts.market_title}
               </h2>
               <p className="text-emerald-700 max-w-xl">
                 {texts.market_desc}
               </p>
            </div>
            
            <a 
              href="https://agmarknet.gov.in/" 
              target="_blank" 
              rel="noreferrer"
              className="relative z-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 flex items-center gap-3"
            >
              {texts.open_dashboard} <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Insights;