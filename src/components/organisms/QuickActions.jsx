import React from 'react'
      import { motion } from 'framer-motion'
      import Text from '@/components/atoms/Text'
      import QuickActionCard from '@/components/molecules/QuickActionCard'

      const QuickActions = ({ actions }) => {
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 border-t border-surface-200"
          >
            &lt;Text variant="h3" className="text-sm font-semibold text-surface-900 mb-3"&gt;Quick Actions&lt;/Text&gt;
            <div className="space-y-2">
              {actions.map((action, index) => (
                &lt;QuickActionCard key={index} {...action} /&gt;
              ))}
            </div>
          </motion.div>
        )
      }

      export default QuickActions