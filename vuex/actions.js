import Studies from '../src/js/models/Study'

export default {
  setPersistenceStrategy (context, persistenceStrategy) {
    context.commit('SET_PERSISTANCE_STRATEGY', persistenceStrategy)
    context.getters.getPersistor.refreshData(function (studies, user) {
      context.commit('SET_STUDIES', studies)
      context.commit('SET_USER', user)
    })
  },
  setStudies ({ commit }, studies) {
    commit('SET_STUDIES', studies)
  },
  setCurrentBible ({ commit }, bible) {
    commit('CURRENT_BIBLE', bible)
  },
  createNewStudy (context, studyData) {
    var bible = context.getters.getCurrentBible
    var study = Studies.createStudy(uuid(), new Date(), studyData.passage, studyData.verses, bible)
    return context.getters.getPersistor.saveStudy(study)
    .done(function (data) {
      context.commit('CREATE_STUDY', study)
    })
  },
  setCurrentStudy ({ commit }, studyObject) {
    commit('CURRENT_STUDY', studyObject)
  },
  setCurrentActivity ({ commit }, activityType) {
    commit('CURRENT_ACTIVITY', activityType)
  },
  saveActivity (context, activityAchievement) {
    context.commit('ACTIVITY_SAVE', activityAchievement)
    return context.getters.getPersistor.updateStudy(context.getters.getCurrentStudy)
  }
}

function uuid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0
    var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}