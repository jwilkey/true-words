import activities from '../activity'
import ActivityData, { Section, QuestionAnswer, FreeText } from '../models/ActivityData'
import { arrayLast } from '../polyfill'
import { WordRange } from '../bible'

export default {
  createForType (activityType, study) {
    switch (activityType) {
      case activities.types.PeoplePlacesThings: return peoplePlacesThingsData()
      case activities.types.Actions: return actionsData()
      case activities.types.Adjectives: return adjectivesData()
      case activities.types.Outline: return outlineData(study)
      case activities.types.Paraphrase: return paraphraseData()
      case activities.types.Space: return spaceData()
      case activities.types.Stewardship: return stewardshipData(study)
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

function adjectivesData () {
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

function stewardshipData (study) {
  var data = ActivityData.new()
  data.initCollection('question-answer')
  var freeText = new FreeText(undefined, study.passage)
  data.collection.add(new QuestionAnswer('time', 'What will you spend time doing?', copy(freeText)))
  data.collection.add(new QuestionAnswer('money', 'For what will you spend money?', copy(freeText)))
  data.collection.add(new QuestionAnswer('thoughts', 'What attitudes and ideas will you think about?', copy(freeText)))
  data.collection.add(new QuestionAnswer('people', 'Who will you see and interact with?', copy(freeText)))
  data.collection.add(new QuestionAnswer('affect-time', 'the way you spend your time?', copy(freeText)))
  data.collection.add(new QuestionAnswer('affect-money', 'the way you spend your money?', copy(freeText)))
  data.collection.add(new QuestionAnswer('affect-thoughts', 'the things you feel and think?', copy(freeText)))
  data.collection.add(new QuestionAnswer('affect-people', 'the way you interact with people?', copy(freeText)))
  return data
}

function copy (obj) {
  return Object.assign({}, obj)
}
