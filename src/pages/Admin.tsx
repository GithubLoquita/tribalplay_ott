import { useState, useEffect } from 'react';
import { Plus, Upload, Trash2, Edit2, Search, Filter, ChevronRight, LayoutDashboard, Film, Users, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { ContentService } from '../services/ContentService';
import type { Content } from '../types';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'content' | 'users' | 'settings'>('dashboard');
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const data = await ContentService.getAllContent();
        setContents(data);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'content') {
      fetchContent();
    }
  }, [activeTab]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await ContentService.deleteContent(id);
        setContents(prev => prev.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-primary text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-black/40 border-r border-white/10 flex flex-col p-6 gap-8">
        <div className="flex items-center gap-2">
          <h1 className="text-accent text-2xl font-black tracking-tighter">TRIBALPLAY</h1>
          <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded uppercase font-bold tracking-widest">Admin</span>
        </div>

        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-accent text-white' : 'text-gray-400 hover:bg-white/5'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'content' ? 'bg-accent text-white' : 'text-gray-400 hover:bg-white/5'}`}
          >
            <Film size={20} /> Content Management
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-accent text-white' : 'text-gray-400 hover:bg-white/5'}`}
          >
            <Users size={20} /> User Management
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-accent text-white' : 'text-gray-400 hover:bg-white/5'}`}
          >
            <Settings size={20} /> Platform Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="px-8 py-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-primary/80 backdrop-blur-md z-10">
          <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <button className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <Users size={20} />
            </button>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: '12,450', change: '+12%', color: 'text-blue-500' },
                { label: 'Active Subscriptions', value: '3,210', change: '+5%', color: 'text-green-500' },
                { label: 'Total Content', value: '450', change: '+24', color: 'text-purple-500' },
                { label: 'Monthly Revenue', value: '₹4,50,000', change: '+18%', color: 'text-accent' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-2">
                  <span className="text-sm text-gray-400 font-medium">{stat.label}</span>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold">{stat.value}</span>
                    <span className={`text-xs font-bold ${stat.color}`}>{stat.change}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'content' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                    <Filter size={18} /> Filter
                  </button>
                  <span className="text-sm text-gray-400">{contents.length} items found</span>
                </div>
                <button 
                  onClick={() => setIsAddingContent(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-colors"
                >
                  <Plus size={20} /> Add Content
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-xs text-gray-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Content</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Release Year</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {contents.map((content) => (
                      <tr key={content.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img src={content.thumbnailUrl} alt={content.title} className="w-16 h-10 object-cover rounded" />
                            <div className="flex flex-col">
                              <span className="font-bold">{content.title}</span>
                              <span className="text-xs text-gray-500">{content.genre.join(', ')}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">{content.category}</td>
                        <td className="px-6 py-4 text-sm">{content.releaseYear}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${content.isPremium ? 'bg-accent/20 text-accent' : 'bg-green-500/20 text-green-500'}`}>
                            {content.isPremium ? 'Premium' : 'Free'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button className="p-2 hover:text-blue-500 transition-colors"><Edit2 size={18} /></button>
                            <button 
                              onClick={() => handleDelete(content.id)}
                              className="p-2 hover:text-accent transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Content Modal */}
      {isAddingContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary border border-white/10 rounded-2xl w-full max-w-2xl p-8 flex flex-col gap-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Add New Content</h3>
              <button onClick={() => setIsAddingContent(false)} className="text-gray-400 hover:text-white">Close</button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-400 uppercase font-bold tracking-widest">Title</label>
                <input type="text" className="bg-white/5 border border-white/10 rounded-lg py-2 px-4 focus:outline-none focus:border-accent" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-400 uppercase font-bold tracking-widest">Category</label>
                <select className="bg-white/5 border border-white/10 rounded-lg py-2 px-4 focus:outline-none focus:border-accent">
                  <option>Originals</option>
                  <option>Movies</option>
                  <option>Web Series</option>
                  <option>Music</option>
                </select>
              </div>
              <div className="col-span-2 flex flex-col gap-2">
                <label className="text-xs text-gray-400 uppercase font-bold tracking-widest">Description</label>
                <textarea className="bg-white/5 border border-white/10 rounded-lg py-2 px-4 h-24 focus:outline-none focus:border-accent" />
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-xs text-gray-400 uppercase font-bold tracking-widest">Thumbnail</label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:border-accent transition-colors cursor-pointer">
                  <Upload size={32} className="text-gray-500" />
                  <span className="text-xs text-gray-400">Upload Image</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-xs text-gray-400 uppercase font-bold tracking-widest">Video File</label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:border-accent transition-colors cursor-pointer">
                  <Film size={32} className="text-gray-500" />
                  <span className="text-xs text-gray-400">Upload Video</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 mt-4">
              <button onClick={() => setIsAddingContent(false)} className="px-6 py-2 text-gray-400 font-bold hover:text-white transition-colors">Cancel</button>
              <button className="px-8 py-2 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-colors">Save Content</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
