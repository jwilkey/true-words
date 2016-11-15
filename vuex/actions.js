export default {
  createNewStudy ({commit}, passage, versesArray) {
    commit('CREATE_STUDY', passage, versesArray)
  },
  setCurrentStudy ({ commit }, studyID) {
    commit('CURRENT_STUDY', studyID)
  },
  setCurrentActivity ({ commit }, activityType) {
    commit('CURRENT_ACTIVITY', activityType)
  },
  setCurrentWords ({ commit }, text) {
    commit('CURRENT_WORDS', text.split(' '))
  },
  saveActivity ({ commit }, activityID, activityData) {
    commit('ACTIVITY_SAVE', activityID, activityData)
  }
}
