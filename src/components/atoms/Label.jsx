import React from 'react'

      const Label = ({ children, className = '' }) => {
        return (
          <p className={`text-sm font-medium text-surface-600 ${className}`}>
            {children}
          </p>
        )
      }

      export default Label