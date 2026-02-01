'use client';

import React from 'react';
import { 
  Bell, 
  Shield, 
  Moon, 
  ChevronRight,
  LogOut,
  Zap
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-6 lg:p-10">
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Settings & Profile</h1>

        {/* Profile Section */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Profile</h2>
          <div className="bg-[#161821] rounded-xl border border-slate-800/60 p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="size-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-blue-900/20">
              JS
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-white">John Smith</h3>
              <p className="text-slate-400">john.smith@example.com</p>
            </div>
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700">
              Edit Profile
            </button>
          </div>
        </section>

        {/* Billing Section */}
        <section className="mb-8">
           <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Subscription & Usage</h2>
           <div className="bg-[#161821] rounded-xl border border-slate-800/60 p-6">
             <div className="flex justify-between items-start mb-6">
               <div>
                 <p className="text-sm text-slate-400 mb-1">Current Plan</p>
                 <div className="flex items-center gap-2">
                   <h3 className="text-2xl font-bold text-white">Pro Creator</h3>
                   <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 uppercase">Active</span>
                 </div>
               </div>
               <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-900/20">
                 <Zap size={16} />
                 Upgrade Plan
               </button>
             </div>

             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-300">Credit Balance</span>
                 <span className="text-white font-medium">750 / 1000</span>
               </div>
               <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
               </div>
               <p className="text-xs text-slate-500">Resets on Mar 1, 2026</p>
             </div>
           </div>
        </section>

        {/* App Settings */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Application</h2>
          <div className="bg-[#161821] rounded-xl border border-slate-800/60 divide-y divide-slate-800/60">
            
            <SettingItem 
              icon={<Bell className="text-blue-400" />} 
              title="Notifications" 
              desc="Receive email updates when videos are ready"
              action={<Toggle active />}
            />

             <SettingItem 
              icon={<Shield className="text-emerald-400" />} 
              title="API Keys" 
              desc="Manage access tokens for development"
              action={<ChevronRight className="text-slate-500" />}
            />

             <SettingItem 
              icon={<Moon className="text-purple-400" />} 
              title="Appearance" 
              desc="Dark mode is enabled by default"
              action={<span className="text-xs text-slate-500">Locked</span>}
            />

          </div>
        </section>

        <button className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium">
          <LogOut size={16} />
          Sign Out
        </button>

      </div>
    </div>
  );
}

function SettingItem({ icon, title, desc, action }: any) {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-lg bg-slate-800/50 group-hover:bg-slate-800 transition-colors">
          {React.cloneElement(icon, { size: 18 })}
        </div>
        <div>
          <h4 className="text-sm font-medium text-white">{title}</h4>
          <p className="text-xs text-slate-500">{desc}</p>
        </div>
      </div>
      <div>{action}</div>
    </div>
  );
}

function Toggle({ active }: { active?: boolean }) {
  return (
    <div className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-blue-600' : 'bg-slate-700'}`}>
      <div className={`absolute top-1 left-1 size-3 bg-white rounded-full transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  );
}
