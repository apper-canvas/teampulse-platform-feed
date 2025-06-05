import React from 'react'
      import Table from '@/components/molecules/Table'
      import Icon from '@/components/atoms/Icon'
      import Text from '@/components/atoms/Text'
      import Button from '@/components/atoms/Button'

      const TimeOffTable = ({ requests, employees, onApprove, onReject }) => {
        const headers = ['Employee', 'Type', 'Dates', 'Status', 'Actions']

        return (
          &lt;Table headers={headers}&gt;
            {requests.map((request) => {
              const employee = employees.find(emp => emp.id === request.employeeId)
              return (
                <tr key={request.id} className="hover:bg-surface-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mr-3">
                        &lt;Text variant="small" className="text-white font-semibold"&gt;
                          {employee?.firstName?.[0]}{employee?.lastName?.[0]}
                        &lt;/Text&gt;
                      </div>
                      &lt;Text variant="small" className="font-medium text-surface-900"&gt;
                        {employee?.firstName} {employee?.lastName}
                      &lt;/Text&gt;
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900 capitalize">
                    &lt;Text variant="small" className="capitalize"&gt;{request.type}&lt;/Text&gt;
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                    &lt;Text variant="small"&gt;{request.startDate} - {request.endDate}&lt;/Text&gt;
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        &lt;Button variant="text" onClick={() => onApprove(request.id, true)} icon="Check" className="text-green-600 hover:text-green-900" /&gt;
                        &lt;Button variant="text" onClick={() => onReject(request.id, false)} icon="X" className="text-red-600 hover:text-red-900" /&gt;
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </Table>
        )
      }

      export default TimeOffTable