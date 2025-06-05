import React, { useState } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [activeTab, setActiveTab] = useState('employees')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3', badge: '47' },
    { id: 'employees', label: 'Employees', icon: 'Users', active: true },
    { id: 'organization', label: 'Organization', icon: 'Sitemap' },
    { id: 'timeoff', label: 'Time Off', icon: 'Calendar', badge: '3' },
    { id: 'performance', label: 'Performance', icon: 'Target', comingSoon: true },
    { id: 'documents', label: 'Documents', icon: 'FileText', comingSoon: true },
    { id: 'analytics', label: 'Analytics', icon: 'PieChart', comingSoon: true },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ]

  const quickActions = [
    { label: 'Add Employee', icon: 'UserPlus', color: 'bg-primary' },
    { label: 'Time Off', icon: 'Calendar', color: 'bg-secondary' },
    { label: 'Reports', icon: 'FileBarChart', color: 'bg-accent' }
  ]

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0, width: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white border-r border-surface-200 shadow-soft flex flex-col h-screen fixed lg:relative z-40"
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-surface-200">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-surface-900">TeamPulse</span>
            </motion.div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-surface-100 transition-colors hidden lg:flex"
          >
            <ApperIcon name={sidebarCollapsed ? "ChevronRight" : "ChevronLeft"} className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto scrollbar-hide">
          <div className="px-3 space-y-1">
            {navigationItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-primary text-white shadow-md'
                    : item.comingSoon
                    ? 'text-surface-400 cursor-not-allowed'
                    : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'
                }`}
                disabled={item.comingSoon}
              >
                <ApperIcon name={item.icon} className="w-5 h-5 mr-3 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        activeTab === item.id ? 'bg-white/20 text-white' : 'bg-surface-200 text-surface-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {item.comingSoon && (
                      <span className="text-xs text-surface-400">Soon</span>
                    )}
                  </>
                )}
              </motion.button>
            ))}
          </div>
        </nav>

        {/* Quick Actions */}
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 border-t border-surface-200"
          >
            <h3 className="text-sm font-semibold text-surface-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="w-full flex items-center px-3 py-2 text-sm text-surface-700 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  <div className={`w-6 h-6 ${action.color} rounded mr-3 flex items-center justify-center`}>
                    <ApperIcon name={action.icon} className="w-3 h-3 text-white" />
                  </div>
                  {action.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0 ml-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-surface-200 shadow-sm flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-surface-100 transition-colors lg:hidden"
            >
              <ApperIcon name="Menu" className="w-5 h-5" />
            </button>
            
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                placeholder="Search employees, departments..."
                className="pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64 lg:w-80"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors">
              <ApperIcon name="Bell" className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">HR</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-surface-900">HR Admin</p>
                <p className="text-xs text-surface-500">Human Resources</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <MainFeature activeTab={activeTab} />
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  )
}

export default Home