import $ from 'jquery'

var ESV = window.esv
export default {
  load (bookIdentifier, chapter, version, onload) {
    if (version === 'NASB') {
      var path = '/static/bibles/nasb/' + bookIdentifier + '/' + chapter + '.json'
      $.getJSON(path, function (json) {
        onload(json)
      })
    } else {
      $.ajax({
        url: 'https://esvbibleapi.herokuapp.com/search/' + bookIdentifier + '+' + chapter,
        type: 'GET',
        beforeSend: function (xhr) { xhr.setRequestHeader('x-esv-api-key', ESV) },
        success: function (data) {
          onload(data.passage.verses)
        }
      })
    }
  }
}
