import React from 'react'
      import Icon from '@/components/atoms/Icon'

      const Input = ({ type = 'text', placeholder, value, onChange, className = '', icon, required, rows, ...props }) => {
        const baseClasses = "w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        const finalClasses = `${baseClasses} ${icon ? 'pl-10 pr-4' : ''} ${className}`

        const InputComponent = rows ? 'textarea' : 'input';

        return (
          <div className="relative">
            {icon && &lt;Icon name={icon} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" /&gt;}
            <InputComponent
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              className={finalClasses}
              required={required}
              rows={rows}
              {...props}
            />
          </div>
        )
      }

      export default Input