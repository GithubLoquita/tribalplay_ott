import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, User, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { logout } from '../firebase';
import { useAuth } from '../context/AuthContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/search?q=Movies' },
    { name: 'Web Series', path: '/search?q=Series' },
    { name: 'My List', path: '/mylist' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 z-50 w-full transition-colors duration-300 px-4 md:px-12 py-4 flex items-center justify-between',
        isScrolled ? 'bg-primary' : 'bg-transparent'
      )}
    >
      <div className="flex items-center gap-8">
        <Link to="/" className="text-accent text-2xl font-bold tracking-tighter">
          TRIBALPLAY
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button 
          onClick={() => navigate('/search')}
          className="text-gray-300 hover:text-white"
        >
          <Search size={20} />
        </button>
        <button className="text-gray-300 hover:text-white hidden sm:block">
          <Bell size={20} />
        </button>
        <div className="relative group">
          <button className="flex items-center gap-2 text-gray-300 hover:text-white">
            <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center overflow-hidden">
              {profile?.photoURL ? (
                <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={18} />
              )}
            </div>
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-primary border border-white/10 rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div className="py-2">
              <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10">Profile</Link>
              {profile?.role === 'admin' && (
                <Link to="/admin" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10">Admin Panel</Link>
              )}
              <hr className="border-white/10 my-1" />
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 flex items-center gap-2"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>
        </div>
        <button
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-primary border-t border-white/10 md:hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-lg font-medium text-gray-300 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
