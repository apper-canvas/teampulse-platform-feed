import React from 'react'
      import { motion } from 'framer-motion'
      import Icon from '@/components/atoms/Icon'
      import Text from '@/components/atoms/Text'
      import Button from '@/components/atoms/Button'
      import NavigationItem from '@/components/molecules/NavigationItem'
      import QuickActions from '@/components/organisms/QuickActions'

      const Sidebar = ({ navigationItems, quickActions, activeTab, setActiveTab, sidebarCollapsed, setSidebarCollapsed }) => {
        return (
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
                    &lt;Icon name="Users" className="w-5 h-5 text-white" /&gt;
                  </div>
                  &lt;Text variant="h2" className="text-xl font-bold text-surface-900"&gt;TeamPulse&lt;/Text&gt;
                </motion.div>
              )}
              &lt;Button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-surface-100 transition-colors hidden lg:flex"
                icon={sidebarCollapsed ? "ChevronRight" : "ChevronLeft"}
                variant="iconOnly"
              /&gt;
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 overflow-y-auto scrollbar-hide">
              <div className="px-3 space-y-1">
                {navigationItems.map((item) => (
                  &lt;NavigationItem
                    key={item.id}
                    item={item}
                    isActive={activeTab === item.id}
                    onClick={setActiveTab}
                    sidebarCollapsed={sidebarCollapsed}
                  /&gt;
                ))}
              </div>
            </nav>

            {/* Quick Actions */}
            {!sidebarCollapsed && &lt;QuickActions actions={quickActions} /&gt;}
          </motion.aside>
        )
      }

      export default Sidebar