import React from 'react'
      import Input from '@/components/atoms/Input'

      const SearchInput = ({ placeholder, value, onChange, className = '' }) => {
        return (
          &lt;Input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            icon="Search"
            className={className}
          /&gt;
        )
      }

      export default SearchInput