import 'bootstrap/dist/css/bootstrap.min.css'
import Vue from 'vue'

import store from '../vuex/store'
import App from './App'
import Home from './pages/Home'
import BibleChooser from './pages/BibleChooser'
import PassageChooser from './pages/PassageChooser'
import PassageViewer from './components/PassageViewer'
import Activities from './pages/Activities'
import Activity from './pages/Activity'

import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home },
  { path: '/passage', component: PassageViewer },
  { path: '/bible_chooser', component: BibleChooser },
  { path: '/choosepassage', component: PassageChooser },
  { path: '/viewpassage', component: PassageViewer },
  { path: '/activities', component: Activities },
  { path: '/activity', component: Activity },
  { path: '*', redirect: '/' }
]

const router = new VueRouter({
  routes
})

// router.start(App, '#app')
var v = new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
v

var $ = require('jquery')
window.jQuery = window.$ = $
require('bootstrap')
require('./js/polyfill')
