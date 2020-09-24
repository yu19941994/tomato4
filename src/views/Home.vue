<template>
  <div class="home">
    <div class="wrap" :class="{'open': false}">
      <!--Sidebar-->
      <sidebar
        :setting="setting" 
        :todos="todos"
        @add-todo="addTodo"
        @edit-todo="editTodo" 
        @choose-todo="chooseTodo"
      ></sidebar>
      <!-- container -->
      <div class="container" v-if="activeTodo">
        <div class="container-inside">
          <h1 class="font-h2">{{activeTodo.title}}</h1>        
          <div class="tomato-container">
            <p class="badge-relax font font-h7" v-if="control.status === 'relax'">BREAK</p>
            <!-- <template v-for="index in activeTodo.timerTotal" v-else>
              <img v-if="index <= (activeTodo.timerTotal - activeTodo.timerCount)" 
              src="@/assets/stylesheets/image/tomato_small_color.svg" class="tomato-single" :key="index">
              <img v-else src="@/assets/stylesheets/image/tomato_small_gray.svg" class="tomato-single" :key="index">
            </template> -->
            <template v-else>
              <svg height="12" weight="12" v-for="index in activeTodo.timerTotal" :key="index" class="tomato-progress">
                <circle v-if="index <= (activeTodo.timerTotal - activeTodo.timerCount)" 
                  class="bg"
                  cx="6"
                  cy="6"
                  r="5"
                  stroke="#ea5548"
                  stroke-width="3"
                  fill="#ea5548"
                  :stroke-dasharray="fillCircumference"
                  :stroke-dashoffset="fillProgress"
                />
                <circle v-else
                  class="bg"
                  cx="6"
                  cy="6"
                  r="5"
                  stroke="#ea5548"
                  stroke-width="1"
                  fill="#eaeaea"
                />
              </svg>
            </template>
          </div>
          <div class="count">
            <div class="clock">
              <svg height="300" weight="300">
                <circle
                  class="bg"
                  cx="150"
                  cy="150"
                  r="125"
                  stroke="#ACACAC"
                  stroke-width="50"
                  fill="#eaeaea"
                />
                <circle
                  class="loading"
                  cx="150"
                  cy="150"
                  r="125"
                  stroke-width="50"
                  :stroke="control.status === 'relax' ? '#b5e254' : '#ea5548'"
                  fill="#eaeaea"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="progress"
                />
              </svg>
              <p class="font font-h1"><span>{{ control.minutes }}</span>:<span>{{ control.seconds }}</span></p>
            </div>
          </div>
          <div class="func-btn">
            <div class="circlebtn circlebtn-white" @click="startTimer()" v-if="isStart">
              <i class="fas fa-play"></i>
            </div>
            <div class="circlebtn circlebtn-white" @click="pauseTimer" v-else>
              <i class="fas fa-play"></i>
            </div>
            <div class="circlebtn circlebtn-white" @click="stopTimer">
              <i class="fas fa-pause"></i>
            </div>
            <div class="circlebtn circlebtn-white" @click="resetTimer">
              <i class="fas fa-undo-alt"></i>
            </div>
          </div>
          <div class="container-bottom">
            <img src="@/assets/stylesheets/image/complete.svg" alt="">
            <p class="font font-h5 subtitle">TASK COMPLETE</p>
          </div>
        </div>
      </div>
      <!-- container -->
      <div class="container" v-else>
        <div class="container-inside">
          <div class="circle">
            <p class="font-h2 circle-title">PODOMORO</p>
            <div class="oval"></div>
          </div>
         
          <p class="font font-h5 subtitle">You don't have any task now,<br>please add task first!</p>
         
        </div>
        
      </div>
      <!-- Modal -->
      <div class="modal" v-if="isShow">
        <div id="finish-modal" class="modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <p class="font font-h2">恭喜</p>
            </div>
            <div class="modal-body">
              <p class="font font-h4">您已完成番茄鐘</p>
            </div>
            <div class="modal-footer" >
              <div class="btn-alert">
                <div class="btn btn-secondary-light" @click="isShow = false">CANCEL</div>
                <div class="btn-lg btn-lg-primary" @click="doneClock(activeTodo)">DONE</div>
              </div>
            </div>
            </div>
          </div>
      </div>
      <!-- Modal -->
      <div class="modal" v-if="isFinish">
        <div id="finish-modal" class="modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <p class="font font-h2">休息一下吧</p>
            </div>
            <div class="modal-body">
              <p class="font font-h4">休息完再進入下個番茄</p>
            </div>
            <div class="modal-footer" >
              <div class="btn-alert">
                <div class="btn btn-success-state" @click="relaxStart">開始休息</div>
              </div>
            </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar'
// import $ from 'jquery'

export default {
  name: 'Home',
  components: {
    Sidebar
  },
  data () {
    return{
      setting: {
        maxTimer: 10,
        relaxTime: 5,
        // maxTime: 25 * 60,
        maxTime: 10,
        percentage: 100,
      },
      isShow: false,
      isStart: true,
      isFinish: false,
      timer: '',
      todos: [
        {
          id: 0,
          title: 'first',
          completed: false,
          timerCount: 0,
          timerTotal: 5,
          date: '2020/09/23 18:00:00'
        }, {
          id: 1,
          title: 'second',
          completed: false,
          timerCount: 2,
          timerTotal: 5,
          date: '2020/09/23 17:00:00'
        }, {
          id: 2,
          title: 'third',
          completed: false,
          timerCount: 0,
          timerTotal: 3,
          date: '2020/09/22 12:00:00'
        }, {
          id: 3,
          title: 'fourth',
          completed: false,
          timerCount: 0,
          timerTotal: 2,
          date: '2020/09/21 15:00:00'
        }, {
          id: 4,
          title: 'fiveth',
          completed: true,
          timerCount: 5,
          timerTotal: 5,
          date: '2020/09/23 18:00:00'
        }, {
          id: 5,
          title: 'sixth',
          completed: true,
          timerCount: 5,
          timerTotal: 5,
          date: '2020/09/21 18:00:00'
        }, {
          id: 6,
          title: 'first',
          completed: true,
          timerCount: 5,
          timerTotal: 5,
          date: '2020/09/21 18:00:00'
        }
      ],
      todayTotal: 0,
      now: new Date(),
      activeTodoId: '',
      globalId: 4,
      // control 是控制時鐘
      control: {
        status: 'default',
        time: 0,
        minutes: '',
        seconds: '',
        percentage: 100
      }
    }
  },
  methods: {
    countTime () {
      this.control.time--
      console.log(this.control.time)
      this.control.seconds = this.fixNumber(this.control.time % 60)
      this.control.minutes = this.fixNumber(Math.floor(this.control.time / 60))
      if (this.control.time === 0 && this.control.status === 'relax') {
        clearInterval(this.timer)
        this.resetTimer()
        this.startTimer()  
      }else if(this.control.time === 0 ){
        
        console.log(this.control.time)
        this.activeTodo.timerCount++
        if (this.activeTodo.timerCount < this.activeTodo.timerTotal) {
          this.isFinish = true
          this.resetTimer(false, 'relax')
          this.control.status = 'pause'
          // this.control.percentage = 0
          // if(this.isFinish === false){
          // this.relaxTimer()
          // }

          // this.startTimer()
        }else {
          this.isShow = true
          this.resetTimer()
        }
      }
    },
    relaxStart () {
      this.isFinish = false
      this.startTimer('relax')
    },
    rotate () {
      console.log(this.control.status)
      switch (this.control.status) {
        case 'relax':
          this.control.percentage = 100 * (this.control.time / this.setting.relaxTime)
          break
        case 'running':
          this.control.percentage = 100 * (this.control.time / this.setting.maxTime)
      }
      // if (this.control.status = 'relax') 
      // this.control.percentage = 100 * (this.control.time / this.setting.maxTime)
      // console.log(this.control.percentage)
    },
    fixNumber (num) {
      let strNum = String(num)
      if (strNum.length < 2) {
        return `0${strNum}`
      }
      return strNum
    },
    startTimer (mode = 'run') {
      switch (mode) {
        case 'run':
          this.isStart = false
          this.control.status = 'running'
          break
        case 'relax':
          this.control.status = 'relax'
      }
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.countTime()
        this.rotate()
      }, 1000)
    },
    // relaxTimer (item) {
      
    //   clearInterval(this.timer)
    //   this.timer = setInterval(() => {
    //     this.countTime()
    //     this.rotate()
    //   }, 1000)
    // },
    //暫停
    pauseTimer () {
      this.isStart = true
      clearInterval(this.timer)
      this.control.status = 'pause'
    },
    //歸0
    stopTimer () {
      clearInterval(this.timer)
      this.resetTimer()
      this.control.status = 'stop'
    },
    resetTimer (isBtnTrigger, mode = 'run') {
      clearInterval(this.timer)
      console.log('reset')
      if (isBtnTrigger) {
        this.pauseTimer()
      }      
      switch (mode) {
        case 'run': // 要回到default時鐘
          this.control.time = this.setting.maxTime
          break
        case 'relax': // 把時間設定成休息時間
          this.control.time = this.setting.relaxTime
      }
      this.control.percentage = 100
      this.control.seconds = this.fixNumber(this.control.time % 60)
      this.control.minutes = this.fixNumber(Math.floor(this.control.time / 60))
    },
    addTodo () {
      let title = this.newTodoTemp.title.trim() //裁減前後空白
      if(!title){
        return
      }
      this.todos.push({
        id: this.globalId++,
        title,
        completed: false,
        timerCount: 0,
        timerTotal: this.newTodoTemp.timerTotal,
        date : new Date()
      })
      this.newTodoTemp.title = ''
      this.newTodoTemp.timerTotal = 1
    },
    removeTodo (todoId) {
      let newIndex = this.todos.findIndex((item) => {
        return todoId === item.id
      })
      this.todos.splice(newIndex, 1)
    },
    doneTodo (todoId) {
      let todo = this.todos.find((item) => {
        return todoId === item.id
      })
      todo.completed = true
    },
    doneClock (e) {
      this.todos.completed = e.completed
      e.completed = true
      this.isShow = false
    },

    editTodo (item) {
      item.title = this.editingTitle
      this.editingTodos = {}
    },
    chooseTodo (todo) {
      this.activeTodoId = todo.id
    },
    // isSameWeek (){
    //   let countWeek = 0
    //   let oneDayTime = 1000*60*60*24
    //   let date = new Date()
    //   this.todos.forEach(e => {
    //     if(parseInt((parseInt(e.date.getTime()/oneDayTime)+4)/7) === parseInt((parseInt(date.getTime()/oneDayTime)+4)/7)){
    //       countWeek++   
    //     }
    //   })
    //   this.weekTotal = countWeek
    // }
  },
  computed: {
    circumference () {
      return 125*2*Math.PI
    },
    fillCircumference () {
      return 12*2*Math.PI
    },
    progress () {
      return this.circumference - this.circumference*this.control.percentage/100
    },
    fillProgress () {
      return this.fillCircumference - this.fillCircumference*this.control.percentage/100
    },
    activeTodo () {
      return this.todos.find(todo => todo.id === this.activeTodoId)
    }
  },
  created () {
    this.resetTimer()
    // this.todayTomatoCount()
  }
}
// </script>
// <style lang="scss" scoped>
// .sidebarbox .sidebar .tasklist  .chart {
//   min-height: 250px;
//   display: flex;
//   align-items: flex-end;
// }
// .sidebarbox .sidebar .tasklist .chart .bar {

// }
// </style>
