import timeOffData from '../mockData/timeOffRequest.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let timeOffRequests = [...timeOffData]

const timeOffService = {
  async getAll() {
    await delay(300)
    return [...timeOffRequests]
  },

  async getById(id) {
    await delay(200)
    const request = timeOffRequests.find(req => req.id === id)
    if (!request) {
      throw new Error('Time off request not found')
    }
    return { ...request }
  },

  async create(requestData) {
    await delay(400)
    const newRequest = {
      ...requestData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }
    timeOffRequests.push(newRequest)
    return { ...newRequest }
  },

  async update(id, requestData) {
    await delay(350)
    const index = timeOffRequests.findIndex(req => req.id === id)
    if (index === -1) {
      throw new Error('Time off request not found')
    }
    const updatedRequest = { ...timeOffRequests[index], ...requestData }
    timeOffRequests[index] = updatedRequest
    return { ...updatedRequest }
  },

  async delete(id) {
    await delay(250)
    const index = timeOffRequests.findIndex(req => req.id === id)
    if (index === -1) {
      throw new Error('Time off request not found')
    }
    timeOffRequests.splice(index, 1)
    return true
  }
}

export default timeOffService