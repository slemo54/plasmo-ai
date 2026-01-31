'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useNotifications } from '@/lib/hooks'
import { NotificationType } from '@/types'
import { Bell, X, Check, Loader2, Video, AlertCircle, Trophy, Info } from '@/components/ui/icons'

const NOTIFICATION_ICONS: Record<NotificationType, typeof Video> = {
  [NotificationType.VIDEO_COMPLETE]: Video,
  [NotificationType.VIDEO_FAILED]: AlertCircle,
  [NotificationType.CREDITS_LOW]: Info,
  [NotificationType.ACHIEVEMENT]: Trophy,
  [NotificationType.WELCOME]: Info,
}

const NOTIFICATION_COLORS: Record<NotificationType, string> = {
  [NotificationType.VIDEO_COMPLETE]: 'text-green-400 bg-green-600/10',
  [NotificationType.VIDEO_FAILED]: 'text-red-400 bg-red-600/10',
  [NotificationType.CREDITS_LOW]: 'text-yellow-400 bg-yellow-600/10',
  [NotificationType.ACHIEVEMENT]: 'text-purple-400 bg-purple-600/10',
  [NotificationType.WELCOME]: 'text-blue-400 bg-blue-600/10',
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, deleteNotification } = useNotifications()
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'Adesso'
    if (minutes < 60) return `${minutes}m fa`
    if (hours < 24) return `${hours}h fa`
    if (days < 7) return `${days}g fa`
    return date.toLocaleDateString('it-IT')
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 bg-black/20 z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="fixed sm:absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 bg-[#111218] border border-gray-800 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-800">
              <h3 className="text-sm font-semibold text-white">Notifiche</h3>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
                    title="Segna tutte come lette"
                  >
                    <Check className="w-4 h-4 text-gray-400" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">Nessuna notifica</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {notifications.map((notification) => {
                    const Icon = NOTIFICATION_ICONS[notification.type]
                    const colorClass = NOTIFICATION_COLORS[notification.type]
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-3 hover:bg-gray-800/50 transition-colors group ${
                          !notification.is_read ? 'bg-blue-600/5' : ''
                        }`}
                        onClick={() => {
                          if (!notification.is_read) {
                            markAsRead(notification.id)
                          }
                        }}
                      >
                        <div className="flex gap-3">
                          <div className={`p-2 rounded-lg flex-shrink-0 ${colorClass}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium ${
                              !notification.is_read ? 'text-white' : 'text-gray-300'
                            }`}>
                              {notification.title}
                            </p>
                            {notification.message && (
                              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">
                                {notification.message}
                              </p>
                            )}
                            <div className="flex items-center justify-between mt-1.5">
                              <span className="text-[10px] text-gray-600">
                                {formatTime(notification.created_at)}
                              </span>
                              
                              {/* Actions */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 rounded transition-all"
                              >
                                <X className="w-3 h-3 text-gray-500 hover:text-red-400" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Unread indicator */}
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
