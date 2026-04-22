'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

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

export default function AdminDashboard() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [todayShifts, setTodayShifts] = useState<Shift[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setSelectedDate(today)
    fetchShifts(today)
    fetchTodayShifts()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('shifts_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shifts' }, () => {
        fetchShifts(selectedDate)
        fetchTodayShifts()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchShifts = async (date: string) => {
    setLoading(true)
    const { data } = await supabase
      .from('shifts')
      .select(`
        *,
        staff:staff_id (
          id,
          name,
          position
        )
      `)
      .eq('date', date)
      .order('start_time', { ascending: false })

    if (data) setShifts(data as Shift[])
    setLoading(false)
  }

  const fetchTodayShifts = async () => {
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase
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

    if (data) setTodayShifts(data as Shift[])
  }

  const formatTime = (timeString: string | null) => {
    if (!timeString) return 'Not set'
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const getShiftStatus = (shift: Shift) => {
    if (!shift.start_time) return { status: 'Not Started', color: 'text-gray-500' }
    if (!shift.end_time) return { status: 'In Progress', color: 'text-green-600' }
    return { status: 'Completed', color: 'text-blue-600' }
  }

  const getActiveStaff = () => {
    return todayShifts.filter(shift => shift.start_time && !shift.end_time)
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-500 text-white p-6 rounded-lg text-center">
            <div className="text-3xl font-bold">{todayShifts.length}</div>
            <div className="text-blue-100">Total Shifts Today</div>
          </div>
          
          <div className="bg-green-500 text-white p-6 rounded-lg text-center">
            <div className="text-3xl font-bold">{getActiveStaff().length}</div>
            <div className="text-green-100">Currently Working</div>
          </div>
          
          <div className="bg-orange-500 text-white p-6 rounded-lg text-center">
            <div className="text-3xl font-bold">
              {todayShifts.filter(s => s.shift_type === 'morning').length}
            </div>
            <div className="text-orange-100">Morning Shifts</div>
          </div>
          
          <div className="bg-purple-500 text-white p-6 rounded-lg text-center">
            <div className="text-3xl font-bold">
              {todayShifts.filter(s => s.shift_type === 'evening').length}
            </div>
            <div className="text-purple-100">Evening Shifts</div>
          </div>
        </div>

        {/* Currently Active Staff */}
        {getActiveStaff().length > 0 && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
              🟢 Currently Working Staff
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {getActiveStaff().map((shift) => (
                <div key={shift.id} className="bg-white p-4 rounded-lg border border-green-200">
                  <div className="font-semibold text-gray-800">{shift.staff.name}</div>
                  <div className="text-sm text-gray-600">{shift.staff.position}</div>
                  <div className="text-sm text-green-600">
                    {shift.shift_type === 'morning' ? '🌅' : '🌙'} {shift.shift_type} - Started: {formatTime(shift.start_time)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Date Filter and Shifts Table */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Shift History</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value)
                  fetchShifts(e.target.value)
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">Loading shifts...</p>
            </div>
          ) : shifts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No shifts found for this date
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Staff Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shift Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shifts.map((shift) => {
                    const duration = shift.start_time && shift.end_time 
                      ? Math.round((new Date(shift.end_time).getTime() - new Date(shift.start_time).getTime()) / (1000 * 60 * 60 * 100)) / 10
                      : null
                    const statusInfo = getShiftStatus(shift)
                    
                    return (
                      <tr key={shift.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{shift.staff.name}</div>
                          <div className="text-sm text-gray-500">{shift.staff.position}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            shift.shift_type === 'morning' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {shift.shift_type === 'morning' ? '🌅' : '🌙'} {shift.shift_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(shift.start_time)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(shift.end_time)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {duration ? `${duration}h` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`font-medium ${statusInfo.color}`}>
                            {statusInfo.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}