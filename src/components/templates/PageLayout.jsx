import React from 'react'
      import Sidebar from '@/components/organisms/Sidebar'
      import Header from '@/components/organisms/Header'
      import { motion } from 'framer-motion'

      const PageLayout = ({ children, sidebarProps, headerProps }) => {
        return (
          <div className="min-h-screen bg-surface-50 flex">
            &lt;Sidebar {...sidebarProps} /&gt;

            <div className="flex-1 flex flex-col min-h-screen lg:ml-0 ml-0">
              &lt;Header {...headerProps} /&gt;
              <main className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  {children}
                </div>
              </main>
            </div>

            {/* Mobile overlay */}
            {!sidebarProps.sidebarCollapsed && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                onClick={() => sidebarProps.setSidebarCollapsed(true)}
              />
            )}
          </div>
        )
      }

      export default PageLayout