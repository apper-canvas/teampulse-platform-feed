import React from 'react'
      import FormField from '@/components/molecules/FormField'
      import Button from '@/components/atoms/Button'

      const EmployeeForm = ({ newEmployee, setNewEmployee, departments, onSave, onCancel, loading, isEditing }) => {
        return (
          <form onSubmit={onSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              &lt;FormField
                type="text"
                placeholder="First Name"
                value={newEmployee.firstName}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, firstName: e.target.value }))}
                required
              /&gt;
              &lt;FormField
                type="text"
                placeholder="Last Name"
                value={newEmployee.lastName}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, lastName: e.target.value }))}
                required
              /&gt;
            </div>
            
            &lt;FormField
              type="email"
              placeholder="Email"
              value={newEmployee.email}
              onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
              required
            /&gt;
            
            &lt;FormField
              type="tel"
              placeholder="Phone"
              value={newEmployee.phone}
              onChange={(e) => setNewEmployee(prev => ({ ...prev, phone: e.target.value }))}
            /&gt;
            
            &lt;FormField
              type="text"
              placeholder="Job Title"
              value={newEmployee.jobTitle}
              onChange={(e) => setNewEmployee(prev => ({ ...prev, jobTitle: e.target.value }))}
              required
            /&gt;
            
            &lt;FormField
              options={departments}
              placeholder="Select Department"
              value={newEmployee.department}
              onChange={(e) => setNewEmployee(prev => ({ ...prev, department: e.target.value }))}
              required
            /&gt;
            
            &lt;FormField
              options={["New York", "San Francisco", "Chicago", "Remote"]}
              placeholder="Select Location"
              value={newEmployee.location}
              onChange={(e) => setNewEmployee(prev => ({ ...prev, location: e.target.value }))}
              required
            /&gt;
            
            &lt;FormField
              type="date"
              placeholder="Start Date"
              value={newEmployee.startDate}
              onChange={(e) => setNewEmployee(prev => ({ ...prev, startDate: e.target.value }))}
              required
            /&gt;
            
            <div className="flex space-x-3 pt-4">
              &lt;Button type="button" variant="light" onClick={onCancel} className="flex-1"&gt;Cancel&lt;/Button&gt;
              &lt;Button type="submit" className="flex-1" disabled={loading}&gt;
                {loading ? 'Saving...' : (isEditing ? 'Update' : 'Add')} Employee
              &lt;/Button&gt;
            </div>
          </form>
        )
      }

      export default EmployeeForm