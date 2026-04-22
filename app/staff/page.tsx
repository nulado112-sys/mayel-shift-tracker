'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Staff {
  id: string
  name: string
  phone: string
  position: string
  created_at: string
}

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingStaff, setIsAddingStaff] = useState(false)
  const [newStaff, setNewStaff] = useState({
    name: '',
    phone: '',
    position: ''
  })

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('staff')
      .select('*')
      .order('name')
    
    if (data) setStaff(data)
    setLoading(false)
  }

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStaff.name || !newStaff.position) return

    const { error } = await supabase
      .from('staff')
      .insert([newStaff])

    if (!error) {
      setNewStaff({ name: '', phone: '', position: '' })
      setIsAddingStaff(false)
      fetchStaff()
    }
  }

  const handleDeleteStaff = async (id: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id)

      if (!error) {
        fetchStaff()
      }
    }
  }

  const positions = [
    'Waiter/Waitress',
    'Kitchen Staff',
    'Chef',
    'Host/Hostess',
    'Bartender',
    'Cleaner',
    'Manager',
    'Cashier',
    'Delivery'
  ]

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Staff Management</h2>
              <p className="text-gray-600 mt-2">Manage your restaurant staff members</p>
            </div>
            <button
              onClick={() => setIsAddingStaff(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              ➕ Add New Staff
            </button>
          </div>

          {/* Add Staff Form */}
          {isAddingStaff && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Add New Staff Member</h3>
              <form onSubmit={handleAddStaff} className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position *
                  </label>
                  <select
                    required
                    value={newStaff.position}
                    onChange={(e) => setNewStaff({...newStaff, position: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select position...</option>
                    {positions.map((position) => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    ✅ Add Staff
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingStaff(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Staff List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">Loading staff...</p>
            </div>
          ) : staff.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No staff members yet</h3>
              <p className="text-gray-500">Add your first staff member to get started</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staff.map((member) => (
                <div key={member.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-2xl">
                      {member.position.includes('Chef') || member.position.includes('Kitchen') ? '👨‍🍳' :
                       member.position.includes('Waiter') || member.position.includes('Waitress') ? '🧑‍🍽️' :
                       member.position.includes('Manager') ? '👨‍💼' :
                       member.position.includes('Bartender') ? '🍹' :
                       member.position.includes('Host') || member.position.includes('Hostess') ? '🙋‍♀️' :
                       member.position.includes('Cleaner') ? '🧹' :
                       member.position.includes('Cashier') ? '💰' :
                       member.position.includes('Delivery') ? '🚗' : '👤'}
                    </div>
                    <button
                      onClick={() => handleDeleteStaff(member.id)}
                      className="text-red-500 hover:text-red-700 text-sm transition-colors"
                      title="Delete staff member"
                    >
                      🗑️
                    </button>
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{member.position}</p>
                  
                  {member.phone && (
                    <p className="text-gray-600 text-sm mb-2">📞 {member.phone}</p>
                  )}
                  
                  <p className="text-gray-400 text-xs">
                    Added: {new Date(member.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          {staff.length > 0 && (
            <div className="mt-6 text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700">
                  <strong>{staff.length} staff members</strong> ready to track shifts with QR codes
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}