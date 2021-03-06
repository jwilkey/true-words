import $ from 'jquery'

var baseUrl = 'https://www.googleapis.com'

function api (path) {
  return baseUrl + path
}

export default {
  fetchFiles (authToken, query) {
    var url = api('/drive/v3/files?spaces=appDataFolder&fields=files(id,appProperties,properties,modifiedTime)&q=' + query)
    var requestConfig = {
      type: 'GET',
      url: url,
      beforeSend: function (request) {
        request.setRequestHeader('Authorization', 'Bearer ' + authToken)
      }
    }
    return $.ajax(requestConfig)
    .then(function (data) {
      if (data.files && data.files.length === 0) {
        // sometimes Google returns a false empty list
        return $.ajax(requestConfig)
      }
      return data
    })
  },
  upload (authToken, metadata, jsonContent) {
    var data = buildBody(metadata, jsonContent)
    return $.ajax({
      type: 'POST',
      url: api('/upload/drive/v3/files?uploadType=multipart'),
      beforeSend: function (request) {
        request.setRequestHeader('Authorization', 'Bearer ' + authToken)
        request.setRequestHeader('Content-Type', 'multipart/related; boundary="-------314159265358979323846"')
      },
      data: data
    })
  },
  update (authToken, fileId, jsonContent) {
    var data = JSON.stringify(jsonContent)
    return $.ajax({
      type: 'PATCH',
      url: api('/upload/drive/v3/files/' + fileId + '?uploadType=media'),
      beforeSend: function (request) {
        request.setRequestHeader('Authorization', 'Bearer ' + authToken)
        request.setRequestHeader('Content-Type', 'application/json')
      },
      data: data
    })
  },
  delete (authToken, fileId) {
    return $.ajax({
      type: 'DELETE',
      url: api('/drive/v3/files/' + fileId),
      beforeSend: function (request) {
        request.setRequestHeader('Authorization', 'Bearer ' + authToken)
        request.setRequestHeader('Content-Type', 'application/json')
      }
    })
  },
  fetchFileContent (authToken, fileId) {
    return $.ajax({
      type: 'GET',
      url: api('/drive/v3/files/' + fileId + '?alt=media'),
      beforeSend: function (request) {
        request.setRequestHeader('Authorization', 'Bearer ' + authToken)
      }
    })
  }
}

function buildBody (metadata, data) {
  var boundary = '-------314159265358979323846'
  var delimiter = '\r\n--' + boundary + '\r\n'
  var closeDelim = '\r\n--' + boundary + '--'

  var multipartRequestBody = delimiter + 'Content-Type: application/json\r\n\r\n' +
  JSON.stringify(metadata) +
  delimiter +
  'Content-Type: application/json\r\n'

  multipartRequestBody += '\r\n' + JSON.stringify(data)
  multipartRequestBody += closeDelim
  return multipartRequestBody
}
