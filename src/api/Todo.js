import Vue from 'vue'

const TodoUrl = '/api/memo/todo/'

export async function searchTodo(data){
  return Vue.axios.get(`${TodoUrl}`, { params: data })
}

export async function selectTodo(id){
  return Vue.axios.get(`${TodoUrl}${id}`)
}

export async function createTodo(data){
  return Vue.axios.post(`${TodoUrl}`, data)
}

export async function copyTodo(id, data){
  return Vue.axios.post(`${TodoUrl}${id}`, data)
}

export async function updateTodo(id, data){
  return Vue.axios.put(`${TodoUrl}${id}`, data)
}

export async function deleteTodo(id){
  return Vue.axios.delete(`${TodoUrl}${id}`)
}
