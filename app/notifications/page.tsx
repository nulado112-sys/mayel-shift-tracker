'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface NotificationItem {
  id: string
  staff_name: string
  staff_position: string
  action: 'start' | 'end'
  shift_type: 'morning' | 'evening'
  time: string
  read: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    loadNotifications()
    
    // Check if notifications are supported (client-side only)
    if (typeof window !== 'undefined') {
      setIsSupported('Notification' in window)
      
      if ('Notification' in window) {
        setNotificationStatus(Notification.permission)
      }
    }
    
    // Subscribe to real-time shift changes
    const subscription = supabase
      .channel('shift_notifications')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'shifts' 
      }, (payload) => {
        handleShiftChange(payload)
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadNotifications = () => {
    const stored = localStorage.getItem('mayel_notifications')
    if (stored) {
      const notifications = JSON.parse(stored)
      setNotifications(notifications)
      setUnreadCount(notifications.filter((n: NotificationItem) => !n.read).length)
    }
  }

  const handleShiftChange = async (payload: any) => {
    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
      const { data: staffData } = await supabase
        .from('staff')
        .select('name, position')
        .eq('id', payload.new.staff_id)
        .single()

      if (staffData) {
        let action: 'start' | 'end'
        let message = ''
        
        if (payload.eventType === 'INSERT') {
          action = 'start'
          message = `${staffData.name} started their ${payload.new.shift_type} shift`
        } else {
          action = 'end'
          message = `${staffData.name} ended their ${payload.new.shift_type} shift`
        }

        const newNotification: NotificationItem = {
          id: Date.now().toString(),
          staff_name: staffData.name,
          staff_position: staffData.position,
          action,
          shift_type: payload.new.shift_type,
          time: new Date().toISOString(),
          read: false
        }

        addNotification(newNotification)
        
        // Show browser notification if permission granted (client-side only)
        if (typeof window !== 'undefined' && Notification.permission === 'granted') {
          new Notification('Mayel Shift Update', {
            body: message,
            icon: action === 'start' ? '🟢' : '🔴'
          })
        }
      }
    }
  }

  const addNotification = (notification: NotificationItem) => {
    const existing = JSON.parse(localStorage.getItem('mayel_notifications') || '[]')
    const updated = [notification, ...existing].slice(0, 50) // Keep only last 50
    localStorage.setItem('mayel_notifications', JSON.stringify(updated))
    setNotifications(updated)
    setUnreadCount(prev => prev + 1)
  }

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
    localStorage.setItem('mayel_notifications', JSON.stringify(updated))
    setNotifications(updated)
    setUnreadCount(updated.filter(n => !n.read).length)
  }

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }))
    localStorage.setItem('mayel_notifications', JSON.stringify(updated))
    setNotifications(updated)
    setUnreadCount(0)
  }

  const clearNotifications = () => {
    localStorage.removeItem('mayel_notifications')
    setNotifications([])
    setUnreadCount(0)
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        new Notification('Mayel Notifications Enabled', {
          body: 'You will now receive real-time shift updates',
          icon: '✅'
        })
      }
    }
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                🔔 Notifications
                {unreadCount > 0 && (
                  <span className="ml-3 bg-red-500 text-white text-sm rounded-full px-2 py-1 min-w-[24px] h-6 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </h2>
              <p className="text-gray-600 mt-2">Real-time shift tracking updates</p>
            </div>
            <div className="flex space-x-3">
              {Notification.permission !== 'granted' && (
                <button
                  onClick={requestNotificationPermission}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  🔔 Enable Browser Notifications
                </button>
              )}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  ✅ Mark All Read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  🗑️ Clear All
                </button>
              )}
            </div>
          </div>

          {/* Notification Permission Status */}
          <div className={`p-4 rounded-lg mb-6 ${
            Notification.permission === 'granted' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <p className={`font-medium ${
              Notification.permission === 'granted' ? 'text-green-800' : 'text-yellow-800'
            }`}>
              Browser Notifications: {
                Notification.permission === 'granted' ? '✅ Enabled' : 
                Notification.permission === 'denied' ? '❌ Blocked' : '⚠️ Not Enabled'
              }
            </p>
            <p className={`text-sm mt-1 ${
              Notification.permission === 'granted' ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {Notification.permission === 'granted' 
                ? 'You will receive notifications when staff start/end shifts'
                : 'Enable notifications to get real-time updates on your phone/computer'
              }
            </p>
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No notifications yet</h3>
              <p className="text-gray-500">Shift updates will appear here in real-time</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    notification.read 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {notification.action === 'start' ? '🟢' : '🔴'}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {notification.staff_name} {notification.action === 'start' ? 'started' : 'ended'} {notification.shift_type} shift
                        </div>
                        <div className="text-sm text-gray-600">
                          {notification.staff_position} • {formatTime(notification.time)}
                        </div>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}