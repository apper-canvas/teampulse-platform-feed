import React from 'react'
      import { motion } from 'framer-motion'
      import Icon from '@/components/atoms/Icon'

      const Button = ({ children, onClick, className = '', variant = 'default', icon, disabled, type = 'button', whileHover, whileTap }) => {
        const baseClasses = "flex items-center justify-center rounded-lg transition-colors duration-200"
        
        const variants = {
          default: "bg-primary hover:bg-primary-dark text-white px-4 py-2 shadow-md",
          secondary: "bg-surface-200 hover:bg-surface-300 text-surface-700 px-4 py-2",
          text: "text-surface-600 hover:text-surface-900 hover:bg-surface-100 p-2",
          danger: "text-red-600 hover:text-red-900 hover:bg-red-50 p-2",
          light: "border border-surface-200 text-surface-700 hover:bg-surface-50 px-4 py-2",
          iconOnly: "p-2 rounded-lg hover:bg-surface-100"
        }

        const combinedClassName = `${baseClasses} ${variants[variant]} ${className}`

        const MotionComponent = (whileHover || whileTap) ? motion.button : 'button';

        return (
          <MotionComponent
            type={type}
            onClick={onClick}
            className={combinedClassName}
            disabled={disabled}
            whileHover={whileHover}
whileTap={whileTap}
          >
            {icon && <Icon name={icon} className="w-4 h-4 mr-2" />}
            {children}
          </MotionComponent>
        )
      }

      export default Button