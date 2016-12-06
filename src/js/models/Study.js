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
    return ActivityAchievement.fromJson(activityJson)
  })
  console.log(this.activities)
}

Study.prototype.text = function () {
  return this.verses.map(function (v) {
    return v.text
  }).join(' ')
}

Study.prototype.words = function () {
  return this.text().split(' ')
}

Study.prototype.saveActivity = function (activityAchievement) {
  activityAchievement.studyID = this.id
  this.activities.push(activityAchievement)
}

Study.prototype.findActivity = function (activityType) {
  return this.activities.find(function (a) {
    return a.type === activityType
  })
}

Study.prototype.fileName = function () {
  return this.passage.description() + this.bible + '.study'
}
