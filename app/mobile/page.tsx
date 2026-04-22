'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Staff {
  id: string
  name: string
  position: string
}

interface Shift {
  id: string
  staff_id: string
  shift_type: 'morning' | 'evening'
  start_time: string | null
  end_time: string | null
  date: string
  staff: Staff
}

export default function MobileAdminPage() {
  const [activeShifts, setActiveShifts] = useState<Shift[]>([])
  const [todayStats, setTodayStats] = useState({
    total: 0,
    morning: 0,
    evening: 0,
    active: 0
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    fetchTodayData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTodayData, 30000)
    
    // Real-time subscription
    const subscription = supabase
      .channel('mobile_shifts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shifts' }, () => {
        fetchTodayData()
      })
      .subscribe()

    return () => {
      clearInterval(interval)
      subscription.unsubscribe()
    }
  }, [])

  const fetchTodayData = async () => {
    const today = new Date().toISOString().split('T')[0]
    
    const { data: shifts } = await supabase
      .from('shifts')
      .select(`
        *,
        staff:staff_id (
          id,
          name,
          position
        )
      `)
      .eq('date', today)
      .order('start_time', { ascending: false })

    if (shifts) {
      const active = shifts.filter(s => s.start_time && !s.end_time) as Shift[]
      setActiveShifts(active)
      
      setTodayStats({
        total: shifts.length,
        morning: shifts.filter(s => s.shift_type === 'morning').length,
        evening: shifts.filter(s => s.shift_type === 'evening').length,
        active: active.length
      })
    }
    
    setLastUpdate(new Date())
    setLoading(false)
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const getWorkingHours = (startTime: string) => {
    const start = new Date(startTime)
    const now = new Date()
    const hours = Math.round((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 100)) / 10
    return `${hours}h`
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Mobile Header */}
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Mayel Admin</h1>
            <p className="text-blue-200 text-sm">Shift Tracker</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{todayStats.active}</div>
            <div className="text-blue-200 text-xs">Active Now</div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-green-500 text-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{todayStats.active}</div>
            <div className="text-green-100 text-sm">Working Now</div>
          </div>
          
          <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{todayStats.total}</div>
            <div className="text-blue-100 text-sm">Total Shifts</div>
          </div>
          
          <div className="bg-orange-500 text-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{todayStats.morning}</div>
            <div className="text-orange-100 text-sm">🌅 Morning</div>
          </div>
          
          <div className="bg-purple-500 text-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{todayStats.evening}</div>
            <div className="text-purple-100 text-sm">🌙 Evening</div>
          </div>
        </div>

        {/* Currently Working Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center">
              🟢 Currently Working
            </h2>
            <div className="text-xs text-gray-500">
              Updated: {formatTime(lastUpdate.toISOString())}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-6">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
              <p className="mt-2 text-gray-600 text-sm">Loading...</p>
            </div>
          ) : activeShifts.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-2">😴</div>
              <p className="text-gray-500">No one is working right now</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeShifts.map((shift) => (
                <div key={shift.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg">
                        {shift.staff.position.includes('Chef') || shift.staff.position.includes('Kitchen') ? '👨‍🍳' :
                         shift.staff.position.includes('Waiter') || shift.staff.position.includes('Waitress') ? '🧑‍🍽️' :
                         shift.staff.position.includes('Manager') ? '👨‍💼' :
                         shift.staff.position.includes('Bartender') ? '🍹' :
                         shift.staff.position.includes('Host') || shift.staff.position.includes('Hostess') ? '🙋‍♀️' :
                         shift.staff.position.includes('Cleaner') ? '🧹' :
                         shift.staff.position.includes('Cashier') ? '💰' :
                         shift.staff.position.includes('Delivery') ? '🚗' : '👤'}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{shift.staff.name}</div>
                        <div className="text-sm text-gray-600">{shift.staff.position}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        {shift.shift_type === 'morning' ? '🌅' : '🌙'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {shift.start_time && getWorkingHours(shift.start_time)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 border-t border-green-100 pt-2">
                    Started: {shift.start_time && formatTime(shift.start_time)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin" className="bg-blue-100 border border-blue-200 p-4 rounded-lg text-center">
              <div className="text-2xl mb-1">📊</div>
              <div className="text-sm font-medium text-blue-800">Full Dashboard</div>
            </Link>
            
            <Link href="/notifications" className="bg-purple-100 border border-purple-200 p-4 rounded-lg text-center">
              <div className="text-2xl mb-1">🔔</div>
              <div className="text-sm font-medium text-purple-800">Notifications</div>
            </Link>
            
            <Link href="/staff" className="bg-green-100 border border-green-200 p-4 rounded-lg text-center">
              <div className="text-2xl mb-1">👥</div>
              <div className="text-sm font-medium text-green-800">Manage Staff</div>
            </Link>
            
            <Link href="/qr-generator" className="bg-orange-100 border border-orange-200 p-4 rounded-lg text-center">
              <div className="text-2xl mb-1">📱</div>
              <div className="text-sm font-medium text-orange-800">QR Codes</div>
            </Link>
          </div>
        </div>

        {/* Auto-refresh Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
          <p className="text-yellow-800 text-sm">
            📱 This page auto-updates every 30 seconds
          </p>
        </div>
      </div>
    </main>
  )
}