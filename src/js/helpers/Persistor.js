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
  if (this.usingDrive) {
    return driveToken() !== undefined
  }
  return false
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
      if (onFinish) {
        onFinish(studies, driveUser())
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
    var retryCount = 0
    var self = this
    return drive.upload(driveToken(), metadata, study)
    .done(function (file) {
      self.addDriveFileForStudy(file.id, study.id)
    })
    .fail(function (resp) {
      if (resp.status === 401 && retryCount < 1) {
        retryCount += 1
        drive.signIn()
      }
    })
  }

  return $.when(console.log('Not logged in - requested to save study.'))
}

Persistor.prototype.updateStudy = function (study) {
  if (this.usingDrive()) {
    var retryCount = 0
    return drive.update(driveToken(), this.drive.studies[study.id], study)
    .fail(function (resp) {
      if (resp.status === 401 && retryCount < 1) {
        retryCount += 1
        drive.signIn()
      }
    })
  }

  return $.when(console.log('Not logged in - requested to update study.'))
}

Persistor.prototype.loadStudy = function (studyId) {
  if (this.usingDrive()) {
    return drive.fetchFileContent(driveToken(), this.drive.studies[studyId])
  }

  return $.when()
}

Persistor.prototype.deleteStudy = function (studyId) {
  if (this.usingDrive()) {
    var self = this
    return drive.delete(driveToken(), this.drive.studies[studyId])
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

function driveToken () {
  try {
    var user = window.gapi.auth2.getAuthInstance().currentUser.get()
    var expiresIn = (user.getAuthResponse().expires_at - new Date().getTime()) / 1000 / 60
    if (expiresIn < 5) {
      user.reloadAuthResponse()
    }
    return user.getAuthResponse().access_token
  } catch (e) {
    return undefined
  }
}

function driveUser () {
  var profile = window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile()
  return {name: profile.getName(), imageUrl: profile.getImageUrl()}
}
