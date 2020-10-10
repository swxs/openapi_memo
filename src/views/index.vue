<template>
  <div id="main">
    <el-calendar v-show="status === 'calendar'">
      <template slot="dateCell" slot-scope="{ date, data }">
        <p class="time">{{ data.day.slice(5, 10) }}</p>
        <el-tag
          v-for="(todo, index) in todos"
          v-if="todo.created.slice(0, 10) === data.day"
          closable
          @click="showTimeline(data.day)"
          @close="delete_todo(todo.id)"
          :label="todo.title"
          size="mini"
          >{{ todo.title }}</el-tag
        >

        <el-button
          v-if="data.day === today()"
          class="button-new-tag"
          size="mini"
          @click="showDialog"
          >+ Tag</el-button
        >
      </template>
    </el-calendar>

    <el-timeline v-show="status === 'timeline'">
      <el-timeline-item
        v-for="(todo, index) in todos"
        :key="index"
        :timestamp="todo.created"
      >
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ todo.title }}</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="showDialog"
              >+ Tag</el-button
            >
          </div>
          {{ todo.document }}
        </el-card>
      </el-timeline-item>
    </el-timeline>

    <el-button id="changer" @click="changeStatus">
      C
    </el-button>

    <el-dialog title="Todo" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input
            v-model="form.document"
            type="textarea"
            :rows="4"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add_todo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { searchTodo, selectTodo, createTodo, deleteTodo } from '../api/Todo.js'
import { MessageBox } from 'element-ui'

Date.prototype.format = function(fmt) {
  var o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

export default {
  name: 'home',
  data() {
    return {
      status: 'timeline',
      // status: 'calendar',
      todos: [],
      activities: [],
      form: {
        title: '',
        document: '',
      },
      dialogFormVisible: false,
      dialogTimelineVisible: false,
      formLabelWidth: '120px',
    }
  },
  computed: {},
  components: {},

  methods: {
    today() {
      let td = new Date()
      return td.format('yyyy-MM-dd')
    },
    async add_todo() {
      if (this.form.title === '' || this.form.doucment === null) {
        return false
      }
      let data = {
        title: this.form.title,
        document: this.form.document,
      }
      const todo = await createTodo(data)
      const result = await selectTodo(todo.data.id)
      this.todos.splice(0, 0, result.data.data)
      this.dialogFormVisible = false
    },
    async delete_todo(todoId) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const result = await deleteTodo(todoId)
          this.todos.splice(
            this.todos.findIndex((item) => item.id === todoId),
            1
          )
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    showTimeline(day) {
      this.activities = []
      for (let todo of this.todos) {
        if (todo.created.slice(0, 10) == day) {
          this.activities.push(todo)
        }
      }
      this.dialogTimelineVisible = true
    },
    showDialog() {
      this.form = {
        title: '',
        document: '',
      }
      this.dialogFormVisible = true
    },
    changeStatus() {
      if (this.status === 'calendar') {
        this.status = 'timeline'
      } else if (this.status === 'timeline') {
        this.status = 'calendar'
      }
    },
  },
  created() {},
  async mounted() {
    let result = await searchTodo({ use_pager: 0, order_by: '-created' })
    this.todos = result.data.data
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
.el-calendar-table {
  .el-calendar-day {
    padding: 4px;
  }
}

.time {
  font-size: 12px;
}

#changer {
  position: fixed; //关键
  height: 40px;
  width: 40px;
  bottom: 50px;
  right: 50px;
  background: #b4d145;
  color: #fff;
}
</style>
