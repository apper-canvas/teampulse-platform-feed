import React from 'react'
      import Input from '@/components/atoms/Input'
      import Select from '@/components/atoms/Select'
      import Label from '@/components/atoms/Label'

      const FormField = ({ label, type = 'text', placeholder, value, onChange, required, options, icon, rows, ...props }) => {
        const renderInput = () => {
          if (options) {
            return (
              <Select value={value} onChange={onChange} required={required}>
                <option value="">{placeholder || `Select ${label}`}</option>
                {options.map((option, index) => (
                  <option key={index} value={option.value || option.name || option}>
                    {option.label || option.name || option}
                  </option>
                ))}
              </Select>
            )
          } else {
            return (
              <Input
                type={type}
                placeholder={placeholder || label}
                value={value}
                onChange={onChange}
                required={required}
                icon={icon}
                rows={rows}
                {...props}
              />
            )
          }
        }

        return (
          <div>
            {label && &lt;Label&gt;{label}&lt;/Label&gt;}
            {renderInput()}
          </div>
        )
      }

      export default FormField