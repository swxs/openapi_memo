<template>
  <div id="main">
    <ul class="item_block">
      <li class="item_item page_color_yellow">
        <span class="content_block WD_w2 MB_w4">
          <input
            type="text"
            title="title"
            class="input_text"
            id="title"
            placeholder="输入标题"
            v-model="title"
          />
        </span>
        <span class="content_block WD_w7 MB_w4">
          <input
            type="text"
            title="document"
            class="input_text"
            id="document"
            placeholder="输入内容"
            v-model="document"
          />
        </span>
        <span class="content_block WD_w1 MB_w2 tc">
          <i
            class="iconfont icon-xiugai util_add"
            title="点击添加记录"
            @click="add_todo"
          ></i>
        </span>
      </li>
      <template v-for="(lock, index) in todos">
        <li class="item_item page_color_yellow" :data-id="lock.id">
          <span class="content_block WD_w2 MB_w4">{{ lock.title }}</span>
          <span class="content_block WD_w6 MB_w2">
            <a class="link" :href="lock.document" target="_blank">
              <span class="MB_hide">{{ lock.document }}</span>
              <i
                class="iconfont icon-tiaozhuan WD_hide"
                :title="lock.document"
              ></i>
            </a>
          </span>
          <span class="content_block WD_w1 MB_w2 tc">
            <i
              class="iconfont icon-cuowu util_delete"
              title="点击删除记录"
              @click="delete_lock(lock.id)"
            ></i>
          </span>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import {
  searchTodo,
  selectTodo,
  createTodo,
  deleteTodo,
} from '../api/Todo.js'

export default {
  name: 'home',
  data() {
    return {
      id: '',
      title: null,
      document: null,
      todos: [],
    }
  },
  computed: {},
  components: {},
  created() {},
  async mounted() {
    let result = await searchTodo({ use_pager: 0, order_by: "-created"})
    this.todos = result.data
  },
  methods: {
    copy(todoId, value) {
      let ele = document.getElementById(todoId)
      ele.value = value
      ele.focus()
      ele.select()
      document.execCommand('Copy')
    },
    async add_todo() {
      if (this.title === '' || this.title === null) {
        return false
      }
      let data = {
        title: this.title,
        document: this.document,
      }
      const todoId = await createTodo(data)
      const result = await selectTodo(todoId)
      this.todos.splice(0, 0, result)
      this.title = ''
      this.document = ''
    },
    async delete_lock(lockId) {
      const result = await deleteTodo(lockId)
      this.todos.splice(this.todos.findIndex((item) => item.id === lockId), 1)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@media (min-width: 500px) {
  #main {
    padding: 40px 100px;
  }
}
.content_block {
  text-align: left;
}
.for_copy {
  position: absolute;
  left: -9999px;
}
</style>
