import React, { useState } from 'react';
import { 
  Clock, 
  DollarSign, 
  ThumbsUp, 
  Copy, 
  Map as MapIcon, 
  ExternalLink, 
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity } from '../data';
import { copyToClipboard } from '../utils/clipboard';
import { getGoogleMapsUrl, getAppleMapsUrl, getAmapUrl, getBaiduMapsUrl } from '../utils/maps';

interface POICardProps {
  activity: Activity;
  language: 'EN' | 'ZH';
}

const POICard: React.FC<POICardProps> = ({ activity, language }) => {
  const [copiedName, setCopiedName] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [showMaps, setShowMaps] = useState(false);
  const [showChineseDetails, setShowChineseDetails] = useState(false);

  const handleCopyName = async () => {
    const success = await copyToClipboard(activity.name_zh);
    if (success) {
      setCopiedName(true);
      setTimeout(() => setCopiedName(false), 2000);
    }
  };

  const handleCopyAddr = async () => {
    const success = await copyToClipboard(activity.address_zh);
    if (success) {
      setCopiedAddr(true);
      setTimeout(() => setCopiedAddr(false), 2000);
    }
  };

  const isEN = language === 'EN';

  return (
    <div className="p-5 border-l-2 border-zinc-100 ml-4 mb-8 last:mb-0 bg-white rounded-r-2xl shadow-sm hover:shadow-md transition-shadow">
      {/* Time Header */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-3">
        <Clock size={14} />
        <span>{activity.time}</span>
      </div>

      {/* Name Section */}
      <div className="mb-4">
        {isEN ? (
          <>
            <h4 className="text-xl font-bold text-zinc-900 leading-tight mb-1">
              {activity.name_en}
            </h4>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-zinc-800">{activity.name_zh}</span>
              {activity.pinyin && (
                <span className="text-xs text-zinc-400 font-medium italic">{activity.pinyin}</span>
              )}
            </div>
          </>
        ) : (
          <>
            <h4 className="text-xl font-bold text-zinc-900 leading-tight mb-1">
              {activity.name_zh}
            </h4>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-medium text-zinc-500">{activity.name_en}</span>
              {activity.pinyin && (
                <span className="text-xs text-zinc-400 font-medium italic">{activity.pinyin}</span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Address & Details Section */}
      <div className="space-y-2 mb-5">
        <div className="flex items-start gap-2 text-sm text-zinc-600">
          <div className="flex-1">
            <p className="font-medium">
              {activity.address_zh}
              {activity.district_zh && <span className="text-zinc-400 ml-2">({activity.district_zh})</span>}
            </p>
            {activity.metro_hint && (
              <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                {activity.metro_hint}
              </p>
            )}
          </div>
        </div>
        
        <p className="text-sm text-zinc-700 leading-relaxed italic border-l-2 border-zinc-50 pl-3">
          {activity.description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          onClick={handleCopyName}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 rounded-lg text-xs font-semibold transition-colors border border-zinc-200"
        >
          {copiedName ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          {isEN ? 'Copy Chinese Name' : '复制名称'}
        </button>
        <button 
          onClick={handleCopyAddr}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 rounded-lg text-xs font-semibold transition-colors border border-zinc-200"
        >
          {copiedAddr ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          {isEN ? 'Copy Address' : '复制地址'}
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowMaps(!showMaps)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              showMaps ? 'bg-black text-white border-black' : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border-zinc-200'
            }`}
          >
            <MapIcon size={14} />
            {isEN ? 'Open in Maps' : '在地图中打开'}
            {showMaps ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <AnimatePresence>
            {showMaps && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute left-0 bottom-full mb-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-xl z-20 overflow-hidden"
              >
                <div className="p-2 space-y-1">
                  <a 
                    href={getGoogleMapsUrl(activity.map_query)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 hover:bg-zinc-50 rounded-lg text-xs font-medium text-zinc-700"
                  >
                    Google Maps <ExternalLink size={12} />
                  </a>
                  <a 
                    href={getAppleMapsUrl(activity.map_query)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 hover:bg-zinc-50 rounded-lg text-xs font-medium text-zinc-700"
                  >
                    Apple Maps <ExternalLink size={12} />
                  </a>
                  <a 
                    href={getAmapUrl(activity.map_query, activity.city_zh)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 hover:bg-zinc-50 rounded-lg text-xs font-medium text-zinc-700"
                  >
                    高德地图 (Amap) <ExternalLink size={12} />
                  </a>
                  <a 
                    href={getBaiduMapsUrl(activity.map_query, activity.city_zh)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 hover:bg-zinc-50 rounded-lg text-xs font-medium text-zinc-700"
                  >
                    百度地图 (Baidu) <ExternalLink size={12} />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Badges */}
      <div className="flex flex-wrap gap-3 pt-3 border-t border-zinc-50">
        <div className="flex items-center gap-1 text-[10px] bg-zinc-50 px-2 py-1 rounded border border-zinc-100 text-zinc-500 uppercase tracking-wider font-bold">
          <DollarSign size={10} />
          <span>{activity.priceRange}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] bg-emerald-50 px-2 py-1 rounded border border-emerald-100 text-emerald-700 uppercase tracking-wider font-bold">
          <ThumbsUp size={10} />
          <span>{activity.recommendation}</span>
        </div>
      </div>
    </div>
  );
};

export default POICard;
