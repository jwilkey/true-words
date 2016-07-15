export const createNewStudy = function ({dispatch, state}, passage, versesArray) {
  dispatch('CREATE_STUDY', passage, versesArray)
}

export const setCurrentStudy = function ({ dispatch, state }, studyID) {
  dispatch('CURRENT_STUDY', studyID)
}

export const setCurrentActivity = function ({ dispatch, state }, activityType) {
  dispatch('CURRENT_ACTIVITY', activityType)
}

export const setCurrentWords = function ({ dispatch, state }, text) {
  dispatch('CURRENT_WORDS', text.split(' '))
}

export const saveActivity = function ({ dispatch, state }, activityID, activityData) {
  dispatch('ACTIVITY_SAVE', activityID, activityData)
}
