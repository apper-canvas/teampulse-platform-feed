import React from 'react'
      import { motion } from 'framer-motion'
      import Icon from '@/components/atoms/Icon'
      import Badge from '@/components/atoms/Badge'
      import Text from '@/components/atoms/Text'

      const NavigationItem = ({ item, isActive, onClick, sidebarCollapsed }) => {
        return (
          <motion.button
            key={item.id}
            onClick={() => onClick(item.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-primary text-white shadow-md'
                : item.comingSoon
                ? 'text-surface-400 cursor-not-allowed'
                : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'
            }`}
            disabled={item.comingSoon}
          >
            &lt;Icon name={item.icon} className="w-5 h-5 mr-3 flex-shrink-0" /&gt;
            {!sidebarCollapsed && (
              <>
                &lt;Text variant="small" className="flex-1 text-left"&gt;{item.label}&lt;/Text&gt;
                {item.badge && &lt;Badge isActive={isActive}&gt;{item.badge}&lt;/Badge&gt;}
                {item.comingSoon && &lt;Text variant="xs" className="text-surface-400"&gt;Soon&lt;/Text&gt;}
              </>
            )}
          </motion.button>
        )
      }

      export default NavigationItem