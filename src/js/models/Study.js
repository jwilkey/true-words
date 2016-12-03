export default {
  createStudy (id, date, passage, verses, bible) {
    return new Study(id, date, passage, verses, bible)
  }
}

function Study (id, date, passage, verses, bible) {
  this.id = id
  this.date = date
  this.passage = passage
  this.verses = verses
  this.bible = bible
}

Study.prototype.text = function () {
  return this.verses.map(function (v) {
    return v.text
  }).join(' ')
}

Study.prototype.words = function () {
  return this.text().split(' ')
}

Study.prototype.fileName = function () {
  return this.passage.description() + this.bible + '.study'
}

Study.prototype
