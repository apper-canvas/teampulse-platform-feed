import React from 'react'
      import Button from '@/components/atoms/Button'
      import Icon from '@/components/atoms/Icon'
      import SearchInput from '@/components/molecules/SearchInput'
      import Text from '@/components/atoms/Text'

      const Header = ({ onMenuToggle }) => {
        return (
          <header className="h-16 bg-white border-b border-surface-200 shadow-sm flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center space-x-4">
              &lt;Button variant="iconOnly" onClick={onMenuToggle} className="lg:hidden" icon="Menu" /&gt;
              &lt;SearchInput placeholder="Search employees, departments..." className="w-64 lg:w-80" /&gt;
            </div>

            <div className="flex items-center space-x-4">
              &lt;Button variant="text" className="relative" icon="Bell"&gt;
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              &lt;/Button&gt;
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center">
                  &lt;Text variant="small" className="font-semibold text-white"&gt;HR&lt;/Text&gt;
                </div>
                <div className="hidden md:block">
                  &lt;Text variant="small" className="font-medium text-surface-900"&gt;HR Admin&lt;/Text&gt;
                  &lt;Text variant="xs"&gt;Human Resources&lt;/Text&gt;
                </div>
              </div>
            </div>
          </header>
        )
      }

      export default Header