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
        url: `https://bible.truewordsapp.com/esv/${bookIdentifier}/${chapter}`,
        type: 'GET',
        beforeSend: function (xhr) { xhr.setRequestHeader('x-esv-api-key', ESV) },
        success: function (verses) {
          verses.forEach(v => { v.text = v.text.replace(/<f>*.<\/f>/g, '') })
          onload(verses)
        }
      })
    }
  }
}
