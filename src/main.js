import 'bootstrap/dist/css/bootstrap.min.css'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Analytics from './js/helpers/AnalyticsHelper'

import store from '../vuex/store'
import App from './App'
import Login from './pages/Login'
import Home from './pages/Home'
import BibleChooser from './pages/BibleChooser'
import PassageChooser from './pages/PassageChooser'
import PassageViewer from './pages/PassageViewer'
import Studies from './pages/Studies'
import Activities from './pages/Activities'
import Activity from './pages/Activity'
import Reader from './components/prepare/Reader'
import Hymns from './components/prepare/Hymns'
import Hymn from './components/prepare/Hymn'
import SettingsPage from './components/settings/SettingsPage'

var $ = require('jquery')
window.jQuery = window.$ = $

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/settings', component: SettingsPage, name: 'Settings' },
  { path: '/passage', component: PassageViewer, name: 'PassageViewer' },
  { path: '/bible_chooser', component: BibleChooser, name: 'BibleChooser' },
  { path: '/choosepassage', component: PassageChooser, name: 'PassageChooser' },
  { path: '/viewpassage', component: PassageViewer, name: 'PassageViewer' },
  { path: '/studies', component: Studies, name: 'Studies' },
  { path: '/activities', component: Activities, name: 'Activities' },
  { path: '/activity', component: Activity, name: 'Activity' },
  { path: '/reader', component: Reader, name: 'Reader' },
  { path: '/hymns', component: Hymns, name: 'Hymns' },
  { path: '/hymn', component: Hymn, name: 'Hymn' },
  { path: '*', redirect: '/', name: 'RedirectHome' }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (['/activity', '/activities', '/reader'].indexOf(to.path) !== -1) {
    if (store.getters.getCurrentStudy === undefined) {
      next('/')
      return
    }
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
  computed: {
    isSignedIn () {
      return this.$root.$children[0].isAuthenticated
    },
    isLoadingData () {
      return this.$root.$children[0].isLoadingPersistedData
    }
  },
  methods: {
    log (message) {
      console.log(message)
    },
    refreshData () {
      this.$root.$children[0].refreshPersistedData()
    },
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
