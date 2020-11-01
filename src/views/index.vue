<template>
  <div id="main">
    <el-calendar v-show="status === 'calendar'" id="calendar">
      <template slot="dateCell" slot-scope="{ date, data }">
        <p class="time">{{ data.day.slice(5, 10) }}</p>
        <el-tag
          v-for="(todo, index) in todos"
          v-if="todo.created.slice(0, 10) === data.day"
          :label="todo.title"
          @click="showDialog(todo)"
          @close="delete_todo(todo.id)"
          size="mini"
          closable
        >
          {{ todo.title }}
        </el-tag>

        <el-button
          v-if="data.day === today()"
          class="button-new-tag button-add"
          size="mini"
          @click="showDialog(null)"
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
              style="float: right; padding: 3px 0;"
              type="text"
              @click="delete_todo(todo.id)"
            >
              删除
            </el-button>
            <el-button
              style="float: right; padding: 3px 0; margin-right: 20px;"
              type="text"
              @click="showDialog(todo)"
            >
              修改
            </el-button>
          </div>
          <div v-html="todo.document"></div>
        </el-card>
      </el-timeline-item>
    </el-timeline>

    <el-button id="changer" @click="changeStatus" class="iconfont icon-xiugai">
    </el-button>

    <el-dialog title="Todo" :visible.sync="dialogFormVisible" id="dialog">
      <el-form :model="form">
        <el-form-item label="标题">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <editor-bar v-model="form.document" :isClear="isClear"></editor-bar>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add_or_update_todo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { MessageBox } from 'element-ui'
import EditorBar from './components/EditorBar'
import {
  searchTodo,
  selectTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../api/Todo.js'

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
      todos: [],
      activities: [],
      form: {
        id: null,
        title: '',
        document: '',
      },
      isClear: true,
      dialogFormVisible: false,
      dialogTimelineVisible: false,
    }
  },
  computed: {},
  components: {
    'editor-bar': EditorBar,
  },
  methods: {
    today() {
      let td = new Date()
      return td.format('yyyy-MM-dd')
    },
    async add_or_update_todo() {
      if (this.form.title === '' || this.form.doucment === '') {
        return false
      }
      let data = {
        title: this.form.title,
        document: this.form.document,
      }
      if (this.form.id === null) {
        const todo = await createTodo(data)
        const result = await selectTodo(todo.data.id)
        this.todos.splice(0, 0, result.data.data)
        this.dialogFormVisible = false
      } else {
        const todo = await updateTodo(this.form.id, data)
        const result = await selectTodo(todo.data.id)
        this.todos.splice(
          this.todos.findIndex((_todo) => _todo.id === result.data.data.id),
          1,
          result.data.data
        )
        this.dialogFormVisible = false
      }
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
    showDialog(todo) {
      if (todo === null) {
        this.form = {
          id: null,
          title: '',
          document: '',
        }
      } else {
        this.form = {
          id: todo.id,
          title: todo.title,
          document: todo.document,
        }
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
<style lang="less">
#main {
  #calendar {
    .time {
      font-size: 12px;
    }

    .el-calendar-table {
      .el-calendar-day {
        padding: 4px;
      }
    }

    .el-tag {
      margin-right: 5px;
    }

    .button-add {
      padding: 0 5px;
      height: 20px;
      line-height: 19px;
    }
  }

  #changer {
    position: fixed; //关键
    height: 30px;
    width: 30px;
    bottom: 50px;
    left: 0;
    right: auto;
    background: #b4d145;
    color: #fff;
    padding: 0;
    font-size: 20px;
  }

  #dialog {
    .el-form-item__label {
      text-align: left;
      width: 100%;
    }
    .el-form-item__content {
      margin-left: 0;
    }
    .el-dialog {
      margin: 0;
      width: 100%;
    }
  }
}

@media (min-width: 500px) {
  #main {
    padding: 40px 100px;

    #dialog {
      .el-form-item__label {
        text-align: right;
        width: 120px;
      }
      .el-form-item__content {
        margin-left: 120px;
      }
      .el-dialog {
        margin: 0 auto 50px;
        width: 70%;
      }
    }

    #changer {
      height: 40px;
      width: 40px;
      left: auto;
      right: 50px;
      font-size: 38px;
    }
  }
}
</style>
