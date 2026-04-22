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
  const [notificationStatus, setNotificationStatus] = useState<string>('default')
  const [isSupported, setIsSupported] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadNotifications()
    
    // Check if notifications are supported (client-side only)
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true)
      setNotificationStatus(Notification.permission)
    }
    
    // Subscribe to real-time shift changes
    const subscription = supabase
      .channel('shift_notifications')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'shifts' 
      }, (payload) => {
        if (mounted) {
          handleShiftChange(payload)
        }
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [mounted])

  const loadNotifications = () => {
    if (typeof window === 'undefined') return
    
    const stored = localStorage.getItem('mayel_notifications')
    if (stored) {
      const notifications = JSON.parse(stored)
      setNotifications(notifications)
      setUnreadCount(notifications.filter((n: NotificationItem) => !n.read).length)
    }
  }

  const handleShiftChange = async (payload: any) => {
    if (typeof window === 'undefined') return
    
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
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('Mayel Shift Update', {
            body: message,
            icon: action === 'start' ? '🟢' : '🔴'
          })
        }
      }
    }
  }

  const addNotification = (notification: NotificationItem) => {
    if (typeof window === 'undefined') return
    
    const existing = JSON.parse(localStorage.getItem('mayel_notifications') || '[]')
    const updated = [notification, ...existing].slice(0, 50)
    localStorage.setItem('mayel_notifications', JSON.stringify(updated))
    setNotifications(updated)
    setUnreadCount(prev => prev + 1)
  }

  const requestNotificationPermission = async () => {
    if (!isSupported || typeof window === 'undefined' || !('Notification' in window)) return

    try {
      const permission = await Notification.requestPermission()
      setNotificationStatus(permission)
      
      if (permission === 'granted') {
        new Notification('Mayel Notifications Enabled', {
          body: 'You will now receive real-time shift updates',
          icon: '✅'
        })
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
    }
  }

  const testNotification = () => {
    if (typeof window !== 'undefined' && 'Notification' in window && notificationStatus === 'granted') {
      new Notification('Test Notification', {
        body: '🧪 This is what shift updates will look like!',
        icon: '🔔'
      })
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

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-purple-600 text-white p-4">
          <h1 className="text-xl font-bold">🔔 Mobile Notifications</h1>
          <p className="text-purple-200 text-sm">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4">
        <h1 className="text-xl font-bold">🔔 Mobile Notifications</h1>
        <p className="text-purple-200 text-sm">Get instant shift alerts</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Current Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Notification Status</h2>
          
          {!isSupported ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">❌</span>
                <div>
                  <div className="font-semibold text-red-800">Not Supported</div>
                  <div className="text-sm text-red-600">Your browser doesn't support notifications</div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`border rounded-lg p-4 ${
              notificationStatus === 'granted' ? 'bg-green-50 border-green-200' :
              notificationStatus === 'denied' ? 'bg-red-50 border-red-200' :
              'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {notificationStatus === 'granted' ? '✅' :
                   notificationStatus === 'denied' ? '❌' : '⚠️'}
                </span>
                <div>
                  <div className={`font-semibold ${
                    notificationStatus === 'granted' ? 'text-green-800' :
                    notificationStatus === 'denied' ? 'text-red-800' :
                    'text-yellow-800'
                  }`}>
                    {notificationStatus === 'granted' ? 'Enabled' :
                     notificationStatus === 'denied' ? 'Blocked' : 'Not Enabled'}
                  </div>
                  <div className={`text-sm ${
                    notificationStatus === 'granted' ? 'text-green-600' :
                    notificationStatus === 'denied' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {notificationStatus === 'granted' ? 'You will receive shift alerts' :
                     notificationStatus === 'denied' ? 'Notifications are blocked' :
                     'Click to enable notifications'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isSupported && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Actions</h3>
            <div className="space-y-3">
              {notificationStatus !== 'granted' && (
                <button
                  onClick={requestNotificationPermission}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  🔔 Enable Notifications
                </button>
              )}
              
              {notificationStatus === 'granted' && (
                <button
                  onClick={testNotification}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  🧪 Send Test Notification
                </button>
              )}
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Recent Updates {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-sm rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </h3>
          
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🔔</div>
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.read 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">
                      {notification.action === 'start' ? '🟢' : '🔴'}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        {notification.staff_name} {notification.action === 'start' ? 'started' : 'ended'} {notification.shift_type} shift
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatTime(notification.time)}
                      </div>
                    </div>
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