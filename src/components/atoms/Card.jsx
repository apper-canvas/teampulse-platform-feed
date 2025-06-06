import React from 'react'

      const Card = ({ children, className = '' }) => {
        return (
          <div className={`bg-white rounded-xl shadow-card ${className}`}>
            {children}
          </div>
        )
      }

      export default Card