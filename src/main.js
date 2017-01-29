import 'bootstrap/dist/css/bootstrap.min.css'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Analytics from './js/helpers/AnalyticsHelper'

import store from '../vuex/store'
import App from './App'
import Login from './pages/Login'
import Feedback from './pages/Feedback'
import Home from './pages/Home'
import BibleChooser from './pages/BibleChooser'
import PassageChooser from './pages/PassageChooser'
import PassageViewer from './pages/PassageViewer'
import Activities from './pages/Activities'
import Activity from './pages/Activity'

var $ = require('jquery')
window.jQuery = window.$ = $

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/feedback', component: Feedback, name: 'Feedback' },
  { path: '/passage', component: PassageViewer, name: 'PassageViewer' },
  { path: '/bible_chooser', component: BibleChooser, name: 'BibleChooser' },
  { path: '/choosepassage', component: PassageChooser, name: 'PassageChooser' },
  { path: '/viewpassage', component: PassageViewer, name: 'PassageViewer' },
  { path: '/activities', component: Activities, name: 'Activities' },
  { path: '/activity', component: Activity, name: 'Activity' },
  { path: '*', redirect: '/', name: 'RedirectHome' }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (['/activity', '/activities'].indexOf(to.path) !== -1) {
    if (store.getters.getCurrentStudy === undefined) {
      next('/')
      return
    }
    store.getters.getPersistor.refreshAuthorization(function (result) { })
  }
  next()
})

router.afterEach((to, from) => {
  if (to.name !== 'Activity') {
    Analytics.trackScreen(to.name)
  }
})

Vue.mixin({
  data () {
    return {
      analytics: Analytics
    }
  },
  methods: {
    alert (message, option) {
      $('#application').addClass('obscure')
      $('#alert-message').text(message)
      $('#alert').css('display', 'table')
      switch (option) {
        case 'ok': $('#alert').addClass('ok-alert')
          break
        case 'confirm': $('#alert').addClass('confirm-alert')
          break
        default: break
      }
    },
    dismissAlert () {
      $('#application').removeClass('obscure')
      $('#alert-message').text('')
      $('#alert').css('display', 'none')
      $('#alert').removeClass('ok-alert confirm-alert')
    },
    setAlertCallback (callback) {
      this.$root.$children[0].alertCallback = callback
    }
  },
  mounted: function () {
    var label = this.$options._componentTag
    Analytics.attach(label, this.$el)
  }
})

var v = new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
v

require('bootstrap')
require('./js/polyfill')
