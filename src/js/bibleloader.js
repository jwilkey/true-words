import $ from 'jquery'

var ESV = window.esv
export default {
  load (bookIdentifier, chapter, version, onload) {
    if (version === 'NASB') {
      var path = '/static/bibles/nasb/' + bookIdentifier + '/' + chapter + '.json'
      $.getJSON(path, function (json) {
        onload(json)
      })
    } else if (version === 'ESV') {
      $.ajax({
        url: `https://bible.truewordsapp.com/esv/${bookIdentifier}/${chapter}`,
        type: 'GET',
        beforeSend: function (xhr) { xhr.setRequestHeader('x-esv-api-key', ESV) },
        success: function (verses) {
          verses.forEach(v => { v.text = v.text.replace(/<f>\d*<\/f>/g, '') })
          onload(verses)
        }
      })
    } else {
      $.ajax({
        url: `https://bible.truewordsapp.com/verses/${version}/${bookIdentifier}/${chapter}`,
        type: 'GET',
        success: onload
      })
    }
  }
}
