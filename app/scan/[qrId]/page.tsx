'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

interface Staff {
  id: string
  name: string
  position: string
}

export default function ScanPage() {
  const params = useParams()
  const qrId = params.qrId as string
  
  const [staff, setStaff] = useState<Staff[]>([])
  const [selectedStaff, setSelectedStaff] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [shiftType, setShiftType] = useState<'morning' | 'evening'>('morning')

  useEffect(() => {
    fetchStaff()
    
    // Decode QR ID to get shift type
    try {
      const decoded = atob(qrId)
      const [type] = decoded.split('-')
      setShiftType(type as 'morning' | 'evening')
    } catch (error) {
      console.error('Invalid QR code')
    }
  }, [qrId])

  const fetchStaff = async () => {
    const { data } = await supabase
      .from('staff')
      .select('*')
      .order('name')
    
    if (data) setStaff(data)
  }

  const handleAction = async (action: 'start' | 'end') => {
    if (!selectedStaff) {
      setMessage('Please select your name')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const today = new Date().toISOString().split('T')[0]
      const now = new Date().toISOString()

      if (action === 'start') {
        // Check if shift already exists for today
        const { data: existingShift } = await supabase
          .from('shifts')
          .select('*')
          .eq('staff_id', selectedStaff)
          .eq('shift_type', shiftType)
          .eq('date', today)
          .single()

        if (existingShift) {
          setMessage('You already started this shift today!')
          setLoading(false)
          return
        }

        // Create new shift
        const { error } = await supabase
          .from('shifts')
          .insert({
            staff_id: selectedStaff,
            shift_type: shiftType,
            start_time: now,
            date: today
          })

        if (error) throw error
        
        const staffName = staff.find(s => s.id === selectedStaff)?.name
        setMessage(`✅ ${staffName} started ${shiftType} shift successfully!`)
        
      } else {
        // End shift
        const { data: shift } = await supabase
          .from('shifts')
          .select('*')
          .eq('staff_id', selectedStaff)
          .eq('shift_type', shiftType)
          .eq('date', today)
          .is('end_time', null)
          .single()

        if (!shift) {
          setMessage('No active shift found to end!')
          setLoading(false)
          return
        }

        const { error } = await supabase
          .from('shifts')
          .update({ end_time: now })
          .eq('id', shift.id)

        if (error) throw error
        
        const staffName = staff.find(s => s.id === selectedStaff)?.name
        setMessage(`🔴 ${staffName} ended ${shiftType} shift successfully!`)
      }

      // Clear selection after 3 seconds
      setTimeout(() => {
        setSelectedStaff('')
        setMessage('')
      }, 3000)

    } catch (error) {
      console.error('Error:', error)
      setMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {shiftType === 'morning' ? '🌅 Morning' : '🌙 Evening'} Shift
            </h2>
            <p className="text-gray-600">Select your name and action</p>
          </div>

          {/* Staff Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Name
            </label>
            <select 
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose your name...</option>
              {staff.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} - {member.position}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 mb-6">
            <button
              onClick={() => handleAction('start')}
              disabled={!selectedStaff || loading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors"
            >
              {loading ? '⏳ Processing...' : '✅ START SHIFT'}
            </button>

            <button
              onClick={() => handleAction('end')}
              disabled={!selectedStaff || loading}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors"
            >
              {loading ? '⏳ Processing...' : '🔴 END SHIFT'}
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-lg text-center font-medium ${
              message.includes('successfully') 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}