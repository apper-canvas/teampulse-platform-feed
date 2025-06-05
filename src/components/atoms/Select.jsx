import React from 'react'

      const Select = ({ children, value, onChange, className = '', required }) => {
        return (
          <select
            value={value}
            onChange={onChange}
            className={`w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
            required={required}
          >
            {children}
          </select>
        )
      }

      export default Select