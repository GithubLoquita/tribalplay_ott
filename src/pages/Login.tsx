import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { signInWithGoogle } from '../firebase';
import { UserService } from '../services/UserService';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      
      // Check if profile exists, if not create it
      const existingProfile = await UserService.getProfile(user.uid);
      if (!existingProfile) {
        await UserService.createProfile({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'User',
          role: 'user',
          myList: [],
          subscriptionStatus: 'free',
          photoURL: user.photoURL || undefined
        });
      }
      
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Google Sign-In failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Email/Password logic could be added here if needed
    // For now, we'll just navigate as a placeholder
    navigate('/');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-primary overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://picsum.photos/seed/tribal-bg/1920/1080?blur=10"
          alt="Background"
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/40" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md p-8 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
      >
        <div className="flex flex-col items-center gap-2 mb-8">
          <h1 className="text-accent text-4xl font-black tracking-tighter">TRIBALPLAY</h1>
          <p className="text-gray-400 text-sm font-medium">
            {isLogin ? 'Welcome back! Please sign in.' : 'Create an account to start streaming.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent transition-colors"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-accent text-white font-bold py-3 rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 flex flex-col gap-4">
          <div className="relative flex items-center justify-center">
            <hr className="w-full border-white/10" />
            <span className="absolute bg-transparent px-4 text-xs text-gray-500 uppercase tracking-widest">Or continue with</span>
          </div>
          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" /> 
            {loading ? 'Please wait...' : 'Google'}
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-white font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
