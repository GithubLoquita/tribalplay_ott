import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipForward, SkipBack } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ContentService } from '../services/ContentService';
import { HistoryService } from '../services/HistoryService';
import { useAuth } from '../context/AuthContext';
import type { Content } from '../types';
import Loading from '../components/Loading';

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [content, setContent] = useState<Content | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedProgressRef = useRef<number>(0);

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) return;
      try {
        const data = await ContentService.getContentById(id);
        if (data) {
          setContent(data);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [id, navigate]);

  // Save progress periodically
  useEffect(() => {
    if (!user || !id || !played) return;

    // Save every 10 seconds or if progress jumped significantly
    if (Math.abs(played - lastSavedProgressRef.current) > 10) {
      HistoryService.saveProgress(user.uid, id, played);
      lastSavedProgressRef.current = played;
    }
  }, [played, user, id]);

  // Save progress on unmount
  useEffect(() => {
    return () => {
      if (user && id && lastSavedProgressRef.current !== played) {
        HistoryService.saveProgress(user.uid, id, played);
      }
    };
  }, [user, id, played]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = Math.floor(date.getUTCSeconds()).toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setPlayed(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * duration;
    }
  };

  if (loading || !content) return <Loading />;

  return (
    <div 
      className="relative h-screen w-full bg-black overflow-hidden group"
      onMouseMove={handleMouseMove}
      onClick={handleMouseMove}
    >
      <video
        ref={videoRef}
        src={content.videoUrl}
        className="w-full h-full"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={() => setIsPlaying(!isPlaying)}
        autoPlay
      />

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col justify-between bg-gradient-to-t from-black/80 via-transparent to-black/60 p-6 md:p-12"
          >
            {/* Top Bar */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <ArrowLeft size={32} />
              </button>
              <h1 className="text-xl md:text-2xl font-bold">{content.title}</h1>
            </div>

            {/* Middle Controls */}
            <div className="flex items-center justify-center gap-12 md:gap-24">
              <button className="p-4 rounded-full hover:bg-white/10 transition-colors">
                <SkipBack size={40} fill="currentColor" />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-6 rounded-full bg-white text-black hover:bg-white/90 transition-colors"
              >
                {isPlaying ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" />}
              </button>
              <button className="p-4 rounded-full hover:bg-white/10 transition-colors">
                <SkipForward size={40} fill="currentColor" />
              </button>
            </div>

            {/* Bottom Bar */}
            <div className="flex flex-col gap-4">
              {/* Progress Bar */}
              <div 
                className="relative w-full h-1.5 bg-white/20 rounded-full cursor-pointer group/progress"
                onClick={handleProgressClick}
              >
                <div 
                  className="absolute top-0 left-0 h-full bg-accent rounded-full"
                  style={{ width: `${(played / duration) * 100}%` }}
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-accent rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"
                  style={{ left: `${(played / duration) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setIsMuted(!isMuted)}>
                      {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1" 
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-24 accent-accent"
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {formatTime(played)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <button className="hover:text-accent transition-colors">
                    <Settings size={24} />
                  </button>
                  <button className="hover:text-accent transition-colors">
                    <Maximize size={24} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
