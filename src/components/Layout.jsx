import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { 
  BarChart3, 
  Upload, 
  Eye, 
  LogOut,
  User,
  Database
} from 'lucide-react'

/**
 * Layout Component
 * 
 * Provides the main layout structure for authenticated pages.
 * Includes a top navigation bar with responsive design.
 * 
 * Features:
 * - Top navigation bar with active route highlighting
 * - User profile section
 * - Navigation to all main sections
 * - Mobile responsive design
 */
function Layout() {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Upload Data', href: '/upload', icon: Upload },
    { name: 'View Data', href: '/view', icon: Eye },
  ]

  const isActiveRoute = (href) => {
    if (href === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard'
    }
    return location.pathname === href
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <Database className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">DataViewer</span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                      ${isActiveRoute(item.href)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className={`
                      mr-2 h-4 w-4 transition-colors duration-200
                      ${isActiveRoute(item.href)
                        ? 'text-primary-600'
                        : 'text-gray-400 group-hover:text-gray-500'
                      }
                    `} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* User Profile and Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Demo User</p>
                  <p className="text-gray-500">demo@example.com</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation (hamburger menu) */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <nav className="flex space-x-4 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200
                    ${isActiveRoute(item.href)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`
                    mr-2 h-4 w-4 transition-colors duration-200
                    ${isActiveRoute(item.href)
                      ? 'text-primary-600'
                      : 'text-gray-400 group-hover:text-gray-500'
                    }
                  `} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
