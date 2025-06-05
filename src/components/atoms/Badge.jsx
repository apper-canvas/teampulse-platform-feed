import React from 'react'

      const Badge = ({ children, isActive }) => {
        return (
          <span className={`px-2 py-0.5 text-xs rounded-full ${
            isActive ? 'bg-white/20 text-white' : 'bg-surface-200 text-surface-600'
          }`}>
            {children}
          </span>
        )
      }

      export default Badge