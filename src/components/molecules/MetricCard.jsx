import React from 'react'
      import Card from '@/components/atoms/Card'
      import Text from '@/components/atoms/Text'
      import Icon from '@/components/atoms/Icon'

const MetricCard = ({ title, value, iconName, iconBgColor }) => {
        return (
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="small">{title}</Text>
                <Text variant="h3">{value}</Text>
              </div>
              <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
                <Icon name={iconName} className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        )
      }

      export default MetricCard