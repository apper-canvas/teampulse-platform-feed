import employeeData from '../mockData/employee.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let employees = [...employeeData]

const employeeService = {
  async getAll() {
    await delay(300)
    return [...employees]
  },

  async getById(id) {
    await delay(200)
    const employee = employees.find(emp => emp.id === id)
    if (!employee) {
      throw new Error('Employee not found')
    }
    return { ...employee }
  },

  async create(employeeData) {
    await delay(400)
    const newEmployee = {
      ...employeeData,
      id: Date.now(),
      employeeNumber: `EMP${String(Date.now()).slice(-6)}`,
      profilePhoto: null
    }
    employees.push(newEmployee)
    return { ...newEmployee }
  },

  async update(id, employeeData) {
    await delay(350)
    const index = employees.findIndex(emp => emp.id === id)
    if (index === -1) {
      throw new Error('Employee not found')
    }
    const updatedEmployee = { ...employees[index], ...employeeData }
    employees[index] = updatedEmployee
    return { ...updatedEmployee }
  },

  async delete(id) {
    await delay(250)
    const index = employees.findIndex(emp => emp.id === id)
    if (index === -1) {
      throw new Error('Employee not found')
    }
    employees.splice(index, 1)
    return true
  }
}

export default employeeService