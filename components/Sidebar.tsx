'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Video, 
  Zap, 
  Film,
  Play,
  Settings,
  Image as ImageIcon,
  Clock,
  LucideProps
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r border-slate-800/60 bg-[#111218]/50 backdrop-blur-xl p-6 hidden lg:block z-50">
      <Link href="/" className="flex items-center gap-2 mb-10 group">
        <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
          <Play className="size-5 text-white fill-white" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          PlasmoAI
        </span>
      </Link>

      <nav className="space-y-2">
        <NavItem href="/" icon={<BarChart3 />} label="Dashboard" active={isActive('/')} />
        <NavItem href="/projects" icon={<Video />} label="My Projects" active={isActive('/projects')} />
        <NavItem href="/templates" icon={<Film />} label="Templates" active={isActive('/templates')} />
        <NavItem href="/create" icon={<Zap />} label="Generation" active={isActive('/create')} />
        <NavItem href="/gallery" icon={<ImageIcon />} label="Gallery" active={isActive('/gallery')} />
        <NavItem href="/storico" icon={<Clock />} label="History" active={isActive('/storico')} />
        <NavItem href="/settings" icon={<Settings />} label="Settings" active={isActive('/settings')} />
      </nav>

      <div className="absolute bottom-8 left-6 right-6">
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600/10 to-blue-900/10 border border-blue-500/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-blue-400">Pro Plan</span>
            <span className="text-xs text-slate-400">85/100 credits</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-[85%] bg-blue-500 rounded-full" />
          </div>
          <button className="mt-3 w-full py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors">
            Upgrade Plan
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active = false, href }: { icon: React.ReactNode, label: string, active?: boolean, href: string }) {
  return (
    <Link 
      href={href}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? 'bg-blue-600/10 text-blue-400' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
      }`}
    >
      {React.cloneElement(icon as React.ReactElement<LucideProps>, { size: 18 })}
      {label}
    </Link>
  );
}
