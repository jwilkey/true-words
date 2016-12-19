import activities from '../activity'
import ActivityData from '../models/ActivityData'

export default {
  createForType (activityType) {
    switch (activityType) {
      case activities.types.PeoplePlacesThings: return peoplePlacesThingsData()
      case activities.types.Actions: return actionsData()
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
