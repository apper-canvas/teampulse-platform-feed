import React from 'react'

      const Table = ({ headers, children }) => {
        return (
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-50">
                  <tr>
                    {headers.map((header, index) => (
                      <th key={index} className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200">
                  {children}
                </tbody>
              </table>
            </div>
          </div>
        )
      }

      export default Table