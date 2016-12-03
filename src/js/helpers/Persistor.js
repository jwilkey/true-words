import drive from './DriveHelper'
import Studies from '../models/Study'
import { Bible, Verse } from '../bible'

export default {
  Persistor: Persistor
}

function Persistor (persistenceStrategy) {
  this.persistenceStrategy = persistenceStrategy
  this.drive = {
    studies: {}
  }
}

Persistor.prototype.refreshData = function (onFinish) {
  if (this.usingDrive()) {
    var self = this
    drive.fetchFiles(driveToken(), 'name+contains+%27.study%27')
    .done(function (data) {
      var studies = data.files.map(function (file) {
        var start = JSON.parse(file.properties.start)
        var end = JSON.parse(file.properties.end)
        var passage = Bible.buildPassage(new Verse(start.book, start.chapter, start.number), new Verse(end.book, end.chapter, end.number))
        var study = Studies.createStudy(file.properties.id, file.properties.createdDate, passage, undefined, file.properties.bible)
        self.addDriveFileForStudy(file.id, study.id)
        return study
      })
      onFinish(studies)
    })
    .fail(function (resp) {
      window.alert('Failed to load your saved studies from Google Drive')
    })
  }
}

Persistor.prototype.saveStudy = function (study) {
  if (this.usingDrive()) {
    var start = JSON.stringify(study.passage.start)
    var end = JSON.stringify(study.passage.end)
    var metadata = {
      name: study.fileName(),
      parents: ['appDataFolder'],
      mimeType: 'application/json',
      properties: { id: study.id, createdDate: study.date, start: start, end: end, bible: study.bible }
    }
    var self = this
    return drive.upload(driveToken(), metadata, study)
    .done(function (file) {
      self.addDriveFileForStudy(file.id, study.id)
    })
  }
}

Persistor.prototype.loadStudy = function (studyId) {
  if (this.usingDrive()) {
    return drive.fetchFileContent(driveToken(), this.drive.studies[studyId])
  }
}

Persistor.prototype.usingDrive = function () {
  return this.persistenceStrategy === 'GOOGLE_DRIVE'
}

Persistor.prototype.addDriveFileForStudy = function (driveFileId, studyId) {
  this.drive.studies[studyId] = driveFileId
}

function driveToken () {
  return window.gapi.auth.getToken().access_token
}
