import { Play, Info, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import type { Content } from '../types';

interface HeroProps {
  featuredContent: Content;
}

export default function Hero({ featuredContent }: HeroProps) {
  return (
    <div className="relative h-[80vh] md:h-[95vh] w-full overflow-hidden">
      {/* Background Image/Video */}
      <div className="absolute inset-0 z-0">
        <img
          src={featuredContent.thumbnailUrl}
          alt={featuredContent.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/20 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center px-4 md:px-12 max-w-3xl gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-accent text-[10px] font-bold rounded uppercase tracking-widest">
              Original
            </span>
            <span className="text-sm font-medium text-gray-300">
              {featuredContent.releaseYear} • {featuredContent.duration} • {featuredContent.genre.join(', ')}
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none">
            {featuredContent.title}
          </h1>
          <p className="text-sm md:text-lg text-gray-300 line-clamp-3 max-w-xl">
            {featuredContent.description}
          </p>
          <div className="flex items-center gap-3 mt-4">
            <button className="flex items-center gap-2 px-6 md:px-8 py-2 md:py-3 bg-white text-black font-bold rounded hover:bg-white/90 transition-colors">
              <Play size={20} fill="currentColor" /> Play
            </button>
            <button className="flex items-center gap-2 px-6 md:px-8 py-2 md:py-3 bg-gray-500/50 text-white font-bold rounded hover:bg-gray-500/40 transition-colors backdrop-blur-md">
              <Info size={20} /> More Info
            </button>
            <button className="flex items-center justify-center w-10 md:w-12 h-10 md:h-12 bg-gray-500/50 text-white rounded-full hover:bg-gray-500/40 transition-colors backdrop-blur-md">
              <Plus size={24} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
