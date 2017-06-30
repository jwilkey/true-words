import drive from './DriveHelper'
import Studies from '../models/Study'
import { Bible, Verse } from '../bible'
import container from '../container'
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
    return container.authToken !== undefined
  }
  return false
}

Persistor.prototype.isSessionExpired = function () {
  return container.authHandler.isSessionExpired(this.persistenceStrategy)
}

Persistor.prototype.signOut = function () {
  container.authHandler.signOut(this.persistenceStrategy)
}

Persistor.prototype.refreshAuthorization = function () {
  container.authHandler.signIn(this.persistenceStrategy)
}

Persistor.prototype.refreshData = function (onFinish) {
  if (this.usingDrive()) {
    var self = this
    drive.fetchFiles(container.authToken, 'name+contains+%27.study%27')
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
        onFinish(studies)
      }
    })
    .fail(function (resp) {
      console.log('failed to refreshData')
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
    return drive.upload(container.authToken, metadata, study)
    .done(function (file) {
      self.addDriveFileForStudy(file.id, study.id)
    })
    .fail(resp => {
      handleFailure(self, resp, 'Save study')
    })
  }

  return $.when(console.log('Not logged in - requested to save study.'))
}

Persistor.prototype.updateStudy = function (study) {
  if (this.usingDrive()) {
    const self = this
    return drive.update(container.authToken, this.drive.studies[study.id], study)
    .fail(resp => {
      handleFailure(self, resp, 'Update study')
    })
  }

  return $.when(console.log('Not logged in - requested to update study.'))
}

Persistor.prototype.loadStudy = function (studyId) {
  if (this.usingDrive()) {
    const self = this
    return drive.fetchFileContent(container.authToken, this.drive.studies[studyId])
    .fail(resp => {
      handleFailure(self, resp, 'Load study')
    })
  }

  return $.when()
}

function handleFailure (persistor, resp, operationId) {
  console.log('Failed to: ' + operationId)
  if (resp.status === 401) {
    persistor.refreshAuthorization()
  }
}

Persistor.prototype.deleteStudy = function (studyId) {
  if (this.usingDrive()) {
    var self = this
    return drive.delete(container.authToken, this.drive.studies[studyId])
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
