import React from 'react'
      import { motion } from 'framer-motion'
      import Icon from '@/components/atoms/Icon'
      import Card from '@/components/atoms/Card'
      import Text from '@/components/atoms/Text'
      import Button from '@/components/atoms/Button'

      const EmployeeCard = ({ employee, viewMode, onEdit, onDelete }) => {
        return (
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-xl shadow-card hover:shadow-lg transition-all duration-200 ${
              viewMode === 'grid' ? 'p-6 text-center' : 'p-4 flex items-center space-x-4'
            }`}
          >
            <div className={`${viewMode === 'grid' ? 'w-16 h-16 mx-auto' : 'w-12 h-12'} bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mb-3`}>
              &lt;Text variant="body" className="text-white font-semibold"&gt;
                {employee.firstName?.[0]}{employee.lastName?.[0]}
              &lt;/Text&gt;
            </div>
            
            <div className={viewMode === 'grid' ? 'space-y-2' : 'flex-1 min-w-0'}>
              &lt;Text variant="h4" className="truncate"&gt;
                {employee.firstName} {employee.lastName}
              &lt;/Text&gt;
              &lt;Text variant="small" className="truncate"&gt;{employee.jobTitle}&lt;/Text&gt;
              &lt;Text variant="xs" className="truncate"&gt;{employee.department}&lt;/Text&gt;
              {viewMode === 'list' && (
                <div className="flex items-center space-x-4 text-xs text-surface-500">
                  &lt;Text variant="xs"&gt;{employee.email}&lt;/Text&gt;
                  &lt;Text variant="xs"&gt;{employee.location}&lt;/Text&gt;
                </div>
              )}
            </div>
            
            <div className={`${viewMode === 'grid' ? 'flex justify-center space-x-2 mt-4' : 'flex space-x-2'}`}>
              &lt;Button variant="text" onClick={() => onEdit(employee)} icon="Edit" /&gt;
              &lt;Button variant="danger" onClick={() => onDelete(employee.id)} icon="Trash2" /&gt;
            </div>
          </motion.div>
        )
      }

      export default EmployeeCard