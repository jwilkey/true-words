export default {
  getPersistor: state => state.persistor,
  getCurrentBible: state => state.currentBible,
  getStudies: state => state.studies,
  getCurrentStudy: state => state.currentStudy,
  getCurrentActivity: state => state.currentActivity,
  getCurrentWords: state => state.currentStudy.getWords()
}
