import $ from 'jquery'
export default {
  load (bookIdentifier, chapter, onload) {
    var path = '../../static/bibles/nasb/' + bookIdentifier + '/' + chapter + '.json'
    $.getJSON(path, function (json) {
      onload(json)
    })
  }
}
