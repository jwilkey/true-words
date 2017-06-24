import drive from './DriveHelper'
import driveAuth from './drive-auth-helper'
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
  if (this.usingDrive()) {
    return driveAuth.driveToken() !== undefined
  }
  return false
}

Persistor.prototype.isSessionExpired = function () {
  if (this.usingDrive()) {
    return driveAuth.isSignedIn() && (driveAuth.driveToken() === undefined)
  }
  return false
}

Persistor.prototype.signOut = function () {
  if (this.usingDrive()) {
    driveAuth.signOut()
  }
}

Persistor.prototype.refreshAuthorization = function () {
  if (this.usingDrive()) {
    driveAuth.signIn()
  }
}

Persistor.prototype.refreshData = function (onFinish) {
  if (this.usingDrive()) {
    var self = this
    drive.fetchFiles(driveAuth.driveToken(), 'name+contains+%27.study%27')
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
      if (onFinish) {
        onFinish(studies, driveAuth.driveUser())
      }
    })
    .fail(function (resp) {
      if (resp.status === 401) {
        window.location.reload(false)
      } else {
        if (onFinish) { onFinish() }
        window.alert('Failed to load your saved studies from Google Drive')
      }
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
    return drive.upload(driveAuth.driveToken(), metadata, study)
    .done(function (file) {
      self.addDriveFileForStudy(file.id, study.id)
    })
  }

  return $.when(console.log('Not logged in - requested to save study.'))
}

Persistor.prototype.updateStudy = function (study) {
  if (this.usingDrive()) {
    return drive.update(driveAuth.driveToken(), this.drive.studies[study.id], study)
  }

  return $.when(console.log('Not logged in - requested to update study.'))
}

Persistor.prototype.loadStudy = function (studyId) {
  if (this.usingDrive()) {
    return drive.fetchFileContent(driveAuth.driveToken(), this.drive.studies[studyId])
  }

  return $.when()
}

Persistor.prototype.deleteStudy = function (studyId) {
  if (this.usingDrive()) {
    var self = this
    return drive.delete(driveAuth.driveToken(), this.drive.studies[studyId])
    .done(function () {
      self.drive.studies[studyId] = undefined
    })
  }
}

Persistor.prototype.usingDrive = function () {
  return this.persistenceStrategy === 'GOOGLE_DRIVE'
}

Persistor.prototype.addDriveFileForStudy = function (driveFileId, studyId) {
  this.drive.studies[studyId] = driveFileId
}
