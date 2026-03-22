import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import { useAuth } from '../context/AuthContext';
import { ContentService } from '../services/ContentService';
import type { Content } from '../types';

export default function MyList() {
  const { profile, loading: authLoading } = useAuth();
  const [listContents, setListContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyList = async () => {
      if (!profile?.myList || profile.myList.length === 0) {
        setListContents([]);
        setLoading(false);
        return;
      }

      try {
        const allContent = await ContentService.getAllContent();
        const filtered = allContent.filter(c => profile.myList.includes(c.id));
        setListContents(filtered);
      } catch (error) {
        console.error('Error fetching my list:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchMyList();
    }
  }, [profile, authLoading]);

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      
      <main className="pt-24 px-4 md:px-12 pb-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">My List</h1>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-video bg-white/5 rounded-md animate-pulse" />
            ))}
          </div>
        ) : listContents.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {listContents.map((content) => (
              <MovieCard key={content.id} content={content} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-gray-400 text-lg">You haven't added anything to your list yet.</p>
            <button className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-white/90 transition-colors">
              Browse Content
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
