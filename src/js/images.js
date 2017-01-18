import $ from 'jquery'

export default {
  svgs: function () {
    $('img.svg').each(function () {
      var $img = $(this)
      var imgClass = $img.attr('class')
      var imgURL = $img.attr('src')

      $.get(imgURL, function (data) {
        var $svg = $(data).find('svg')
        if (typeof imgClass !== 'undefined') {
          $svg = $svg.attr('class', imgClass)
        }

        $svg = $svg.removeAttr('xmlns:a')
        $img.replaceWith($svg)
      }, 'xml')
    })
  }
}
