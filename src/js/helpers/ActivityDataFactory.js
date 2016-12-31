import activities from '../activity'
import ActivityData from '../models/ActivityData'

export default {
  createForType (activityType) {
    switch (activityType) {
      case activities.types.PeoplePlacesThings: return peoplePlacesThingsData()
      case activities.types.Actions: return actionsData()
      case activities.types.Paraphrase: return paraphraseData()
      case activities.types.Space: return spaceData()
      default: ActivityData.new()
    }
  }
}

function peoplePlacesThingsData () {
  var data = ActivityData.new()
  data.addContainer('PEOPLE', 'word-selection')
  data.addContainer('PLACES', 'word-selection')
  data.addContainer('THINGS', 'word-selection')
  data.addContainer('OTHER', 'word-selection')
  return data
}

function actionsData () {
  var data = ActivityData.new()
  data.initCollection('map')
  return data
}

// Interpret
function paraphraseData () {
  var data = ActivityData.new()
  data.initCollection('free-text')
  return data
}

// Apply
function spaceData () {
  var data = ActivityData.new()
  data.addContainer('S', 'free-text')
  data.addContainer('P', 'free-text')
  data.addContainer('A', 'free-text')
  data.addContainer('C', 'free-text')
  data.addContainer('E', 'free-text')
  return data
}
