import { Link } from 'react-router-dom'
import { 
  BarChart3, 
  Upload, 
  Eye, 
  TrendingUp, 
  Users, 
  FileText,
  ArrowRight,
  Database,
  Sparkles,
  Zap,
  Activity,
  Target
} from 'lucide-react'

/**
 * Dashboard Page Component
 * 
 * Modern SaaS dashboard with contemporary design and analytics focus.
 * Provides comprehensive overview and quick access to key features.
 * 
 * Features:
 * - Modern gradient cards with advanced animations
 * - Interactive statistics with visual indicators
 * - Feature showcase with benefits
 * - Responsive grid layout with mobile optimization
 */
function Dashboard() {
  // User-specific dashboard statistics
  const stats = [
    {
      name: 'Your Datasets',
      value: '12',
      change: '+2 this month',
      trend: '+16.7%',
      icon: Database,
      gradient: 'from-blue-600 via-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50/50 via-cyan-50/30 to-blue-50/50',
      borderGradient: 'from-blue-200 to-cyan-200',
      shadowColor: 'shadow-blue-500/20'
    },
    {
      name: 'Hours Saved',
      value: '142',
      change: '+18 this week',
      trend: '+24.3%',
      icon: TrendingUp,
      gradient: 'from-emerald-600 via-green-500 to-teal-500',
      bgGradient: 'from-emerald-50/50 via-green-50/30 to-teal-50/50',
      borderGradient: 'from-emerald-200 to-teal-200',
      shadowColor: 'shadow-emerald-500/20'
    },
    {
      name: 'Reports Generated',
      value: '47',
      change: '+12 today',
      trend: '+8.2%',
      icon: FileText,
      gradient: 'from-purple-600 via-violet-500 to-purple-500',
      bgGradient: 'from-purple-50/50 via-violet-50/30 to-purple-50/50',
      borderGradient: 'from-purple-200 to-violet-200',
      shadowColor: 'shadow-purple-500/20'
    },
    {
      name: 'Data Insights',
      value: '89',
      change: '+21 this week',
      trend: '+31.5%',
      icon: Eye,
      gradient: 'from-orange-600 via-amber-500 to-yellow-500',
      bgGradient: 'from-orange-50/50 via-amber-50/30 to-yellow-50/50',
      borderGradient: 'from-orange-200 to-yellow-200',
      shadowColor: 'shadow-orange-500/20'
    }
  ]

  const quickActions = [
    {
      name: 'Upload Dataset',
      description: 'Import CSV files or enter data manually',
      details: 'Support for csv file formats',
      icon: Upload,
      href: '/upload',
      gradient: 'from-blue-600 to-cyan-600',
      bgGradient: 'from-blue-100 to-cyan-100',
      accentColor: 'text-blue-600',
      hoverShadow: 'hover:shadow-blue-500/25'
    },
    {
      name: 'View Data',
      description: 'Explore datasets with advanced filtering and search',
      details: 'Real-time data in tabular format',
      icon: Eye,
      href: '/view',
      gradient: 'from-emerald-600 to-teal-600',
      bgGradient: 'from-emerald-100 to-teal-100',
      accentColor: 'text-emerald-600',
      hoverShadow: 'hover:shadow-emerald-500/25'
    },
   
  ]

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process millions of records in seconds'
    },
   
    {
      icon: Activity,
      title: 'Real-time',
      description: 'Live data updates and monitoring'
    },
    {
      icon: Target,
      title: 'Precision',
      description: 'Accurate analytics and reporting'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 space-y-8">
      {/* Hero Section */}
      <div className="relative mb-10 overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        <div className="relative px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Transform your data into actionable insights with our powerful analytics platform
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <Icon className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-white">{feature.title}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        
      </div>

      {/* Statistics Cards */}
      <div className="mt-18">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
          Your Analytics Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div 
                key={stat.name} 
                className={`group relative bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 hover:shadow-2xl ${stat.shadowColor} transition-all duration-500 transform hover:-translate-y-3 hover:scale-105`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        {stat.trend}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.change}</p>
                  </div>
                </div>
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.borderGradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl`}></div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 my-14 text-center">
          Get Started
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Choose your preferred way to begin working with your data
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link
                key={action.name}
                to={action.href}
                className={`group relative bg-gradient-to-br ${action.bgGradient} rounded-3xl p-8 hover:shadow-2xl ${action.hoverShadow} transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 border border-gray-200/50`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative text-center">
                  <div className={`w-24 h-24 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-3 ${action.accentColor} group-hover:scale-105 transition-transform duration-300`}>
                    {action.name}
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed mb-2">
                    {action.description}
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    {action.details}
                  </p>
                  <div className={`inline-flex items-center ${action.accentColor} group-hover:text-white font-semibold bg-white/50 group-hover:bg-gradient-to-r ${action.gradient} px-6 py-3 rounded-full transition-all duration-300 shadow-lg group-hover:shadow-xl`}>
                    Start Now
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

    </div>
  )
}

export default Dashboard
