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

function isTouchDevice () {
  var ieCheck = navigator.maxTouchPoints
  return 'ontouchstart' in window || ieCheck
}

function arrayLast (arr) {
  if (arr !== undefined && arr.length > 0) {
    return arr[arr.length - 1]
  }
  return undefined
}

function arrayEmpty (arr) {
  if (arr === undefined) {
    throw new Error('Cannot check emptiness of undefined')
  }
  return arr.length === 0
}

function arrayRemove (arr, item) {
  var index = arr.indexOf(item)
  if (index >= 0) {
    arr.splice(index, 1)
  }
}

export { isTouchDevice, arrayLast, arrayEmpty, arrayRemove }
