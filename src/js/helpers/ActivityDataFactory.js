import activities from '../activity'
import ActivityData, { Section } from '../models/ActivityData'
import { arrayLast } from '../polyfill'
import { WordRange } from '../bible'

export default {
  createForType (activityType, study) {
    switch (activityType) {
      case activities.types.PeoplePlacesThings: return peoplePlacesThingsData()
      case activities.types.Actions: return actionsData()
      case activities.types.Outline: return outlineData(study)
      case activities.types.Paraphrase: return paraphraseData()
      case activities.types.Space: return spaceData()
      default: throw new Error('No ActivityData for this activity type')
    }
  }
}

function peoplePlacesThingsData () {
  var data = ActivityData.new()
  data.addContainer('PEOPLE', 'word-selection')
  data.addContainer('PLACES', 'word-selection')
  data.addContainer('THINGS', 'word-selection')
  return data
}

function actionsData () {
  var data = ActivityData.new()
  data.initCollection('map')
  return data
}

// Interpret
function outlineData (study) {
  var data = ActivityData.new()
  data.initCollection('section')
  var firstWord = study.getWords()[0]
  var lastWord = arrayLast(study.getWords())
  var section = new Section('', new WordRange(firstWord, lastWord))
  data.collection.add(section)
  return data
}

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
