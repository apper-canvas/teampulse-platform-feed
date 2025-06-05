import organizationData from '../mockData/organization.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let organizations = [...organizationData]

const organizationService = {
  async getAll() {
    await delay(250)
    return [...organizations]
  },

  async getById(id) {
    await delay(200)
    const organization = organizations.find(org => org.id === id)
    if (!organization) {
      throw new Error('Organization not found')
    }
    return { ...organization }
  },

  async create(organizationData) {
    await delay(400)
    const newOrganization = {
      ...organizationData,
      id: Date.now()
    }
    organizations.push(newOrganization)
    return { ...newOrganization }
  },

  async update(id, organizationData) {
    await delay(350)
    const index = organizations.findIndex(org => org.id === id)
    if (index === -1) {
      throw new Error('Organization not found')
    }
    const updatedOrganization = { ...organizations[index], ...organizationData }
    organizations[index] = updatedOrganization
    return { ...updatedOrganization }
  },

  async delete(id) {
    await delay(250)
    const index = organizations.findIndex(org => org.id === id)
    if (index === -1) {
      throw new Error('Organization not found')
    }
    organizations.splice(index, 1)
    return true
  }
}

export default organizationService