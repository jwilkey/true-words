import Vue from 'vue'
import Vuex from 'vuex'
import activities from '../src/js/activity'
import getters from './getters'
import actions from './actions'
import Persistence from '../src/js/helpers/Persistor'
import Studies from '../src/js/models/Study'
import { Bible } from '../src/js/bible'
import john3 from '../src/js/fixtures/john3_study.json'

// Make vue aware of Vuex
Vue.use(Vuex)

var defaultStudy = Studies.fromJson(john3)

// Create an object to hold the initial state when the app starts up
export const state = {
  page: 'home',
  persistor: new Persistence.Persistor(),
  platform: 'web',
  isAuthenticated: false,
  user: {},
  currentBible: 'ESV',
  studies: [defaultStudy],
  currentStudy: undefined,
  currentActivity: activities.types.PeoplePlacesThings,
  currentPassage: undefined,
  activities: []
}

// Create an object storing various mutations. We will write the mutation
export const mutations = {
  SET_PERSISTANCE_STRATEGY (state, persistenceStrategy) {
    if (persistenceStrategy !== undefined) {
      state.persistor = new Persistence.Persistor(persistenceStrategy)
    }
  },
  SET_PLATFORM (state, platform) {
    state.platform = platform
  },
  SET_IS_AUTHENTICATED (state, isAuthed) {
    state.isAuthenticated = isAuthed
  },
  SET_USER (state, user) {
    state.user = user
  },
  SET_STUDIES (state, studies) {
    state.studies = studies
  },
  CURRENT_BIBLE (state, bible) {
    state.currentBible = bible
  },
  CLEAR_DATA (state) {
    state.page = 'home'
    state.persistor = new Persistence.Persistor()
    state.isAuthenticated = false
    state.user = {}
    state.studies = []
    state.currentStudy = undefined
    state.currentActivity = activities.types.PeoplePlacesThings
    state.currentPassage = undefined
    state.activities = []
  },
  CREATE_STUDY (state, study) {
    state.studies.push(study)
    state.currentStudy = study
  },
  CURRENT_ACTIVITY (state, activityType) {
    state.currentActivity = activityType
  },
  CURRENT_STUDY (state, studyObject) {
    for (var i = 0; i < state.studies.length; i++) {
      if (state.studies[i].id === studyObject.id) {
        state.currentStudy = state.studies[i]
        state.currentStudy.apply(studyObject)
        return
      }
    }
    var passage = new Bible.Passage(studyObject.passage)
    var study = Studies.createStudy(studyObject.id, studyObject.date, passage, studyObject.verses, studyObject.bible)
    study.apply(studyObject)
    state.studies.push(study)
    state.currentStudy = study
  },
  ACTIVITY_SAVE (state, activityAchievement) {
    state.currentStudy.saveActivity(activityAchievement)
  }
}

// Combine the initial state and the mutations to create a Vuex store.
// This store can be linked to our app.
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
