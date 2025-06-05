import React from 'react'
      import Icon from '@/components/atoms/Icon'
      import Text from '@/components/atoms/Text'
      import Button from '@/components/atoms/Button'

      const QuickActionCard = ({ label, icon, color }) => {
        return (
          &lt;Button variant="text" className="w-full justify-start px-3 py-2 text-sm text-surface-700 hover:bg-surface-100 rounded-lg"&gt;
            <div className={`w-6 h-6 ${color} rounded mr-3 flex items-center justify-center`}>
              &lt;Icon name={icon} className="w-3 h-3 text-white" /&gt;
            </div>
            &lt;Text variant="small"&gt;{label}&lt;/Text&gt;
          &lt;/Button&gt;
        )
      }

      export default QuickActionCard