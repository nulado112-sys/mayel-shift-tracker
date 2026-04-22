'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/mobile', icon: '🏠', label: 'Home', active: pathname === '/mobile' },
    { href: '/admin', icon: '📊', label: 'Dashboard', active: pathname === '/admin' },
    { href: '/notifications', icon: '🔔', label: 'Alerts', active: pathname === '/notifications' },
    { href: '/staff', icon: '👥', label: 'Staff', active: pathname === '/staff' },
    { href: '/qr-generator', icon: '📱', label: 'QR Codes', active: pathname === '/qr-generator' }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              item.active
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}