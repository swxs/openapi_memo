const TodoUrl = '/api/memo/todo/'

export const searchTodo = (data) => {
  return new Promise(function(resolve, reject) {
    window.axios.get(`${TodoUrl}`, { params: data }).then((response) => {
      resolve(response)
    })
  })
}

export const selectTodo = (id) => {
  return new Promise(function(resolve, reject) {
    window.axios.get(`${TodoUrl}${id}/`).then((response) => {
      resolve(response.data)
    })
  })
}

export const createTodo = (data) => {
  return new Promise(function(resolve, reject) {
    window.axios.post(`${TodoUrl}`, data).then((response) => {
      resolve(response.data)
    })
  })
}

export const copyTodo = (id, data) => {
  return new Promise(function(resolve, reject) {
    window.axios.post(`${TodoUrl}${id}/`, data).then((response) => {
      resolve(response.data)
    })
  })
}

export const updateTodo = (id, data) => {
  return new Promise(function(resolve, reject) {
    window.axios.put(`${TodoUrl}${id}/`, data).then((response) => {
      resolve(response.data)
    })
  })
}

export const modifyTodo = (id, data) => {
  return new Promise(function(resolve, reject) {
    window.axios.patch(`${TodoUrl}${id}/`, data).then((response) => {
      resolve(response.data)
    })
  })
}

export const deleteTodo = (id) => {
  return new Promise(function(resolve, reject) {
    window.axios.delete(`${TodoUrl}${id}/`).then((response) => {
      resolve(response.data)
    })
  })
}
