import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import employeeService from '../services/api/employeeService'
import departmentService from '../services/api/departmentService'
import timeOffService from '../services/api/timeOffService'
import { format, parseISO } from 'date-fns'

const MainFeature = ({ activeTab }) => {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [timeOffRequests, setTimeOffRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [selectedFilters, setSelectedFilters] = useState({
    department: '',
    location: '',
    status: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [showTimeOffModal, setShowTimeOffModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: '',
    location: '',
    startDate: '',
    employeeNumber: ''
  })
  const [newTimeOffRequest, setNewTimeOffRequest] = useState({
    employeeId: '',
    type: 'vacation',
    startDate: '',
    endDate: '',
    reason: ''
  })

  // Load data based on active tab
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        if (activeTab === 'employees' || activeTab === 'organization') {
          const [employeeData, departmentData] = await Promise.all([
            employeeService.getAll(),
            departmentService.getAll()
          ])
          setEmployees(employeeData || [])
          setDepartments(departmentData || [])
        } else if (activeTab === 'timeoff') {
          const [employeeData, timeOffData] = await Promise.all([
            employeeService.getAll(),
            timeOffService.getAll()
          ])
          setEmployees(employeeData || [])
          setTimeOffRequests(timeOffData || [])
        }
      } catch (err) {
        setError(err.message)
        toast.error("Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [activeTab])

  // Filter employees based on search and filters
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = !searchTerm || 
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDepartment = !selectedFilters.department || employee.department === selectedFilters.department
    const matchesLocation = !selectedFilters.location || employee.location === selectedFilters.location
    const matchesStatus = !selectedFilters.status || 
      (selectedFilters.status === 'active' && employee.startDate) ||
      (selectedFilters.status === 'inactive' && !employee.startDate)
    
    return matchesSearch && matchesDepartment && matchesLocation && matchesStatus
  })

  const handleSaveEmployee = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let result
      if (editingEmployee) {
        result = await employeeService.update(editingEmployee.id, newEmployee)
        setEmployees(prev => prev.map(emp => emp.id === editingEmployee.id ? result : emp))
        toast.success("Employee updated successfully")
      } else {
        result = await employeeService.create(newEmployee)
        setEmployees(prev => [...prev, result])
        toast.success("Employee added successfully")
      }
      setShowEmployeeModal(false)
      resetEmployeeForm()
    } catch (err) {
      toast.error("Failed to save employee")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return
    
    setLoading(true)
    try {
      await employeeService.delete(id)
      setEmployees(prev => prev.filter(emp => emp.id !== id))
      toast.success("Employee deleted successfully")
    } catch (err) {
      toast.error("Failed to delete employee")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitTimeOff = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await timeOffService.create({
        ...newTimeOffRequest,
        status: 'pending',
        createdAt: new Date().toISOString()
      })
      setTimeOffRequests(prev => [...prev, result])
      setShowTimeOffModal(false)
      setNewTimeOffRequest({
        employeeId: '',
        type: 'vacation',
        startDate: '',
        endDate: '',
        reason: ''
      })
      toast.success("Time off request submitted successfully")
    } catch (err) {
      toast.error("Failed to submit time off request")
    } finally {
      setLoading(false)
    }
  }

  const handleApproveTimeOff = async (id, approved) => {
    setLoading(true)
    try {
      const request = timeOffRequests.find(req => req.id === id)
      const result = await timeOffService.update(id, {
        ...request,
        status: approved ? 'approved' : 'rejected'
      })
      setTimeOffRequests(prev => prev.map(req => req.id === id ? result : req))
      toast.success(`Request ${approved ? 'approved' : 'rejected'} successfully`)
    } catch (err) {
      toast.error("Failed to update request")
    } finally {
      setLoading(false)
    }
  }

  const resetEmployeeForm = () => {
    setNewEmployee({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      jobTitle: '',
      department: '',
      location: '',
      startDate: '',
      employeeNumber: ''
    })
    setEditingEmployee(null)
  }

  const openEditModal = (employee) => {
    setEditingEmployee(employee)
    setNewEmployee({
      firstName: employee.firstName || '',
      lastName: employee.lastName || '',
      email: employee.email || '',
      phone: employee.phone || '',
      jobTitle: employee.jobTitle || '',
      department: employee.department || '',
      location: employee.location || '',
      startDate: employee.startDate || '',
      employeeNumber: employee.employeeNumber || ''
    })
    setShowEmployeeModal(true)
  }

  if (loading && employees.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertTriangle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  const renderEmployeesTab = () => (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Employee Management</h1>
          <p className="text-surface-600 mt-1">{filteredEmployees.length} employees found</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm border border-surface-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-surface-600 hover:bg-surface-100'}`}
            >
              <ApperIcon name="Grid3X3" className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'text-surface-600 hover:bg-surface-100'}`}
            >
              <ApperIcon name="List" className="w-4 h-4" />
            </button>
          </div>
          
          <motion.button
            onClick={() => setShowEmployeeModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-md transition-colors"
          >
            <ApperIcon name="UserPlus" className="w-4 h-4" />
            <span className="hidden sm:inline">Add Employee</span>
          </motion.button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedFilters.department}
            onChange={(e) => setSelectedFilters(prev => ({ ...prev, department: e.target.value }))}
            className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </select>
          
          <select
            value={selectedFilters.location}
            onChange={(e) => setSelectedFilters(prev => ({ ...prev, location: e.target.value }))}
            className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Locations</option>
            <option value="New York">New York</option>
            <option value="San Francisco">San Francisco</option>
            <option value="Chicago">Chicago</option>
            <option value="Remote">Remote</option>
          </select>
          
          <select
            value={selectedFilters.status}
            onChange={(e) => setSelectedFilters(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Employee Grid/List */}
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-card">
          <ApperIcon name="Users" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">No employees found</h3>
          <p className="text-surface-600 mb-6">Get started by adding your first employee</p>
          <button
            onClick={() => setShowEmployeeModal(true)}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2"
          >
            <ApperIcon name="UserPlus" className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }
        >
          <AnimatePresence>
            {filteredEmployees.map((employee) => (
              <motion.div
                key={employee.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`bg-white rounded-xl shadow-card hover:shadow-lg transition-all duration-200 ${
                  viewMode === 'grid' ? 'p-6' : 'p-4 flex items-center space-x-4'
                }`}
              >
                <div className={`${viewMode === 'grid' ? 'text-center' : 'flex-shrink-0'}`}>
                  <div className={`${viewMode === 'grid' ? 'w-16 h-16 mx-auto' : 'w-12 h-12'} bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mb-3`}>
                    <span className="text-white font-semibold">
                      {employee.firstName?.[0]}{employee.lastName?.[0]}
                    </span>
                  </div>
                </div>
                
                <div className={viewMode === 'grid' ? 'space-y-2' : 'flex-1 min-w-0'}>
                  <h3 className="font-semibold text-surface-900 truncate">
                    {employee.firstName} {employee.lastName}
                  </h3>
                  <p className="text-sm text-surface-600 truncate">{employee.jobTitle}</p>
                  <p className="text-xs text-surface-500 truncate">{employee.department}</p>
                  {viewMode === 'list' && (
                    <div className="flex items-center space-x-4 text-xs text-surface-500">
                      <span>{employee.email}</span>
                      <span>{employee.location}</span>
                    </div>
                  )}
                </div>
                
                <div className={`${viewMode === 'grid' ? 'flex justify-center space-x-2 mt-4' : 'flex space-x-2'}`}>
                  <button
                    onClick={() => openEditModal(employee)}
                    className="p-2 text-surface-600 hover:text-primary hover:bg-surface-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(employee.id)}
                    className="p-2 text-surface-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )

  const renderTimeOffTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Time Off Management</h1>
          <p className="text-surface-600 mt-1">{timeOffRequests.length} requests total</p>
        </div>
        
        <motion.button
          onClick={() => setShowTimeOffModal(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-md transition-colors"
        >
          <ApperIcon name="Calendar" className="w-4 h-4" />
          <span>Request Time Off</span>
        </motion.button>
      </div>

      {timeOffRequests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-card">
          <ApperIcon name="Calendar" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">No time off requests</h3>
          <p className="text-surface-600">Submit your first time off request</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {timeOffRequests.map((request) => {
                  const employee = employees.find(emp => emp.id === request.employeeId)
                  return (
                    <tr key={request.id} className="hover:bg-surface-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-semibold">
                              {employee?.firstName?.[0]}{employee?.lastName?.[0]}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-surface-900">
                            {employee?.firstName} {employee?.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900 capitalize">
                        {request.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                        {request.startDate} - {request.endDate}
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
                            <button
                              onClick={() => handleApproveTimeOff(request.id, true)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <ApperIcon name="Check" className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleApproveTimeOff(request.id, false)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <ApperIcon name="X" className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )

  const renderComingSoon = (title, subtitle) => (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon name="Rocket" className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-surface-900 mb-2">{title}</h2>
      <p className="text-surface-600 text-lg mb-6">{subtitle}</p>
      <div className="bg-white rounded-xl shadow-card p-8 max-w-md mx-auto">
        <p className="text-surface-500">This feature is currently under development and will be available soon.</p>
      </div>
    </div>
  )

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'employees':
        return renderEmployeesTab()
      case 'timeoff':
        return renderTimeOffTab()
      case 'organization':
        return (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="Sitemap" className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-surface-900 mb-4">Organization Chart</h2>
            <p className="text-surface-600 mb-8">Interactive org chart showing company hierarchy</p>
            <div className="bg-white rounded-xl shadow-card p-12 max-w-4xl mx-auto">
              <div className="space-y-8">
                <div className="flex justify-center">
                  <div className="bg-primary text-white px-6 py-3 rounded-lg font-semibold">CEO</div>
                </div>
                <div className="flex justify-center space-x-8">
                  {['CTO', 'CMO', 'CFO'].map(role => (
                    <div key={role} className="bg-secondary text-white px-4 py-2 rounded-lg">{role}</div>
                  ))}
                </div>
                <div className="flex justify-center space-x-4">
                  {employees.slice(0, 6).map(emp => (
                    <div key={emp.id} className="bg-surface-100 px-3 py-2 rounded-lg text-sm">
                      {emp.firstName} {emp.lastName}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      case 'performance':
        return renderComingSoon("Performance Reviews", "Launching Q2 2024")
      case 'documents':
        return renderComingSoon("Document Management", "Coming Soon")
      case 'analytics':
        return renderComingSoon("Analytics Dashboard", "In Development")
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-600">Total Employees</p>
                  <p className="text-2xl font-bold text-surface-900">{employees.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Users" className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-600">Departments</p>
                  <p className="text-2xl font-bold text-surface-900">{departments.length}</p>
                </div>
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Building2" className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-600">Pending Requests</p>
                  <p className="text-2xl font-bold text-surface-900">
                    {timeOffRequests.filter(req => req.status === 'pending').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                  <ApperIcon name="Clock" className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-600">This Month</p>
                  <p className="text-2xl font-bold text-surface-900">+12%</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <>
      {renderActiveTab()}

      {/* Employee Modal */}
      <AnimatePresence>
        {showEmployeeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowEmployeeModal(false)
              resetEmployeeForm()
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-surface-900">
                  {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <button
                  onClick={() => {
                    setShowEmployeeModal(false)
                    resetEmployeeForm()
                  }}
                  className="p-2 hover:bg-surface-100 rounded-lg"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEmployee} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={newEmployee.firstName}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={newEmployee.lastName}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <input
                  type="email"
                  placeholder="Email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                
                <input
                  type="tel"
                  placeholder="Phone"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                
                <input
                  type="text"
                  placeholder="Job Title"
                  value={newEmployee.jobTitle}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, jobTitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                
                <select
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
                
                <select
                  value={newEmployee.location}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select Location</option>
                  <option value="New York">New York</option>
                  <option value="San Francisco">San Francisco</option>
                  <option value="Chicago">Chicago</option>
                  <option value="Remote">Remote</option>
                </select>
                
                <input
                  type="date"
                  placeholder="Start Date"
                  value={newEmployee.startDate}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmployeeModal(false)
                      resetEmployeeForm()
                    }}
                    className="flex-1 px-4 py-2 border border-surface-200 text-surface-700 rounded-lg hover:bg-surface-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingEmployee ? 'Update' : 'Add')} Employee
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time Off Modal */}
      <AnimatePresence>
        {showTimeOffModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowTimeOffModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-surface-900">Request Time Off</h2>
                <button
                  onClick={() => setShowTimeOffModal(false)}
                  className="p-2 hover:bg-surface-100 rounded-lg"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitTimeOff} className="space-y-4">
                <select
                  value={newTimeOffRequest.employeeId}
                  onChange={(e) => setNewTimeOffRequest(prev => ({ ...prev, employeeId: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
                
                <select
                  value={newTimeOffRequest.type}
                  onChange={(e) => setNewTimeOffRequest(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="vacation">Vacation</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal</option>
                  <option value="bereavement">Bereavement</option>
                </select>
                
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    placeholder="Start Date"
                    value={newTimeOffRequest.startDate}
                    onChange={(e) => setNewTimeOffRequest(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <input
                    type="date"
                    placeholder="End Date"
                    value={newTimeOffRequest.endDate}
                    onChange={(e) => setNewTimeOffRequest(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <textarea
                  placeholder="Reason (optional)"
                  value={newTimeOffRequest.reason}
                  onChange={(e) => setNewTimeOffRequest(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="3"
                />
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTimeOffModal(false)}
                    className="flex-1 px-4 py-2 border border-surface-200 text-surface-700 rounded-lg hover:bg-surface-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MainFeature