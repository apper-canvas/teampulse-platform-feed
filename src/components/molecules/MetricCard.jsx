import React from 'react'
      import Card from '@/components/atoms/Card'
      import Text from '@/components/atoms/Text'
      import Icon from '@/components/atoms/Icon'

      const MetricCard = ({ title, value, iconName, iconBgColor }) => {
        return (
          &lt;Card className="p-6"&gt;
            <div className="flex items-center justify-between">
              <div>
                &lt;Text variant="small"&gt;{title}&lt;/Text&gt;
                &lt;Text variant="h3"&gt;{value}&lt;/Text&gt;
              </div>
              <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
                &lt;Icon name={iconName} className="w-6 h-6 text-white" /&gt;
              </div>
            </div>
          &lt;/Card&gt;
        )
      }

      export default MetricCard