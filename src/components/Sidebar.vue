<template>
  <div class="sidebarbox" :class="{'is-open': isOpen}">
    <div class="sidebar">
      <div class="tasklist">
        <!--addNew-->
        <div class="addNew" v-if="menu === 'addNew'">
          <p class="font font-h3">ADD NEW TASK</p>
          <hr>
          <p class="font font-h5 totaltitle">TASK TITLE</p>
          <form>
            <label for=""></label>
            <input type="text" placeholder="Input Your Task Name" v-model="newTodoTemp.title" @keyup.enter="addTodo">
          </form>
          <p class="font font-h5 totaltitle">ESTIMATE TOMATO</p>
          <div class="tomato-count" v-for="index in setting.maxTimer" :key="index" @click="newTodoTemp.timerTotal = index">
            <img v-if="newTodoTemp.timerTotal >= index" src="@/assets/stylesheets/image/tomato_small_color.svg" class="tomato-single">
            <img v-else src="@/assets/stylesheets/image/tomato_small_gray.svg" class="tomato-single">
          </div>
          <div class="btn btn-primary" @click="addTodo">ADD TASK</div>
        </div>
        <!--list-->
        <div class="list" v-if="menu === 'list'">
          <p class="font font-h3">TASK LISTS</p>
          <hr>
          <div class="badge-group">
            <div class="badge badge-secondary-light"
            :class="{'active':visibility === 'todo'}"
            @click.prevent="visibility = 'todo'">TODO</div>
            <div class="badge badge-secondary-light"
            :class="{'active':visibility === 'done'}"
            @click.prevent="visibility = 'done'">DONE</div>
          </div>
          <ul>
            <li v-for="todo in filterTodos" :key="todo.id" @click="$emit('choose-todo', todo)">
              <div class="listTitle">
                <div>
                  <i class="far fa-check-circle"></i> 
                  <p class="font font-h4">{{todo.title}}</p>
                </div>
                <i class="fas fa-ellipsis-h" @click="editTodo(todo)"></i>
              </div>
              <div v-if="todo.id === editingTodos.id">
                <div class="listContent">
                <p class="font font-h5 totaltitle">TASK TITLE</p>
                <form>
                  <label for=""></label>
                  <input type="text"
                  v-model="editingTitle" @keyup.enter="saveTodo(todo)">
                </form>
                <p class="font font-h5 totaltitle">ESTIMATE TOMATO</p>
                <div class="tomato-count" v-for="index in todo.timerTotal" :key="index">
                  <img src="@/assets/stylesheets/image/tomato_small_color.svg" class="tomato-single">
                  <!-- <img src="@/assets/stylesheets/image/noneTomato.png" class="tomato-single"> -->
                </div>
                </div>
                <div class="listBtnGroup">
                  <div class="btn btn-secondary-light" @click="$emit('remove-todo', todo.id)">DELETE</div>
                  <div class="btn btn-success-state" @click="$emit('done-todo', todo.id)">DONE</div>
                  <div class="btn btn-primary" @click="saveTodo(todo)">SAVE</div>
                </div>
              </div>
              
            </li>
          </ul>
        </div>
        <!--graph-->
        <div class="graph" v-if="menu === 'graph'">
          <p class="font font-h3">ANALYTICS REPORT</p>
          <hr>
          <p class="font font-h5 totaltitle">TOMATO OF THIS WEEK</p>
          <div class="total">
            <div class="tomatos">
              <p class="font font-text">{{weekDateStatusLogArr[0].completedSum}}</p>
              <p class="font font-h7">TODAY</p>
            </div>
            <div class="weekly">
              <p class="font font-text">{{weekTotal}}</p>
              <p class="font font-h7">{{weekDateStatusLogArr[0].shortDateStr}}-{{weekDateStatusLogArr[6].shortDateStr}}</p>
            </div>
          </div>
          <p class="font font-h5 totaltitle">CHART
            <span class="font-h7">  {{weekDateStatusLogArr[0].shortDateStr}}-{{weekDateStatusLogArr[6].shortDateStr}}</span>
          </p>
          <div class="chart">
            <!-- <div class="chart-inside"></div> -->
          </div>
          <div class="day">
            <p class="font font-h7" v-for="(day,index) in weekDateStatusLogArr" :key="index">{{day.shortDateStr}}</p>
          </div>
          <div class="week">
            <p class="font font-h7" v-for="(day,index) in weekDateStatusLogArr" :key="index">{{day.shortDayStr}}</p>
          </div>
          <div class="graphBtn">
            <div class="btn-outline btn-outline-oprimary">PREV</div>
            <div class="btn-outline btn-outline-oprimary">NEXT</div>
          </div>
        </div>
        <!--music-->
        <div class="music" v-if="menu === 'music'">
          <p class="font font-h3">RING TONG</p>
          <hr>
          <ul>
            <li>
              <div class="listTitle">
                <div>
                  <i class="far fa-check-circle"></i> 
                  <p class="font-h4">Ring tone1</p>
                </div>
                <i class="far fa-play-circle"></i>
              </div>
              
            </li>
          </ul>
        </div>
      </div>
      <div class="toolbar">
        <ul>
          <li @click="transferMenu('addNew')"><i href="#" class="fas fa-plus-circle"></i></li>
          <li @click="transferMenu('list')"><i href="#" class="fas fa-bars"></i></li>
          <li @click="transferMenu('graph')"><i href="#" class="fas fa-chart-bar"></i></li>
          <li @click="transferMenu('music')"><i href="#" class="fas fa-music"></i></li>
        </ul>
        <!--toggleButton-->
        <div class="tomatoIcon" @click="isOpen = !isOpen">
          <div>
            <img src="@/assets/stylesheets/image/tomato_small_color.svg" alt="">
            <i class="fas fa-arrow-right" v-if="!isOpen"></i>
            <i class="fas fa-arrow-left" v-if="isOpen"></i>
            <p class="font font-h3 startText">開始番茄鐘</p>
          </div> 
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as d3 from 'd3'
export default {
  props: {
    setting: {
      type: Object,
      required: true
    },
    todos: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isOpen: false,
      menu: 'addTask',
      newTodoTemp: {
        title: '',
        timerTotal: 1
      },
      visibility: 'todo',
      editingTodos: {},
      editingTitle: '',
      weekDateStatusLogArr: [],
      weekTotal: 0
    }
  },
  computed: {
    filterTodos () {
      return this.todos.filter(todo => {
        switch (this.visibility) {
          case 'todo':
            return !todo.completed
          case 'done':
            return todo.completed
          default:
            return []
        }
      })
    }
  },
  watch: {
    menu (newValue) {
      switch (newValue) {
        case 'graph':
          this.dayTomatoCount()
          this.weekTomatoCount()
          this.$nextTick(() => this.getChart())
      }
    }
  },
  methods: {
    transferMenu (section) {
      this.menu = section
      this.isOpen = true
    },
    addTodo () {
      this.$emit('add-todo', this.newTodoTemp)
    },
    editTodo (todo) {
      this.editingTodos = todo
      this.editingTitle = todo.title
    },
    saveTodo (todo) {
      this.$emit('edit-todo', todo)
    },
    dayTomatoCount () {
      const shortDayStrArr = ['SUN', 'MON', 'TUE', 'WED', 'THR', 'FRI', 'SAT']
      let getFullDate = d => {
        let date = new Date(d)
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
      }
      // 現在(今天)的時間
      let tempNowDate = getFullDate(new Date())
      for (let i = 0; i < 7; i++) {
        // 將(今天-6) (今天-5)...
        const timestamp = new Date(new Date().valueOf() - 86400000 * (6 - i))
        // console.log(timestamp)
        // '9/24'
        const shortDateStr = `${timestamp.getMonth() + 1}/${timestamp.getDate()}`
  
        if (!this.weekDateStatusLogArr[i]) {
          this.weekDateStatusLogArr[i] = {}
        }
        // 將'9/18' '9/19'...放進陣列
        this.weekDateStatusLogArr[i].shortDateStr = shortDateStr
        this.weekDateStatusLogArr[i].shortDayStr = shortDayStrArr[timestamp.getDay()]
        this.weekDateStatusLogArr[i].completedSum = 0
        console.log(this.weekDateStatusLogArr[0].shortDateStr)
      }
      
      this.todos.forEach(todo => {
        const todoDate = getFullDate(new Date(todo.date))
        if (todo.completed){
          //拿今天去減掉過去
          const dueDateNum = Math.floor((new Date(tempNowDate).valueOf() - new Date(todoDate).valueOf()) / 86400000)
          // console.log(dueDateNum)
          if (dueDateNum < 7) {
            // console.log(todo, dueDateNum, todoDate)
            this.weekDateStatusLogArr[(6 - dueDateNum)].completedSum++
          }
          // countAll = countAll + e.timerTotal
        }
      })
      
      // finishTomato = countAll
      // this.listData.push(finishTomato)
    },
    weekTomatoCount () {
      this.weekTotal = this.weekDateStatusLogArr.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.completedSum
      }, 0)
    },
    getChart () {
      d3.select('.chart')
        .selectAll(".chart-inside")
        .data(this.weekDateStatusLogArr.map(log => log.completedSum))
        .enter()
        .text(function (d) { return d})
        .append('div')
        .attr('class', 'bar')
        .style('height', (d => { //將data的值取出作為高
          return `${d * 20}px`
        }))
    },
  }
}
</script>
