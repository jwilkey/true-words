import Studies from '../src/js/models/Study'
import $ from 'jquery'

export default {
  setPersistenceStrategy (context, persistenceStrategy) {
    context.commit('SET_PERSISTANCE_STRATEGY', persistenceStrategy)
  },
  setPlatform ({ commit }, platform) {
    commit('SET_PLATFORM', platform)
  },
  setAuthenticated ({ commit }, isAuthenticated) {
    commit('SET_IS_AUTHENTICATED', isAuthenticated)
  },
  setUser ({ commit }, user) {
    commit('SET_USER', user)
  },
  setStudies ({ commit }, studies) {
    commit('SET_STUDIES', studies)
  },
  setCurrentBible ({ commit }, bible) {
    commit('CURRENT_BIBLE', bible)
  },
  clearData ({ commit }) {
    commit('CLEAR_DATA')
  },
  createNewStudy (context, studyData) {
    var bible = context.getters.getCurrentBible
    var study = Studies.createStudy(uuid(), new Date(), studyData.passage, studyData.verses, bible)
    return context.getters.getPersistor.saveStudy(study)
    .done(function (data) {
      context.commit('CREATE_STUDY', study)
    })
  },
  openStudy (context, studyID) {
    if (context.getters.getPersistor.isLoggedIn()) {
      return context.getters.getPersistor.loadStudy(studyID)
      .done(function (studyObject) {
        context.commit('CURRENT_STUDY', studyObject)
      })
    } else {
      var studies = context.getters.getStudies
      for (var i = 0; i < studies.length; i++) {
        if (studies[i].id === studyID) {
          context.commit('CURRENT_STUDY', studies[i])
          return $.when(studies[i])
        }
      }
      return $.when(new Error('Study not found!'))
    }
  },
  setCurrentStudy ({ commit }, studyObject) {
    commit('CURRENT_STUDY', studyObject)
  },
  setCurrentActivity ({ commit }, activityType) {
    commit('CURRENT_ACTIVITY', activityType)
  },
  saveActivity (context, activityAchievement) {
    context.commit('ACTIVITY_SAVE', activityAchievement)
    if (context.getters.getPersistor.isLoggedIn()) {
      return context.getters.getPersistor.updateStudy(context.getters.getCurrentStudy)
    } else {
      return $.when(console.log('Not saving activity, not logged in'))
    }
  }
}

function uuid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0
    var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
