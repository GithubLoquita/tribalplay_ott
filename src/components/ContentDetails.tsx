import { X, Play, Plus, ThumbsUp, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Content } from '../types';
import { useNavigate } from 'react-router-dom';

interface ContentDetailsProps {
  content: Content | null;
  onClose: () => void;
}

export default function ContentDetails({ content, onClose }: ContentDetailsProps) {
  const navigate = useNavigate();

  if (!content) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-primary rounded-2xl overflow-hidden shadow-2xl"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="relative aspect-video w-full">
            <img 
              src={content.thumbnailUrl} 
              alt={content.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 flex flex-col gap-4 max-w-lg">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">{content.title}</h2>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate(`/watch/${content.id}`)}
                  className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded hover:bg-white/90 transition-colors"
                >
                  <Play size={20} fill="currentColor" /> Play
                </button>
                <button className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Plus size={24} />
                </button>
                <button className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <ThumbsUp size={24} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm font-medium">
                <span className="text-green-500 font-bold">{content.rating * 10}% Match</span>
                <span className="text-gray-400">{content.releaseYear}</span>
                <span className="border border-white/30 px-1.5 rounded text-[10px] uppercase">HD</span>
                <span className="text-gray-400">{content.duration}</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {content.description}
              </p>
            </div>

            <div className="flex flex-col gap-4 text-sm">
              <div>
                <span className="text-gray-500">Genres: </span>
                <span className="text-gray-300">{content.genre.join(', ')}</span>
              </div>
              <div>
                <span className="text-gray-500">Category: </span>
                <span className="text-gray-300">{content.category}</span>
              </div>
              <div>
                <span className="text-gray-500">Available in: </span>
                <span className="text-gray-300">Santali, English, Bengali</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
