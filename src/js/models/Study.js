import ActivityAchievement from './ActivityAchievement'
import { Bible, Verse } from '../bible'

export default {
  createStudy (id, date, passage, verses, bible) {
    return new Study(id, date, passage, verses, bible)
  },
  fromJson (json) {
    var start = json.passage.start
    var end = json.passage.end
    var endVerse = new Verse(end.book, end.chapter, end.number)
    var passage = Bible.buildPassage(new Verse(start.book, start.chapter, start.number), endVerse)
    var study = this.createStudy(json.id, json.createdDate, passage, undefined, json.bible)
    study.apply(json)
    return study
  }
}

function Study (id, date, passage, verses, bible) {
  this.version = '0.5'
  this.id = id
  this.date = date
  this.passage = passage
  this.verses = verses
  this.bible = bible
  this.activities = []
}

Study.prototype.apply = function (json) {
  this.verses = json.verses
  this.activities = json.activities.map(function (activityJson) {
    return new ActivityAchievement('json', activityJson)
  })
}

Study.prototype.text = function () {
  return this.verses.map(function (v) {
    return v.text
  }).join(' ')
}

Study.prototype.lastEditLabel = function () {
  if (this.lastEdit) {
    return this.lastEdit.toDateString()
  } else {
    return ''
  }
}

Study.prototype.getWords = function () {
  if (this.words === undefined) {
    var b = this.passage.start.book
    this.words = []
    for (var vIndex in this.verses) {
      var verse = this.verses[vIndex]
      var wordTexts = verse.text.split(' ')
      this.words.push.apply(this.words, wordTexts.map(function (text, index) {
        return {book: b, chapter: verse.chapter, verse: verse.number, text: text, index: index}
      }))
    }
  }
  return this.words
}

Study.prototype.saveActivity = function (activityAchievement) {
  activityAchievement.studyID = this.id
  var existingActivity = this.findActivity(activityAchievement.type)
  if (existingActivity !== undefined) {
    var index = this.activities.indexOf(existingActivity)
    this.activities[index] = activityAchievement
  } else {
    this.activities.push(activityAchievement)
  }
}

Study.prototype.findActivity = function (activityType) {
  return this.activities.find(function (a) {
    return a.type === activityType
  })
}

Study.prototype.fileName = function () {
  return this.passage.description() + this.bible + '.study'
}
