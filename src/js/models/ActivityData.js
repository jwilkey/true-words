function ActivityData () {
  this.containers = []
}

ActivityData.prototype.addContainer = function (name, itemKind) {
  this.containers.push(new Container(name, itemKind))
}

ActivityData.prototype.initCollection = function (itemKind) {
  this.collection = new Collection(itemKind)
}

function getPrototype (kind) {
  switch (kind) {
    case 'collection': return Collection.prototype
    case 'container': return Container.prototype
    case 'word-selection': return WordSelection.prototype
    case 'action': return Action.prototype
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

export { WordSelection, Action }
