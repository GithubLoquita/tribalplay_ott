import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import ContentDetails from '../components/ContentDetails';
import { ContentService } from '../services/ContentService';
import type { Content } from '../types';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const allContent = await ContentService.getAllContent();
        const filtered = allContent.filter(c => 
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase()) ||
          c.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
        );
        setResults(filtered);
      } catch (error) {
        console.error('Error searching content:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      
      <main className="pt-24 px-4 md:px-12 pb-20">
        <div className="flex flex-col gap-8">
          <div className="relative max-w-2xl mx-auto w-full">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={24} />
            <input 
              type="text" 
              placeholder="Search movies, series, or genres..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-lg focus:outline-none focus:border-accent transition-colors"
              value={query}
              onChange={(e) => setSearchParams({ q: e.target.value })}
              autoFocus
            />
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-6">
              {query ? `Results for "${query}"` : 'Explore Content'}
            </h2>
            
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="aspect-video bg-white/5 rounded-md animate-pulse" />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {results.map((content) => (
                  <MovieCard key={content.id} content={content} onSelect={setSelectedContent} />
                ))}
              </div>
            ) : query ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <p className="text-gray-400 text-lg">No results found for "{query}".</p>
                <p className="text-gray-500 text-sm">Try searching for something else or browse categories.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {/* Popular categories or trending content could go here */}
                <p className="text-gray-500 italic">Start typing to search...</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <ContentDetails 
        content={selectedContent} 
        onClose={() => setSelectedContent(null)} 
      />
    </div>
  );
}
