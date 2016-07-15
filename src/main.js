import 'bootstrap/dist/css/bootstrap.min.css'
import Vue from 'vue'

import App from './App'
import Home from './pages/Home'
import PassageChooser from './pages/PassageChooser'
import PassageViewer from './components/PassageViewer'
import Activities from './pages/Activities'
import Activity from './pages/Activity'

import VueRouter from 'vue-router'

Vue.use(VueRouter)
export var router = new VueRouter()

router.map({
  '/': {
    component: Home
  },
  '/passage': {
    component: PassageViewer
  },
  '/choosepassage': {
    component: PassageChooser
  },
  '/viewpassage': {
    component: PassageViewer
  },
  '/activities': {
    component: Activities
  },
  '/activity': {
    component: Activity
  }
})

// Redirect to the home route if any routes are unmatched
router.redirect({
  '*': '/'
})

router.start(App, '#app')

var $ = require('jquery')
window.jQuery = window.$ = $
require('bootstrap')
