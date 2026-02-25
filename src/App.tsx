/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  X,
  Loader2,
  Globe,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { tripTemplates, defaultActivities, DayPlan } from './data';
import POICard from './components/POICard';

// --- UI Components ---

const Navbar = ({ language, setLanguage }: { language: 'EN' | 'ZH', setLanguage: (l: 'EN' | 'ZH') => void }) => (
  <nav className="flex items-center justify-between px-6 py-4 border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-50">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
        <Globe className="text-white w-5 h-5" />
      </div>
      <span className="font-bold text-xl tracking-tight">ChinaTrip</span>
    </div>
    
    <div className="flex items-center gap-4">
      <div className="hidden md:flex gap-6 text-sm font-medium text-zinc-500 mr-4">
        <a href="#" className="hover:text-black transition-colors">{language === 'EN' ? 'Destinations' : '目的地'}</a>
        <a href="#" className="hover:text-black transition-colors">{language === 'EN' ? 'Guides' : '指南'}</a>
      </div>
      
      {/* Language Toggle */}
      <button 
        onClick={() => setLanguage(language === 'EN' ? 'ZH' : 'EN')}
        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-full text-xs font-bold transition-all border border-zinc-200"
      >
        <Languages size={14} />
        <span>{language === 'EN' ? 'English' : '中文'}</span>
      </button>

      <button className="text-sm font-semibold bg-black text-white px-4 py-2 rounded-full hover:bg-zinc-800 transition-all">
        {language === 'EN' ? 'Sign In' : '登录'}
      </button>
    </div>
  </nav>
);

const Hero = ({ language }: { language: 'EN' | 'ZH' }) => (
  <section className="pt-20 pb-12 px-6 text-center max-w-4xl mx-auto">
    <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-6"
    >
      {language === 'EN' ? (
        <>Plan Your China Trip <br /><span className="text-zinc-400 italic font-serif">in 30 Seconds</span></>
      ) : (
        <>30秒开启 <br /><span className="text-zinc-400 italic font-serif">你的中国之旅</span></>
      )}
    </motion.h1>
    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto"
    >
      {language === 'EN' 
        ? 'Food, Culture, Hidden Gems & Local Survival Guide. Tailored itineraries for the modern explorer.'
        : '美食、文化、小众景点及生存指南。为现代旅行者量身定制。'}
    </motion.p>
  </section>
);

const DayAccordion: React.FC<{ dayPlan: DayPlan, isOpen: boolean, onToggle: () => void, language: 'EN' | 'ZH' }> = ({ dayPlan, isOpen, onToggle, language }) => (
  <div className="border border-zinc-200 rounded-2xl overflow-hidden mb-4 bg-white shadow-sm transition-all hover:shadow-md">
    <button 
      onClick={onToggle}
      className="w-full flex items-center justify-between p-5 text-left hover:bg-zinc-50 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
          {dayPlan.day}
        </div>
        <div>
          <h3 className="font-bold text-zinc-900">{language === 'EN' ? `Day ${dayPlan.day}` : `第 ${dayPlan.day} 天`}</h3>
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
            {dayPlan.activities.length} {language === 'EN' ? 'Activities Planned' : '个行程安排'}
          </p>
        </div>
      </div>
      {isOpen ? <ChevronUp className="text-zinc-400" /> : <ChevronDown className="text-zinc-400" />}
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="p-5 pt-0 border-t border-zinc-50">
            {dayPlan.activities.map((activity, idx) => (
              <POICard key={idx} activity={activity} language={language} />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// --- Main App ---

export default function App() {
  const [language, setLanguage] = useState<'EN' | 'ZH'>('EN');
  const [city, setCity] = useState('Shanghai');
  const [days, setDays] = useState(3);
  const [interests, setInterests] = useState<string[]>(['Food']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<DayPlan[] | null>(null);
  const [openDay, setOpenDay] = useState<number | null>(1);
  const [showGuideModal, setShowGuideModal] = useState(false);

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setItinerary(null);
    
    setTimeout(() => {
      const cityData = tripTemplates[city as keyof typeof tripTemplates];
      const result: DayPlan[] = [];

      for (let i = 1; i <= days; i++) {
        const interest = interests[(i - 1) % interests.length] || 'Food';
        const templates = cityData?.[interest] || [];
        const dayTemplate = templates.find(t => t.day === ((i - 1) % templates.length) + 1);
        
        if (dayTemplate) {
          result.push({ ...dayTemplate, day: i });
        } else {
          result.push({
            day: i,
            activities: defaultActivities
          });
        }
      }

      setItinerary(result);
      setIsGenerating(false);
      setOpenDay(1);
      
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans text-zinc-900 pb-20">
      <Navbar language={language} setLanguage={setLanguage} />
      
      <main className="max-w-5xl mx-auto px-6">
        <Hero language={language} />

        {/* Builder Section */}
        <section className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-xl shadow-zinc-200/50 mb-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* City Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-widest">
                <MapPin size={16} />
                {language === 'EN' ? 'Destination' : '目的地'}
              </label>
              <select 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all appearance-none font-medium"
              >
                <option value="Shanghai">{language === 'EN' ? 'Shanghai' : '上海'}</option>
                <option value="Beijing">{language === 'EN' ? 'Beijing' : '北京'}</option>
                <option value="Chengdu">{language === 'EN' ? 'Chengdu' : '成都'}</option>
              </select>
            </div>

            {/* Days Slider */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-widest">
                <Calendar size={16} />
                {language === 'EN' ? `Duration: ${days} Days` : `行程时长: ${days} 天`}
              </label>
              <div className="pt-4">
                <input 
                  type="range" 
                  min="1" 
                  max="7" 
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-black"
                />
                <div className="flex justify-between text-[10px] font-bold text-zinc-300 mt-2 px-1">
                  <span>1 {language === 'EN' ? 'DAY' : '天'}</span>
                  <span>7 {language === 'EN' ? 'DAYS' : '天'}</span>
                </div>
              </div>
            </div>

            {/* Interest Chips */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-widest">
                <Sparkles size={16} />
                {language === 'EN' ? 'Interests' : '兴趣偏好'}
              </label>
              <div className="flex flex-wrap gap-2">
                {['Food', 'Culture', 'Nature', 'Nightlife'].map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                      interests.includes(interest)
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    {language === 'EN' ? interest : (
                      interest === 'Food' ? '美食' : 
                      interest === 'Culture' ? '文化' : 
                      interest === 'Nature' ? '自然' : '夜生活'
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || interests.length === 0}
            className="w-full mt-10 bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-black/10"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" />
                {language === 'EN' ? 'Crafting Your Journey...' : '正在规划您的行程...'}
              </>
            ) : (
              language === 'EN' ? 'Generate Itinerary' : '生成行程单'
            )}
          </button>
        </section>

        {/* Results Section */}
        <div id="results" className="scroll-mt-24">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 gap-4"
              >
                <div className="w-16 h-16 border-4 border-zinc-100 border-t-black rounded-full animate-spin" />
                <p className="text-zinc-400 font-medium italic">
                  {language === 'EN' ? `Finding the best local spots in ${city}...` : `正在为您寻找 ${city} 的地道去处...`}
                </p>
              </motion.div>
            ) : itinerary ? (
              <motion.div
                key="results-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold tracking-tight">
                    {language === 'EN' ? `Your ${city} Adventure` : `您的 ${city} 之旅`}
                  </h2>
                  <div className="text-sm font-medium text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full">
                    {days} {language === 'EN' ? 'Days' : '天'} • {interests.map(i => language === 'EN' ? i : (i === 'Food' ? '美食' : i === 'Culture' ? '文化' : i === 'Nature' ? '自然' : '夜生活')).join(', ')}
                  </div>
                </div>
                
                {itinerary.map((day) => (
                  <DayAccordion 
                    key={day.day} 
                    dayPlan={day} 
                    isOpen={openDay === day.day}
                    onToggle={() => setOpenDay(openDay === day.day ? null : day.day)}
                    language={language}
                  />
                ))}

                {/* Local Guide CTA */}
                <div className="mt-16 p-10 bg-zinc-900 rounded-[2.5rem] text-center text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                  <div className="relative z-10">
                    <h3 className="text-3xl font-bold mb-4">
                      {language === 'EN' ? 'Want a more personal experience?' : '想要更地道的体验？'}
                    </h3>
                    <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
                      {language === 'EN' 
                        ? 'Our certified local guides can help you navigate the language barrier and find spots even we don\'t know about.'
                        : '我们的认证当地导游可以帮您跨越语言障碍，带您去那些连我们都不知道的宝藏去处。'}
                    </p>
                    <button 
                      onClick={() => setShowGuideModal(true)}
                      className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-zinc-200 transition-all"
                    >
                      {language === 'EN' ? 'Need a Local Guide?' : '需要当地导游？'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </main>

      {/* Guide Modal */}
      <AnimatePresence>
        {showGuideModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGuideModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2rem] p-8 relative z-10 shadow-2xl"
            >
              <button 
                onClick={() => setShowGuideModal(false)}
                className="absolute top-6 right-6 text-zinc-400 hover:text-black transition-colors"
              >
                <X size={24} />
              </button>
              
              <h3 className="text-2xl font-bold mb-2">{language === 'EN' ? 'Find Your Guide' : '寻找您的导游'}</h3>
              <p className="text-zinc-500 text-sm mb-8">
                {language === 'EN' 
                  ? 'Tell us a bit more about your trip and we\'ll match you with the perfect local companion.'
                  : '告诉我们更多关于您的行程，我们将为您匹配最合适的当地向导。'}
              </p>
              
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowGuideModal(false); alert(language === 'EN' ? 'Inquiry sent! We will contact you soon.' : '申请已发送！我们将尽快与您联系。'); }}>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">{language === 'EN' ? 'Full Name' : '全名'}</label>
                  <input type="text" required className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-black outline-none" placeholder={language === 'EN' ? 'John Doe' : '张三'} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">{language === 'EN' ? 'Email Address' : '邮箱地址'}</label>
                  <input type="email" required className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-black outline-none" placeholder="john@example.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">{language === 'EN' ? 'City' : '城市'}</label>
                    <input type="text" defaultValue={city} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-black outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">{language === 'EN' ? 'Dates' : '日期'}</label>
                    <input type="text" placeholder="MM/DD - MM/DD" className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-black outline-none" />
                  </div>
                </div>
                <button className="w-full bg-black text-white py-4 rounded-xl font-bold mt-4 hover:bg-zinc-800 transition-all">
                  {language === 'EN' ? 'Send Inquiry' : '发送申请'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-20 border-t border-zinc-100 pt-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Globe className="text-zinc-300 w-5 h-5" />
          <span className="font-bold text-zinc-400">ChinaTrip Planner</span>
        </div>
        <p className="text-zinc-400 text-sm">
          &copy; {new Date().getFullYear()} ChinaTrip. All rights reserved. <br />
          Built with ❤️ for explorers.
        </p>
      </footer>
    </div>
  );
}
