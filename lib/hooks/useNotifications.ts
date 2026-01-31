'use client'

import { useState, useEffect, useCallback } from 'react'
import { Notification } from '@/types'

interface NotificationsData {
  notifications: Notification[]
  unreadCount: number
}

export function useNotifications() {
  const [data, setData] = useState<NotificationsData>({ notifications: [], unreadCount: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/notifications')
      
      if (!response.ok) {
        throw new Error('Errore nel caricamento notifiche')
      }
      
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const markAsRead = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
      })
      
      if (!response.ok) {
        throw new Error('Errore nell aggiornamento notifica')
      }
      
      setData(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => 
          n.id === id ? { ...n, is_read: true } : n
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1),
      }))
    } catch (err) {
      console.error('Errore markAsRead:', err)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
      })
      
      if (!response.ok) {
        throw new Error('Errore nell aggiornamento notifiche')
      }
      
      setData(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => ({ ...n, is_read: true })),
        unreadCount: 0,
      }))
    } catch (err) {
      console.error('Errore markAllAsRead:', err)
    }
  }, [])

  const deleteNotification = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Errore nella cancellazione notifica')
      }
      
      const wasUnread = data.notifications.find(n => n.id === id)?.is_read === false
      setData(prev => ({
        ...prev,
        notifications: prev.notifications.filter(n => n.id !== id),
        unreadCount: wasUnread ? Math.max(0, prev.unreadCount - 1) : prev.unreadCount,
      }))
    } catch (err) {
      console.error('Errore deleteNotification:', err)
    }
  }, [data.notifications])

  return {
    notifications: data.notifications,
    unreadCount: data.unreadCount,
    isLoading,
    error,
    refreshNotifications: fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  }
}
