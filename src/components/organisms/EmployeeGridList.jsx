import React from 'react'
      import { motion, AnimatePresence } from 'framer-motion'
      import EmployeeCard from '@/components/molecules/EmployeeCard'
      import Icon from '@/components/atoms/Icon'
      import Text from '@/components/atoms/Text'
      import Button from '@/components/atoms/Button'
      import Card from '@/components/atoms/Card'

      const EmployeeGridList = ({ employees, viewMode, onEdit, onDelete, onAddEmployee }) => {
        if (employees.length === 0) {
          return (
            &lt;Card className="text-center py-12"&gt;
              &lt;Icon name="Users" className="w-16 h-16 text-surface-300 mx-auto mb-4" /&gt;
              &lt;Text variant="h3" className="mb-2"&gt;No employees found&lt;/Text&gt;
              &lt;Text variant="body" className="mb-6"&gt;Get started by adding your first employee&lt;/Text&gt;
              &lt;Button onClick={onAddEmployee} icon="UserPlus"&gt;
                Add Employee
              &lt;/Button&gt;
            &lt;/Card&gt;
          )
        }

        return (
          <motion.div
            layout
            className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-4"
            }
          >
            <AnimatePresence>
              {employees.map((employee) => (
                &lt;EmployeeCard 
                  key={employee.id}
                  employee={employee}
                  viewMode={viewMode}
                  onEdit={onEdit}
                  onDelete={onDelete}
                /&gt;
              ))}
            </AnimatePresence>
          </motion.div>
        )
      }

      export default EmployeeGridList