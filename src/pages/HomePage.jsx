import React, { useState, useEffect } from 'react'
      import { toast } from 'react-toastify'
      import { AnimatePresence } from 'framer-motion'
      import PageLayout from '@/components/templates/PageLayout'
      import Text from '@/components/atoms/Text'
      import Button from '@/components/atoms/Button'
      import Icon from '@/components/atoms/Icon'
      import Card from '@/components/atoms/Card'
      import SearchInput from '@/components/molecules/SearchInput'
      import FilterDropdown from '@/components/molecules/FilterDropdown'
      import EmployeeGridList from '@/components/organisms/EmployeeGridList'
      import EmployeeForm from '@/components/organisms/EmployeeForm'
      import TimeOffForm from '@/components/organisms/TimeOffForm'
      import TimeOffTable from '@/components/organisms/TimeOffTable'
      import MetricCard from '@/components/molecules/MetricCard'
      import ComingSoonCard from '@/components/molecules/ComingSoonCard'
      import Modal from '@/components/molecules/Modal'

      import employeeService from '@/services/api/employeeService'
      import departmentService from '@/services/api/departmentService'
      import timeOffService from '@/services/api/timeOffService'

      const HomePage = () => {
        const [activeTab, setActiveTab] = useState('dashboard')
        const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
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

        const navigationItems = [
          { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3', badge: '47' },
          { id: 'employees', label: 'Employees', icon: 'Users', active: true },
          { id: 'organization', label: 'Organization', icon: 'Sitemap' },
          { id: 'timeoff', label: 'Time Off', icon: 'Calendar', badge: '3' },
          { id: 'performance', label: 'Performance', icon: 'Target', comingSoon: true },
          { id: 'documents', label: 'Documents', icon: 'FileText', comingSoon: true },
          { id: 'analytics', label: 'Analytics', icon: 'PieChart', comingSoon: true },
          { id: 'settings', label: 'Settings', icon: 'Settings' }
        ]

        const quickActions = [
          { label: 'Add Employee', icon: 'UserPlus', color: 'bg-primary' },
          { label: 'Time Off', icon: 'Calendar', color: 'bg-secondary' },
          { label: 'Reports', icon: 'FileBarChart', color: 'bg-accent' }
        ]

        // Load data based on active tab
        useEffect(() => {
          const loadData = async () => {
            setLoading(true)
            setError(null)
            try {
              if (activeTab === 'employees' || activeTab === 'organization' || activeTab === 'dashboard') {
                const [employeeData, departmentData] = await Promise.all([
                  employeeService.getAll(),
                  departmentService.getAll()
                ])
                setEmployees(employeeData || [])
                setDepartments(departmentData || [])
              }
              if (activeTab === 'timeoff' || activeTab === 'dashboard') {
                const [employeeData, timeOffData] = await Promise.all([
                  employeeService.getAll(),
                  timeOffService.getAll()
                ])
                setEmployees(employeeData || []) // Ensure employees are loaded for time off tab too
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

        const openEditEmployeeModal = (employee) => {
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

const renderEmployeesTab = () => (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <Text variant="h1">Employee Management</Text>
                <Text variant="body" className="mt-1">{filteredEmployees.length} employees found</Text>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm border border-surface-200">
                  <Button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-surface-600 hover:bg-surface-100'}`}
                    icon="Grid3X3"
                    variant="iconOnly"
                  />
                  <Button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'text-surface-600 hover:bg-surface-100'}`}
                    icon="List"
                    variant="iconOnly"
                  />
                </div>
                
                <Button onClick={() => setShowEmployeeModal(true)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} icon="UserPlus">
                  <span className="hidden sm:inline">Add Employee</span>
                </Button>
              </div>
            </div>

            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SearchInput
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <FilterDropdown
                  label="All Departments"
                  value={selectedFilters.department}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, department: e.target.value }))}
                  options={departments}
                />
                
                <FilterDropdown
                  label="All Locations"
                  value={selectedFilters.location}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, location: e.target.value }))}
                  options={["New York", "San Francisco", "Chicago", "Remote"]}
                />
                
                <FilterDropdown
                  label="All Status"
                  value={selectedFilters.status}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, status: e.target.value }))}
                  options={[{value: 'active', label: 'Active'}, {value: 'inactive', label: 'Inactive'}]}
                />
              </div>
            </Card>

            <EmployeeGridList
              employees={filteredEmployees}
              viewMode={viewMode}
              onEdit={openEditEmployeeModal}
              onDelete={handleDeleteEmployee}
              onAddEmployee={() => setShowEmployeeModal(true)}
            />
          </div>
        )

        const renderTimeOffTab = () => (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <Text variant="h1">Time Off Management</Text>
                <Text variant="body" className="mt-1">{timeOffRequests.length} requests total</Text>
              </div>
              
              <Button onClick={() => setShowTimeOffModal(true)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} icon="Calendar">
                Request Time Off
              </Button>
            </div>

            {timeOffRequests.length === 0 ? (
              <Card className="text-center py-12">
                <Icon name="Calendar" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                <Text variant="h3" className="mb-2">No time off requests</Text>
                <Text variant="body">Submit your first time off request</Text>
              </Card>
            ) : (
              <TimeOffTable 
                requests={timeOffRequests}
                employees={employees}
                onApprove={handleApproveTimeOff}
                onReject={handleApproveTimeOff}
              />
            )}
          </div>
        )

        const renderOrganizationTab = () => (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="Sitemap" className="w-12 h-12 text-white" />
            </div>
            <Text variant="h2" className="mb-4">Organization Chart</Text>
            <Text variant="body" className="mb-8">Interactive org chart showing company hierarchy</Text>
            <Card className="p-12 max-w-4xl mx-auto">
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
            </Card>
          </div>
        )

        const renderDashboardTab = () => (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard 
              title="Total Employees" 
              value={employees.length} 
              iconName="Users" 
              iconBgColor="bg-primary" 
            />
            
            <MetricCard 
              title="Departments" 
              value={departments.length} 
              iconName="Building2" 
              iconBgColor="bg-secondary" 
            />
            
            <MetricCard 
              title="Pending Requests" 
              value={timeOffRequests.filter(req => req.status === 'pending').length} 
              iconName="Clock" 
              iconBgColor="bg-accent" 
            />
            
            <MetricCard 
              title="This Month" 
              value="+12%" 
              iconName="TrendingUp" 
              iconBgColor="bg-green-500" 
            />
          </div>
        )

        const renderActiveTabContent = () => {
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
                <Icon name="AlertTriangle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <Text variant="body" className="text-red-600">{error}</Text>
              </div>
            )
          }

          switch (activeTab) {
            case 'employees':
              return renderEmployeesTab()
            case 'timeoff':
              return renderTimeOffTab()
            case 'organization':
              return renderOrganizationTab()
            case 'performance':
              return <ComingSoonCard iconName="Target" title="Performance Reviews" subtitle="Launching Q2 2024" />
            case 'documents':
              return <ComingSoonCard iconName="FileText" title="Document Management" subtitle="Coming Soon" />
            case 'analytics':
              return <ComingSoonCard iconName="PieChart" title="Analytics Dashboard" subtitle="In Development" />
            case 'dashboard':
            default:
              return renderDashboardTab()
          }
        }

        return (
          <PageLayout
            sidebarProps={{
              navigationItems,
              quickActions,
              activeTab,
              setActiveTab,
              sidebarCollapsed,
              setSidebarCollapsed,
            }}
            headerProps={{
              onMenuToggle: () => setSidebarCollapsed(!sidebarCollapsed),
            }}
          >
            {renderActiveTabContent()}

            <Modal isOpen={showEmployeeModal} onClose={() => { setShowEmployeeModal(false); resetEmployeeForm(); }} title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}>
              <EmployeeForm
                newEmployee={newEmployee}
                setNewEmployee={setNewEmployee}
                departments={departments}
                onSave={handleSaveEmployee}
                onCancel={() => { setShowEmployeeModal(false); resetEmployeeForm(); }}
                loading={loading}
                isEditing={!!editingEmployee}
              />
            </Modal>

            <Modal isOpen={showTimeOffModal} onClose={() => setShowTimeOffModal(false)} title="Request Time Off">
              <TimeOffForm
                newTimeOffRequest={newTimeOffRequest}
                setNewTimeOffRequest={setNewTimeOffRequest}
                employees={employees}
                onSubmit={handleSubmitTimeOff}
                onCancel={() => setShowTimeOffModal(false)}
                loading={loading}
              />
            </Modal>
          </PageLayout>
        )
      }

      export default HomePage