import $ from 'jquery'

var storage = window.localStorage

var settings = {
  setFontSize (size) {
    $('html').removeClass('font-2 font-1 font1 font2')
    if (size !== 0) {
      $('html').addClass(`font${size}`)
    }
    storage.setItem('fontSize', size)
  },
  setTheme (theme) {
    $('html').removeClass('light-theme dark-theme')
    $('html').addClass(theme)
    storage.setItem('theme', theme)
  }
}

settings.loadSettings = function () {
  settings.setFontSize(storage.getItem('fontSize') || 0)
  settings.setTheme(storage.getItem('theme') || 'light-theme')
}

export default settings
