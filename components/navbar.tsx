'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Zap,
  ChevronDown,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Film,
} from '@/components/ui/icons'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  user: {
    email: string
    full_name?: string
    credits: number
  } | null
  onSignOut: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ user, onSignOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/storico', label: 'Storico', icon: Film },
  ]

  return (
    <nav className="h-16 border-b border-gray-800 bg-[#0b0c14]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-600/30">
            P
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
            Plasmo AI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'text-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Credits Badge */}
          {user && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 rounded-lg border border-gray-800">
              <Zap className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-xs font-bold text-gray-300">{user.credits}</span>
              <span className="text-[10px] text-gray-500">crediti</span>
            </div>
          )}

          {/* Profile Dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 bg-gray-900 rounded-full border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                  {user.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                </div>
                <span className="text-[11px] font-medium text-gray-300 hidden sm:inline">
                  {user.full_name || user.email.split('@')[0]}
                </span>
                <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-[#161821] border border-gray-800 rounded-xl shadow-xl z-50 py-1">
                    <div className="px-4 py-2 border-b border-gray-800">
                      <p className="text-xs font-medium text-gray-300 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/storico"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Film className="w-4 h-4" />
                      Storico
                    </Link>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false)
                        onSignOut()
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Esci
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#0b0c14] border-b border-gray-800 z-40">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === link.href
                    ? 'bg-blue-600/10 text-blue-400'
                    : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
            {user && (
              <div className="pt-2 border-t border-gray-800">
                <div className="flex items-center gap-3 px-4 py-3 text-gray-400">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span>{user.credits} crediti</span>
                </div>
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    onSignOut()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Esci
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
