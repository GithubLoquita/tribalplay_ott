import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import type { Content } from '../types';

interface MovieCardProps {
  content: Content;
  onSelect?: (content: Content) => void;
}

export default function MovieCard({ content, onSelect }: MovieCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={() => onSelect?.(content)}
      className="relative group min-w-[200px] md:min-w-[280px] h-[120px] md:h-[160px] rounded-md overflow-hidden cursor-pointer bg-gray-900 transition-all duration-300"
    >
      <img
        src={content.thumbnailUrl}
        alt={content.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/90 transition-colors">
              <Play size={16} fill="currentColor" />
            </button>
            <button className="w-8 h-8 rounded-full border border-white/50 text-white flex items-center justify-center hover:border-white transition-colors">
              <Plus size={16} />
            </button>
            <button className="w-8 h-8 rounded-full border border-white/50 text-white flex items-center justify-center hover:border-white transition-colors">
              <ThumbsUp size={16} />
            </button>
          </div>
          <button className="w-8 h-8 rounded-full border border-white/50 text-white flex items-center justify-center hover:border-white transition-colors">
            <ChevronDown size={16} />
          </button>
        </div>
        
        <div className="flex flex-col gap-1">
          <h3 className="text-xs md:text-sm font-bold truncate">{content.title}</h3>
          <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-300">
            <span className="text-green-500 font-bold">{content.rating * 10}% Match</span>
            <span>{content.duration}</span>
            <span className="border border-white/50 px-1 rounded text-[8px] uppercase">HD</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {content.genre.slice(0, 2).map((g) => (
              <span key={g} className="text-[8px] md:text-[10px] text-gray-400">• {g}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
