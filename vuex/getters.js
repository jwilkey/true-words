export default {
  getPersistor: state => state.persistor,
  getUser: state => state.user,
  getCurrentBible: state => state.currentBible,
  getStudies: state => state.studies,
  getCurrentStudy: state => state.currentStudy,
  getCurrentActivity: state => state.currentActivity,
  getCurrentWords: state => state.currentStudy.getWords()
}
