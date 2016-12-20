import ActivityAchievement from './ActivityAchievement'
export default {
  createStudy (id, date, passage, verses, bible) {
    return new Study(id, date, passage, verses, bible)
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

Study.prototype.getWords = function () {
  if (this.words === undefined) {
    var b = this.passage.start.book
    this.words = []
    for (var vIndex in this.verses) {
      var verse = this.verses[vIndex]
      var verseNumber = verse.number
      var wordTexts = verse.text.split(' ')
      this.words.push.apply(this.words, wordTexts.map(function (text, index) {
        return {book: b, verse: verseNumber, text: text, index: index}
      }))
    }
  }
  return this.words
}

Study.prototype.saveActivity = function (activityAchievement) {
  activityAchievement.studyID = this.id
  var existingActivity = this.findActivity(activityAchievement.type)
  if (existingActivity !== undefined) {
    existingActivity = activityAchievement
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
