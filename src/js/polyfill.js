if (!String.prototype.endsWith) {
  // eslint-disable-next-line no-extend-native
  String.prototype.endsWith = function (searchString, position) {
    var subjectString = this.toString()
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length
    }
    position -= searchString.length
    var lastIndex = subjectString.indexOf(searchString, position)
    return lastIndex !== -1 && lastIndex === position
  }
}

export function isTouchDevice () {
  var ieCheck = navigator.maxTouchPoints
  return 'ontouchstart' in window || ieCheck
}

export function isEventSupported (eventName) {
  var TAGNAMES = {
    'select': 'input', 'change': 'input', 'submit': 'form', 'reset': 'form', 'error': 'img', 'load': 'img', 'abort': 'img'
  }
  var el = document.createElement(TAGNAMES[eventName] || 'div')
  eventName = 'on' + eventName
  var isSupported = (eventName in el)
  if (!isSupported) {
    el.setAttribute(eventName, 'return')
    isSupported = typeof el[eventName] === 'function'
  }
  el = null
  return isSupported
}

export function scrollToView (element, $container) {
  var $ = require('jquery')

  var offset = element.offset().top
  if (!element.is(':visible')) {
    element.css({'visibility': 'hidden'}).show()
    offset = element.offset().top
    element.css({'visibility': '', 'display': ''})
  }

  var visibleAreaStart = $container.scrollTop()
  var visibleAreaEnd = visibleAreaStart + $container.height()

  if (offset < visibleAreaStart || offset > visibleAreaEnd) {
    $(getScrollParent($container[0])).animate({scrollTop: offset - $container.height() / 3}, 500)
    return false
  }
  return true
}

export function getScrollParent (element) {
  var style = window.getComputedStyle(element)
  var excludeStaticParent = style.position === 'absolute'
  var overflowRegex = /(auto|scroll)/

  if (style.position === 'fixed') return document.body
  for (var parent = element; (parent = parent.parentElement);) {
    style = window.getComputedStyle(parent)
    if (excludeStaticParent && style.position === 'static') {
      continue
    }
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) return parent
  }

  return document.body
}

export function arrayLast (arr) {
  if (arr !== undefined && arr.length > 0) {
    return arr[arr.length - 1]
  }
  return undefined
}

export function arrayEmpty (arr) {
  if (arr === undefined) {
    throw new Error('Cannot check emptiness of undefined')
  }
  return arr.length === 0
}

export function arrayRemove (arr, item) {
  var index = arr.indexOf(item)
  if (index >= 0) {
    arr.splice(index, 1)
  }
}

export function ConditionalArray (condition, value) {
  this.items = []
  this.and(condition, value)
}

ConditionalArray.prototype.and = function (condition, value) {
  if (condition) {
    this.items.push(value)
  }
  return this
}

ConditionalArray.prototype.toArray = function () {
  return this.items
}
