import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, CreditCard, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Profile() {
  const { user, profile, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      
      <main className="pt-24 px-4 md:px-12 pb-20 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Account Settings</h1>
        
        <div className="flex flex-col gap-6">
          {/* Profile Header */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center text-4xl font-bold">
              {profile?.displayName?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div className="flex flex-col items-center md:items-start gap-2">
              <h2 className="text-2xl font-bold">{profile?.displayName || 'User'}</h2>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail size={16} />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${isAdmin ? 'bg-accent/20 text-accent' : 'bg-blue-500/20 text-blue-500'}`}>
                  {isAdmin ? 'Administrator' : 'Standard User'}
                </span>
                <span className="px-2 py-1 rounded bg-green-500/20 text-green-500 text-[10px] font-bold uppercase">
                  {profile?.subscriptionStatus || 'Free'} Plan
                </span>
              </div>
            </div>
            <button className="md:ml-auto px-6 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors font-bold">
              Edit Profile
            </button>
          </div>

          {/* Settings Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-accent mb-2">
                <Shield size={20} />
                <h3 className="font-bold uppercase tracking-widest text-sm">Security</h3>
              </div>
              <button className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
                <span className="text-sm">Change Password</span>
                <ChevronRight size={18} className="text-gray-500 group-hover:text-white transition-colors" />
              </button>
              <button className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
                <span className="text-sm">Two-Factor Authentication</span>
                <ChevronRight size={18} className="text-gray-500 group-hover:text-white transition-colors" />
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-accent mb-2">
                <CreditCard size={20} />
                <h3 className="font-bold uppercase tracking-widest text-sm">Subscription</h3>
              </div>
              <div className="p-4 bg-white/5 rounded-xl flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Current Plan: {profile?.subscriptionStatus || 'Free'}</span>
                  <span className="text-xs text-gray-400">Next billing: Apr 22, 2026</span>
                </div>
                <button className="mt-2 w-full py-2 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-colors text-sm">
                  Upgrade to Premium
                </button>
              </div>
              <button className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
                <span className="text-sm">Billing History</span>
                <ChevronRight size={18} className="text-gray-500 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
