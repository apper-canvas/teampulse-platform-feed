import React from 'react'
      import FormField from '@/components/molecules/FormField'
      import Button from '@/components/atoms/Button'

      const TimeOffForm = ({ newTimeOffRequest, setNewTimeOffRequest, employees, onSubmit, onCancel, loading }) => {
        return (
          <form onSubmit={onSubmit} className="space-y-4">
            &lt;FormField
              options={employees.map(emp => ({ id: emp.id, label: `${emp.firstName} ${emp.lastName}`, value: emp.id }))}
              placeholder="Select Employee"
              value={newTimeOffRequest.employeeId}
              onChange={(e) => setNewTimeOffRequest(prev => ({ ...prev, employeeId: e.target.value }))}
              required
            /&gt;
            
            &lt;FormField
              options={["vacation", "sick", "personal", "bereavement"]}
              value={newTimeOffRequest.type}
              onChange={(e) => setNewTimeOffRequest(prev => ({ ...prev, type: e.target.value }))}
              required
            /&gt;
            
            <div className="grid grid-cols-2 gap-4">
              &lt;FormField
                type="date"
                placeholder="Start Date"
                value={newTimeOffRequest.startDate}
                onChange={(e) => setNewTimeOffRequest(prev => ({ ...prev, startDate: e.target.value }))}
                required
              /&gt;
              &lt;FormField
                type="date"
                placeholder="End Date"
                value={newTimeOffRequest.endDate}
                onChange={(e) => setNewTimeOffRequest(prev => ({ ...prev, endDate: e.target.value }))}
                required
              /&gt;
            </div>
            
            &lt;FormField
              rows="3"
              placeholder="Reason (optional)"
              value={newTimeOffRequest.reason}
              onChange={(e) => setNewTimeOffRequest(prev => ({ ...prev, reason: e.target.value }))}
            /&gt;
            
            <div className="flex space-x-3 pt-4">
              &lt;Button type="button" variant="light" onClick={onCancel} className="flex-1"&gt;Cancel&lt;/Button&gt;
              &lt;Button type="submit" className="flex-1" disabled={loading}&gt;
                {loading ? 'Submitting...' : 'Submit Request'}
              &lt;/Button&gt;
            </div>
          </form>
        )
      }

      export default TimeOffForm