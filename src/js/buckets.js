import interact from 'interactjs'

function Bucket (name) {
  this.name = name
  this.values = []
  this.wordIndices = []
}
Bucket.prototype.add = function (word, wordIndex) {
  this.values.push({word: word, index: wordIndex})
  this.wordIndices.push(wordIndex)
}
Bucket.prototype.hasWordIndex = function (wordIndex) {
  return this.wordIndices.indexOf(wordIndex) !== -1
}

var onWordDrop

export default {
  Bucket: Bucket,
  setOnWordDrop (callback) {
    onWordDrop = callback
  },
  positionWord () {
    var wordElement = document.getElementsByClassName('word')[0]
    var wordParent = document.getElementById('buckets-neutral-zone')
    var x = wordParent.offsetWidth / 2 - (wordElement.offsetWidth / 2)
    var y = wordParent.offsetHeight / 2 - (wordElement.offsetHeight / 2)
    wordElement.style.webkitTransform = wordElement.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
    wordElement.dataset.x = x
    wordElement.dataset.y = y
  },
  setupDraggables () {
    this.positionWord()
    interact('.draggable').draggable({
      inertia: true,
      restrict: {
        restriction: document.getElementById('buckets-container'),
        endOnly: true,
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      },
      autoScroll: true,
      onmove: this.dragMoveListener,
      onend: function (event) { }
    })

    interact('.dropzone').dropzone({
      accept: '.word',
      overlap: 0.65,
      ondropactivate: function (event) {
        event.target.classList.add('drop-active')
        event.relatedTarget.classList.add('drop-active')
      },
      ondragenter: function (event) {
        var draggableElement = event.relatedTarget
        var dropzoneElement = event.target
        dropzoneElement.classList.add('drop-target')
        draggableElement.classList.add('can-drop')
      },
      ondragleave: function (event) {
        event.target.classList.remove('drop-target')
        event.relatedTarget.classList.remove('can-drop')
      },
      ondrop: function (event) {
        if (onWordDrop !== undefined) {
          onWordDrop(event)
        }
      },
      ondropdeactivate: function (event) {
        event.target.classList.remove('drop-active')
        event.target.classList.remove('drop-target')
        event.relatedTarget.classList.remove('drop-active')
      }
    })
  },
  dragMoveListener (event) {
    var target = event.target
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
  }
}
