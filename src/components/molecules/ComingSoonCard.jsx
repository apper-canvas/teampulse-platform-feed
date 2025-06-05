import React from 'react'
      import Icon from '@/components/atoms/Icon'
      import Card from '@/components/atoms/Card'
      import Text from '@/components/atoms/Text'

      const ComingSoonCard = ({ iconName, title, subtitle }) => {
        return (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto mb-6">
              &lt;Icon name={iconName} className="w-12 h-12 text-white" /&gt;
            </div>
            &lt;Text variant="h2" className="mb-2"&gt;{title}&lt;/Text&gt;
            &lt;Text variant="body" className="text-lg mb-6"&gt;{subtitle}&lt;/Text&gt;
            &lt;Card className="p-8 max-w-md mx-auto"&gt;
              &lt;Text variant="subtle"&gt;This feature is currently under development and will be available soon.&lt;/Text&gt;
            &lt;/Card&gt;
          </div>
        )
      }

      export default ComingSoonCard