import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen pb-20">
      {/* Mobile Header */}
      <div className="bg-blue-600 text-white p-6 text-center">
        <h1 className="text-3xl font-bold mb-2">🍽️ Mayel Restaurant</h1>
        <p className="text-blue-100">Shift Tracking System</p>
      </div>

      <div className="p-6">
        {/* Quick Access for Mobile */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg p-6 mb-6 text-center">
          <h2 className="text-xl font-bold mb-2">📱 Mobile Admin Access</h2>
          <p className="text-green-100 mb-4">Track shifts from your phone</p>
          <Link href="/mobile" className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg inline-block hover:bg-blue-50 transition-colors">
            🚀 Go to Mobile Dashboard
          </Link>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Link href="/admin" className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg text-center transition-colors">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-lg mb-2">Full Dashboard</h3>
            <p className="text-sm text-blue-100">Complete shift analytics</p>
          </Link>
          
          <Link href="/qr-generator" className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg text-center transition-colors">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold text-lg mb-2">QR Codes</h3>
            <p className="text-sm text-green-100">Generate & print codes</p>
          </Link>
          
          <Link href="/staff" className="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-lg text-center transition-colors">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="font-semibold text-lg mb-2">Staff</h3>
            <p className="text-sm text-purple-100">Manage team members</p>
          </Link>
          
          <Link href="/notifications" className="bg-orange-500 hover:bg-orange-600 text-white p-6 rounded-lg text-center transition-colors">
            <div className="text-3xl mb-3">🔔</div>
            <h3 className="font-semibold text-lg mb-2">Notifications</h3>
            <p className="text-sm text-orange-100">Real-time alerts</p>
          </Link>
          
          <Link href="/mobile" className="bg-red-500 hover:bg-red-600 text-white p-6 rounded-lg text-center transition-colors col-span-1 md:col-span-2 lg:col-span-2">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold text-lg mb-2">Mobile Admin</h3>
            <p className="text-sm text-red-100">Perfect for tracking on your phone</p>
          </Link>
        </div>
        
        {/* Instructions */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-3 text-lg">📋 How it works:</h3>
          <ol className="list-decimal list-inside text-yellow-700 space-y-2">
            <li className="flex items-start">
              <span className="mr-2">1️⃣</span>
              <span>Generate QR codes for morning 🌅 and evening 🌙 shifts</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2️⃣</span>
              <span>Print and place QR codes at restaurant entrance</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3️⃣</span>
              <span>Staff scan QR → Select name → Press <span className="bg-green-200 px-2 py-1 rounded">GREEN</span> to start</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">4️⃣</span>
              <span>Staff scan again → Press <span className="bg-red-200 px-2 py-1 rounded">RED</span> to end shift</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">5️⃣</span>
              <span>Track everything from your phone with mobile dashboard</span>
            </li>
          </ol>
        </div>
      </div>
    </main>
  )
}