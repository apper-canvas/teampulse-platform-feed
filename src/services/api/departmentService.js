import departmentData from '../mockData/department.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let departments = [...departmentData]

const departmentService = {
  async getAll() {
    await delay(250)
    return [...departments]
  },

  async getById(id) {
    await delay(200)
    const department = departments.find(dept => dept.id === id)
    if (!department) {
      throw new Error('Department not found')
    }
    return { ...department }
  },

  async create(departmentData) {
    await delay(400)
    const newDepartment = {
      ...departmentData,
      id: Date.now()
    }
    departments.push(newDepartment)
    return { ...newDepartment }
  },

  async update(id, departmentData) {
    await delay(350)
    const index = departments.findIndex(dept => dept.id === id)
    if (index === -1) {
      throw new Error('Department not found')
    }
    const updatedDepartment = { ...departments[index], ...departmentData }
    departments[index] = updatedDepartment
    return { ...updatedDepartment }
  },

  async delete(id) {
    await delay(250)
    const index = departments.findIndex(dept => dept.id === id)
    if (index === -1) {
      throw new Error('Department not found')
    }
    departments.splice(index, 1)
    return true
  }
}

export default departmentService