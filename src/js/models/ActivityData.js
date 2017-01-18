import { WordRange } from '../bible'

function ActivityData () {
  this.containers = []
}

ActivityData.prototype.addContainer = function (name, itemKind) {
  this.containers.push(new Container(name, itemKind))
}

ActivityData.prototype.getContainer = function (index) {
  return this.containers[index]
}

ActivityData.prototype.findContainer = function (containerName) {
  for (var i in this.containers) {
    var c = this.containers[i]
    if (c.name === containerName) {
      return c
    }
  }
  return undefined
}

ActivityData.prototype.removeContainer = function (index) {
  this.containers.splice(index, 1)
}

ActivityData.prototype.initCollection = function (itemKind) {
  this.collection = new Collection(itemKind)
}

function getPrototype (kind) {
  switch (kind) {
    case 'collection': return Collection.prototype
    case 'container': return Container.prototype
    case 'word-selection': return WordSelection.prototype
    case 'free-text': return FreeText.prototype
    case 'action': return Action.prototype
    case 'section': return Section.prototype
    case 'word-range': return WordRange.prototype
    default: return undefined
  }
}

function deserialize (kind, json) {
  if (json === undefined) {
    return undefined
  }
  var type = (json.kind !== undefined) ? getPrototype(json.kind) : getPrototype(kind)
  if (type.fromJson === undefined) {
    throw new Error('Object of kind: ' + kind + ' does not implement fromJson')
  }
  return type.fromJson(json)
}

export default {
  new () {
    return new ActivityData()
  },
  fromJson (json) {
    var data = new ActivityData()
    data.collection = collectionFromJson(json.collection)
    data.containers = containersFromJson(json.containers)
    return data
  }
}

// Json Builders
function collectionFromJson (json) {
  if (json !== undefined) {
    var collection = new Collection(json.itemKind)
    json.items.forEach(function (itemJson) {
      collection.items.push(deserialize(collection.itemKind, itemJson))
    })
    return collection
  }
  return undefined
}

function containersFromJson (json) {
  if (json !== undefined) {
    var containers = []
    json.forEach(function (containerJson) {
      var container = new Container(containerJson.name, containerJson.itemKind)
      containerJson.items.forEach(function (itemJson) {
        container.items.push(deserialize(container.itemKind, itemJson))
      })
      containers.push(container)
    })
    return containers
  }
  return undefined
}

// Collection
function Collection (itemKind) {
  this.kind = 'collection'
  this.itemKind = itemKind
  this.items = []
}

Collection.prototype.fromJson = function (json) {
  if (json !== undefined) {
    var collection = new Collection(json.itemKind)
    json.items.forEach(function (itemJson) {
      collection.items.push(deserialize(collection.itemKind, itemJson))
    })
  }
  return undefined
}

Collection.prototype.add = function (item) {
  this.items.push(item)
}

Collection.prototype.last = function () {
  return (this.items.length === 0) ? undefined : this.items[this.items.length - 1]
}

Collection.prototype.isEmpty = function () {
  return this.items.length <= 0
}

// Containers
function Container (name, itemKind) {
  this.kind = 'container'
  this.itemKind = itemKind
  this.name = name
  this.items = []
}

Container.prototype.fromJson = function (json) {
  var container = new Container(json.name, json.itemKind)
  json.items.forEach(function (itemJson) {
    container.items.push(deserialize(container.itemKind, itemJson))
  })
}

Container.prototype.add = function (item) {
  this.items.push(item)
}

Container.prototype.contains = function (query) {
  return this.items.find(function (i) {
    return i.matches(query)
  }) !== undefined
}

// Word Selection
function WordSelection () {
  this.kind = 'word-selection'
  if (arguments[0].constructor === Array) {
    this.words = arguments[0]
  } else {
    this.words = Array.prototype.slice.call(arguments)
  }
}

WordSelection.prototype.fromJson = function (json) {
  if (json !== undefined) {
    return new WordSelection(json.words)
  }
  return undefined
}

WordSelection.prototype.matches = function (query) {
  if (query.hasOwnProperty('text')) {
    return this.words.find(function (w) {
      return w.book === query.book && w.verse === query.verse && w.index === query.index
    }) !== undefined
  }
  return false
}

WordSelection.prototype.toString = function () {
  return this.words.map(function (w) {
    return w.text
  }).join(' ')
}

// FreeText
function FreeText (text, passage) {
  this.kind = 'free-text'
  this.text = text
  this.passage = passage
}

FreeText.prototype.fromJson = function (json) {
  if (json !== undefined) {
    return new FreeText(json.text, json.passage)
  }
  return undefined
}

// Action
function Action (action, tense, actor, target, result) {
  this.kind = 'action'
  this.action = action
  this.tense = tense
  this.actor = actor
  this.target = target
  this.result = result
}

Action.prototype.fromJson = function (json) {
  return new Action(deserialize(0, json.action), json.tense, deserialize(0, json.actor), deserialize(0, json.target), deserialize(0, json.result))
}

// Section
function Section (title, wordRange) {
  this.kind = 'section'
  this.id = uuid()
  this.title = title
  this.wordRange = wordRange
  this.subSections = new Collection('section')
}

Section.prototype.addSubSection = function (section) {
  this.subSections.add(section)
}

Section.prototype.rangeDescription = function () {
  if (this.wordRange && this.wordRange.startingWord) {
    var ending = this.wordRange.endingWord ? '-' + this.wordRange.endingWord.verse : ''
    return 'v. ' + this.wordRange.startingWord.verse + ending
  }
  return undefined
}

Section.prototype.fromJson = function (json) {
  var section = new Section(json.title, deserialize('word-range', json.wordRange))
  section.id = json.id
  section.subSections = collectionFromJson(json.subSections)
  return section
}

function uuid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0
    var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export { WordSelection, FreeText, Action, Section }
