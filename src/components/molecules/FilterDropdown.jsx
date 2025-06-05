import React from 'react'
      import Select from '@/components/atoms/Select'

      const FilterDropdown = ({ label, value, onChange, options }) => {
        return (
          <Select value={value} onChange={onChange}>
            <option value="">{label}</option>
            {options.map((option, index) => (
              <option key={index} value={option.value || option.name || option}>{option.label || option.name || option}</option>
            ))}
          </Select>
        )
      }

      export default FilterDropdown