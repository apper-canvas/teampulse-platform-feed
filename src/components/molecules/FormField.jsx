import React from 'react'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Label from '@/components/atoms/Label'
import Icon from '@/components/atoms/Icon'

const FormField = ({ label, type = 'text', placeholder, value, onChange, required, options, icon, rows, className = '', error, ...props }) => {
  return (
    <div>
      {label && (
        <div className="flex items-center gap-2 mb-2">
          <Label>{label}</Label>
          {required && <span className="text-red-500">*</span>}
        </div>
      )}
      
      {type === 'select' || options ? (
        <Select
          value={value}
          onChange={onChange}
          className={className}
          required={required}
          {...props}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : (
        <div className="relative">
          {icon && <Icon name={icon} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />}
          <Input 
            type={type} 
            placeholder={placeholder} 
            value={value} 
            onChange={onChange} 
            className={`${icon ? 'pl-10' : ''} ${className}`} 
            required={required} 
            rows={rows} 
            {...props} 
          />
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField