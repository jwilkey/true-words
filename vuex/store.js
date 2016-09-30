import Vue from 'vue'
import Vuex from 'vuex'
import activities from '../src/js/activity'

// Make vue aware of Vuex
Vue.use(Vuex)

// Create an object to hold the initial state when the app starts up
const state = {
  page: 'home',
  studies: [],
  currentStudy: undefined,
  currentActivity: activities.types.PeoplePlacesThings,
  currentWords: [],
  currentPassage: undefined,
  activities: []
}

// Create an object storing various mutations. We will write the mutation
const mutations = {
  CREATE_STUDY (state, passage, versesArray) {
    state.studies.push({id: uuid(), date: new Date(), passage: passage, verses: versesArray})
    state.currentStudy = passage
  },
  CURRENT_ACTIVITY (state, activityType) {
    state.currentActivity = activityType
  },
  CURRENT_STUDY (state, studyID) {
    for (var i = 0; i < state.studies.lenth; i++) {
      if (state.studies[i].id === studyID) {
        state.currentStudy = state.studies[i]
        break
      }
    }
  },
  CURRENT_WORDS (state, words) {
    state.currentWords = words
  },
  ACTIVITY_SAVE (state, activityType, activityData) {
    state.activities.push({type: activityType, studyID: state.currentStudy.id, data: activityData})
  }
}

// Combine the initial state and the mutations to create a Vuex store.
// This store can be linked to our app.
export default new Vuex.Store({
  state,
  mutations
})

function uuid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0
    var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
