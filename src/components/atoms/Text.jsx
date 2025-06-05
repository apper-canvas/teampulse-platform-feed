import React from 'react'

      const Text = ({ children, variant = 'body', className = '' }) => {
        const variants = {
          h1: "text-2xl font-bold text-surface-900",
          h2: "text-xl font-bold text-surface-900",
          h3: "text-lg font-semibold text-surface-900",
          h4: "text-base font-semibold text-surface-900",
          body: "text-surface-600",
          small: "text-sm text-surface-600",
          xs: "text-xs text-surface-500",
          subtle: "text-surface-500"
        }

        const Tag = variant.startsWith('h') ? variant : 'p'

        return (
          <Tag className={`${variants[variant]} ${className}`}>
            {children}
          </Tag>
        )
      }

      export default Text