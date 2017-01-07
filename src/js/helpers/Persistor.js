import drive from './DriveHelper'
import Studies from '../models/Study'
import { Bible, Verse } from '../bible'
import $ from 'jquery'

export default {
  Persistor: Persistor
}

function Persistor (persistenceStrategy) {
  this.persistenceStrategy = persistenceStrategy
  this.drive = {
    studies: {}
  }
}

Persistor.prototype.isLoggedIn = function () {
  return this.persistenceStrategy !== undefined
}

Persistor.prototype.refreshAuthorization = function (callback) {
  if (this.usingDrive) {
    drive.initAuth(callback)
  }
  // no persistenceStrategy
  callback(undefined)
}

Persistor.prototype.refreshData = function (onFinish) {
  if (this.usingDrive()) {
    var self = this
    drive.fetchFiles(driveToken(), 'name+contains+%27.study%27')
    .done(function (data) {
      var studies = data.files.map(function (file) {
        var start = JSON.parse(file.properties.start)
        var end = file.properties.end !== undefined ? JSON.parse(file.properties.end) : undefined
        var endVerse = end !== undefined ? new Verse(end.book, end.chapter, end.number) : undefined
        var passage = Bible.buildPassage(new Verse(start.book, start.chapter, start.number), endVerse)
        var study = Studies.createStudy(file.properties.id, file.properties.createdDate, passage, undefined, file.properties.bible)
        study.lastEdit = new Date(file.modifiedTime)
        self.addDriveFileForStudy(file.id, study.id)
        return study
      })
      onFinish(studies, driveUser())
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

  return $.when(console.log('Not logged in - requested to save study.'))
}

Persistor.prototype.updateStudy = function (study) {
  if (this.usingDrive()) {
    return drive.update(driveToken(), this.drive.studies[study.id], study)
  }

  return $.when(console.log('Not logged in - requested to update study.'))
}

Persistor.prototype.loadStudy = function (studyId) {
  if (this.usingDrive()) {
    return drive.fetchFileContent(driveToken(), this.drive.studies[studyId])
  }

  return $.when()
}

Persistor.prototype.usingDrive = function () {
  return this.persistenceStrategy === 'GOOGLE_DRIVE'
}

Persistor.prototype.addDriveFileForStudy = function (driveFileId, studyId) {
  this.drive.studies[studyId] = driveFileId
}

function driveToken () {
  return window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token
}

function driveUser () {
  var profile = window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile()
  return {name: profile.getName(), imageUrl: profile.getImageUrl()}
}
