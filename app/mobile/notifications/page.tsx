'use client'

import { useState, useEffect } from 'react'

export default function MobileNotificationsPage() {
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported('Notification' in window)
    
    if ('Notification' in window) {
      setNotificationStatus(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if (!isSupported) return

    try {
      const permission = await Notification.requestPermission()
      setNotificationStatus(permission)
      
      if (permission === 'granted') {
        // Test notification
        new Notification('Mayel Shift Tracker', {
          body: '✅ Notifications enabled! You\'ll get alerts when staff start/end shifts.',
          icon: '🔔',
          tag: 'test'
        })
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
    }
  }

  const testNotification = () => {
    if (notificationStatus === 'granted') {
      new Notification('Test Notification', {
        body: '🧪 This is what shift updates will look like!',
        icon: '🔔'
      })
    }
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
                  onClick={requestPermission}
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
              
              {notificationStatus === 'denied' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="text-orange-800 font-medium mb-2">To Enable Notifications:</div>
                  <ol className="list-decimal list-inside text-sm text-orange-700 space-y-1">
                    <li>Look for the 🔔 icon in your browser's address bar</li>
                    <li>Click it and select "Allow"</li>
                    <li>Or go to Settings → Site Settings → Notifications</li>
                    <li>Refresh this page after changing settings</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}

        {/* What You'll Get */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">What You'll Get Notified About</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-2xl">🟢</span>
              <div>
                <div className="font-medium text-green-800">Staff Starts Shift</div>
                <div className="text-sm text-green-600">"Ahmed started morning shift"</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-2xl">🔴</span>
              <div>
                <div className="font-medium text-red-800">Staff Ends Shift</div>
                <div className="text-sm text-red-600">"Fatima ended evening shift"</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">💡 Tips for Mobile:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Keep this website open in a browser tab</li>
            <li>• Add to your home screen for quick access</li>
            <li>• Notifications work even when screen is off</li>
            <li>• Check the mobile dashboard for live updates</li>
          </ul>
        </div>

        {/* Add to Home Screen Instructions */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">📱 Add to Home Screen:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div><strong>iPhone:</strong> Safari → Share → Add to Home Screen</div>
            <div><strong>Android:</strong> Chrome → Menu → Add to Home Screen</div>
          </div>
        </div>
      </div>
    </main>
  )
}