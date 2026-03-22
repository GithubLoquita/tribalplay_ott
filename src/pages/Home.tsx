import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ContentRow from '../components/ContentRow';
import ContentDetails from '../components/ContentDetails';
import Loading from '../components/Loading';
import { ContentService } from '../services/ContentService';
import { RecommendationService } from '../services/RecommendationService';
import { useAuth } from '../context/AuthContext';
import type { Content } from '../types';

export default function Home() {
  const [contents, setContents] = useState<Content[]>([]);
  const [recommendations, setRecommendations] = useState<Content[]>([]);
  const [featured, setFeatured] = useState<Content | null>(null);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allContent = await ContentService.getAllContent();
        setContents(allContent);
        
        if (allContent.length > 0) {
          setFeatured(allContent[0]);
        }

        if (user) {
          const recs = await RecommendationService.getRecommendations(user.uid);
          setRecommendations(recs);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading || !featured) return <Loading />;

  return (
    <div className="relative min-h-screen bg-primary overflow-x-hidden">
      <Navbar />
      <Hero featuredContent={featured} />
      
      <div className="relative z-30 -mt-32 md:-mt-48 pb-20">
        {recommendations.length > 0 && (
          <ContentRow 
            title="Recommended for You" 
            contents={recommendations} 
            onSelect={setSelectedContent}
          />
        )}
        
        <ContentRow 
          title="Trending Now" 
          contents={contents} 
          onSelect={setSelectedContent}
        />
        
        <ContentRow 
          title="TribalPlay Originals" 
          contents={contents.filter(c => c.category === 'Originals')} 
          onSelect={setSelectedContent}
        />
        
        <ContentRow 
          title="Movies" 
          contents={contents.filter(c => c.category === 'Movies')} 
          onSelect={setSelectedContent}
        />
        
        <ContentRow 
          title="Web Series" 
          contents={contents.filter(c => c.category === 'Web Series')} 
          onSelect={setSelectedContent}
        />
        
        <ContentRow 
          title="Music & Culture" 
          contents={contents.filter(c => c.category === 'Music')} 
          onSelect={setSelectedContent}
        />
      </div>

      <ContentDetails 
        content={selectedContent} 
        onClose={() => setSelectedContent(null)} 
      />

      <footer className="px-4 md:px-12 py-12 border-t border-white/10 bg-primary flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-accent text-xl font-bold tracking-tighter">TRIBALPLAY</h2>
          <p className="text-gray-400 text-sm">© 2026 TribalPlay. All rights reserved.</p>
        </div>
        <div className="flex gap-8 text-gray-400 text-sm">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Help Center</a>
          <a href="#" className="hover:text-white transition-colors">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}
