webpackJsonp([0],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var ActivityType = {
  PeoplePlacesThings: 'PPT',
  Actions: 'ACTIONS',
  Adjectives: 'ADJECTIVES',
  CauseEffect: 'CAUSEEFFECT',

  Outline: 'OUTLINE',
  Keywords: 'KEYWORDS',
  Topics: 'TOPICS',
  Idioms: 'IDIOMS',
  Paraphrase: 'PARAPHRASE',

  Space: 'SPACE',
  Stewardship: 'STEWARDSHIP'
};

function Activity(id, category, title, subtitle, enabled) {
  this.id = id;
  this.category = category;
  this.title = title;
  this.subtitle = subtitle;
  this.enabled = enabled;
}

function ActivityManager() {
  this.observationActivities = [ActivityType.PeoplePlacesThings, ActivityType.Actions, ActivityType.Adjectives];
  this.interpretationActivities = [ActivityType.Topics, ActivityType.Outline, ActivityType.Paraphrase];
  this.applicationActivities = [ActivityType.Space, ActivityType.Stewardship];
  this.activities = [new Activity('PPT', 'observation', 'People, Places & Things', 'People-Places-Things', true), new Activity('ACTIONS', 'observation', 'Actions', 'Actions', true), new Activity('ADJECTIVES', 'observation', 'Adjectives', 'Adjectives', true), new Activity('CAUSEEFFECT', 'observation', 'Cause & Effect', 'Cause & Effect', false), new Activity('KEYWORDS', 'interpretation', 'Key Words', 'Key Words', false), new Activity('TOPICS', 'interpretation', 'Topics', 'Topics', true), new Activity('IDIOMS', 'interpretation', 'Idioms', 'Words not used in everyday talk', false), new Activity('OUTLINE', 'interpretation', 'Outline', 'Outline', true), new Activity('PARAPHRASE', 'interpretation', 'Paraphrase', 'Paraphrase', true), new Activity('SPACE', 'application', 'SPACE', 'SPACE', true), new Activity('STEWARDSHIP', 'application', 'Stewardship', 'Stewardship', true)];
}

ActivityManager.prototype.find = function (id) {
  var filteredActivities = this.activities.filter(function (activity) {
    return activity.id === id;
  });
  return filteredActivities.length > 0 ? filteredActivities[0] : null;
};

ActivityManager.prototype.titleForType = function (type) {
  return this.find(type).title;
};
ActivityManager.prototype.subtitleForType = function (type) {
  var activity = this.find(type);
  return activity ? activity.subtitle : null;
};

ActivityManager.prototype.version = function (type) {
  return '0.5';
};

exports.default = {
  manager: new ActivityManager(),
  types: ActivityType
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(87)
  __webpack_require__(88)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(89),
  /* template */
  __webpack_require__(90),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-75c9f7b2",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QuestionAnswer = exports.Section = exports.Adjective = exports.Action = exports.FreeText = exports.WordSelection = undefined;

var _stringify = __webpack_require__(10);

var _stringify2 = _interopRequireDefault(_stringify);

var _bible = __webpack_require__(8);

var _polyfill = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ActivityData() {
  this.containers = [];
}

ActivityData.prototype.addContainer = function (name, itemKind) {
  this.containers.push(new Container(name, itemKind));
};

ActivityData.prototype.getContainer = function (index) {
  return this.containers[index];
};

ActivityData.prototype.findContainer = function (containerName) {
  for (var i in this.containers) {
    var c = this.containers[i];
    if (c.name === containerName) {
      return c;
    }
  }
  return undefined;
};

ActivityData.prototype.removeContainer = function (index) {
  this.containers.splice(index, 1);
};

ActivityData.prototype.initCollection = function (itemKind) {
  this.collection = new Collection(itemKind);
};

function getPrototype(kind) {
  switch (kind) {
    case 'collection':
      return Collection.prototype;
    case 'container':
      return Container.prototype;
    case 'word-selection':
      return WordSelection.prototype;
    case 'free-text':
      return FreeText.prototype;
    case 'question-answer':
      return QuestionAnswer.prototype;
    case 'action':
      return Action.prototype;
    case 'adjective':
      return Adjective.prototype;
    case 'section':
      return Section.prototype;
    case 'word-range':
      return _bible.WordRange.prototype;
    default:
      return undefined;
  }
}

function deserialize(kind, json) {
  if (json === undefined) {
    return undefined;
  }
  var type = json.kind !== undefined ? getPrototype(json.kind) : getPrototype(kind);
  if (type.fromJson === undefined) {
    throw new Error('Object of kind: ' + kind + ' does not implement fromJson');
  }
  return type.fromJson(json);
}

exports.default = {
  new: function _new() {
    return new ActivityData();
  },
  fromJson: function fromJson(json) {
    var data = new ActivityData();
    data.collection = collectionFromJson(json.collection);
    data.containers = containersFromJson(json.containers);
    return data;
  }
};

function collectionFromJson(json) {
  if (json !== undefined) {
    var collection = new Collection(json.itemKind);
    json.items.forEach(function (itemJson) {
      collection.items.push(deserialize(collection.itemKind, itemJson));
    });
    return collection;
  }
  return undefined;
}

function containersFromJson(json) {
  if (json !== undefined) {
    var containers = [];
    json.forEach(function (containerJson) {
      var container = new Container(containerJson.name, containerJson.itemKind);
      containerJson.items.forEach(function (itemJson) {
        container.items.push(deserialize(container.itemKind, itemJson));
      });
      containers.push(container);
    });
    return containers;
  }
  return undefined;
}

function Collection(itemKind) {
  this.kind = 'collection';
  this.itemKind = itemKind;
  this.items = [];
}

Collection.prototype.fromJson = function (json) {
  if (json !== undefined) {
    var collection = new Collection(json.itemKind);
    json.items.forEach(function (itemJson) {
      collection.items.push(deserialize(collection.itemKind, itemJson));
    });
  }
  return undefined;
};

Collection.prototype.add = function (item) {
  this.items.push(item);
};

Collection.prototype.last = function () {
  return this.items.length === 0 ? undefined : this.items[this.items.length - 1];
};

Collection.prototype.isEmpty = function () {
  return this.items.length <= 0;
};

Collection.prototype.clear = function () {
  this.items = [];
};

function Container(name, itemKind) {
  this.kind = 'container';
  this.itemKind = itemKind;
  this.name = name;
  this.items = [];
}

Container.prototype.fromJson = function (json) {
  var container = new Container(json.name, json.itemKind);
  json.items.forEach(function (itemJson) {
    container.items.push(deserialize(container.itemKind, itemJson));
  });
};

Container.prototype.add = function (item) {
  this.items.push(item);
};

Container.prototype.remove = function (item) {
  (0, _polyfill.arrayRemove)(this.items, item);
};

Container.prototype.isEmpty = function () {
  return this.items.length === 0;
};

Container.prototype.includes = function (item) {
  return this.items.indexOf(item) !== -1;
};

Container.prototype.contains = function (query) {
  if (this.items.length > 0 && this.items[0].matches === undefined) {
    throw new Error('Items in container do not implement "matches"');
  }
  this.search(query) !== undefined;
};

Container.prototype.search = function (query) {
  return this.items.find(function (i) {
    return i.matches(query);
  });
};

function WordSelection() {
  this.kind = 'word-selection';
  if (arguments[0].constructor === Array) {
    this.words = arguments[0];
  } else {
    this.words = Array.prototype.slice.call(arguments);
  }
}

WordSelection.prototype.fromJson = function (json) {
  if (json !== undefined) {
    return new WordSelection(json.words);
  }
  return undefined;
};

WordSelection.prototype.equals = function (other) {
  return (0, _stringify2.default)(this) === (0, _stringify2.default)(other);
};

WordSelection.prototype.matches = function (query) {
  if (query.hasOwnProperty('text')) {
    return this.words.find(function (w) {
      return w.book === query.book && w.verse === query.verse && w.index === query.index;
    }) !== undefined;
  }
  return false;
};

WordSelection.prototype.compare = function (other) {
  var word = this.words[0];
  var chapterCompare = (word.chapter || 0) - (other.words[0].chapter || 0);
  return chapterCompare || this.words[0].verse - other.words[0].verse || this.words[0].index - other.words[0].index;
};

WordSelection.prototype.toString = function () {
  return this.words.map(function (w) {
    return w.text;
  }).join(' ');
};

function FreeText(text, passage, order) {
  this.kind = 'free-text';
  this.text = text;
  this.passage = passage;
  this.order = order;
}

FreeText.prototype.fromJson = function (json) {
  if (json !== undefined) {
    return new FreeText(json.text, json.passage, json.order);
  }
  return undefined;
};

function Action(action, tense, actor, target, result) {
  this.kind = 'action';
  this.action = action;
  this.tense = tense;
  this.actor = actor;
  this.target = target;
  this.result = result;
}

Action.prototype.fromJson = function (json) {
  return new Action(deserialize(0, json.action), json.tense, deserialize(0, json.actor), deserialize(0, json.target), deserialize(0, json.result));
};

function Adjective(wordSelection, target) {
  this.kind = 'adjective';
  this.wordSelection = wordSelection;
  this.target = target;
}

Adjective.prototype.fromJson = function (json) {
  return new Adjective(deserialize(0, json.wordSelection), deserialize(0, json.target));
};

function QuestionAnswer(questionId, questionText, freeText) {
  this.kind = 'question-answer';
  this.id = uuid();
  this.questionId = questionId;
  this.questionText = questionText;
  this.freeText = freeText;
}

QuestionAnswer.prototype.fromJson = function (json) {
  var qa = new QuestionAnswer(json.questionId, json.questionText, deserialize('free-text', json.freeText));
  qa.id = json.id;
  return qa;
};

function Section(title, wordRange) {
  this.kind = 'section';
  this.id = uuid();
  this.title = title;
  this.wordRange = wordRange;
  this.subSections = new Collection('section');
}

Section.prototype.addSubSection = function (section) {
  this.subSections.add(section);
};

Section.prototype.rangeDescription = function () {
  if (this.wordRange && this.wordRange.startingWord) {
    var ending = this.wordRange.endingWord ? '-' + this.wordRange.endingWord.verse : '';
    return 'v. ' + this.wordRange.startingWord.verse + ending;
  }
  return undefined;
};

Section.prototype.fromJson = function (json) {
  var section = new Section(json.title, deserialize('word-range', json.wordRange));
  section.id = json.id;
  section.subSections = collectionFromJson(json.subSections);
  return section;
};

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}

exports.WordSelection = WordSelection;
exports.FreeText = FreeText;
exports.Action = Action;
exports.Adjective = Adjective;
exports.Section = Section;
exports.QuestionAnswer = QuestionAnswer;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTouchDevice = isTouchDevice;
exports.isEventSupported = isEventSupported;
exports.scrollToView = scrollToView;
exports.getScrollParent = getScrollParent;
exports.arrayLast = arrayLast;
exports.arrayEmpty = arrayEmpty;
exports.arrayRemove = arrayRemove;
exports.ConditionalArray = ConditionalArray;
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (searchString, position) {
    var subjectString = this.toString();
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
}

function isTouchDevice() {
  var ieCheck = navigator.maxTouchPoints;
  return 'ontouchstart' in window || ieCheck;
}

function isEventSupported(eventName) {
  var TAGNAMES = {
    'select': 'input', 'change': 'input', 'submit': 'form', 'reset': 'form', 'error': 'img', 'load': 'img', 'abort': 'img'
  };
  var el = document.createElement(TAGNAMES[eventName] || 'div');
  eventName = 'on' + eventName;
  var isSupported = eventName in el;
  if (!isSupported) {
    el.setAttribute(eventName, 'return');
    isSupported = typeof el[eventName] === 'function';
  }
  el = null;
  return isSupported;
}

function scrollToView(element, $container) {
  var $ = __webpack_require__(3);

  var offset = element.offset().top;
  if (!element.is(':visible')) {
    element.css({ 'visibility': 'hidden' }).show();
    offset = element.offset().top;
    element.css({ 'visibility': '', 'display': '' });
  }

  var visibleAreaStart = $container.scrollTop();
  var visibleAreaEnd = visibleAreaStart + $container.height();

  if (offset < visibleAreaStart || offset > visibleAreaEnd) {
    $(getScrollParent($container[0])).animate({ scrollTop: offset - $container.height() / 3 }, 500);
    return false;
  }
  return true;
}

function getScrollParent(element) {
  var style = window.getComputedStyle(element);
  var excludeStaticParent = style.position === 'absolute';
  var overflowRegex = /(auto|scroll)/;

  if (style.position === 'fixed') return document.body;
  for (var parent = element; parent = parent.parentElement;) {
    style = window.getComputedStyle(parent);
    if (excludeStaticParent && style.position === 'static') {
      continue;
    }
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) return parent;
  }

  return document.body;
}

function arrayLast(arr) {
  if (arr !== undefined && arr.length > 0) {
    return arr[arr.length - 1];
  }
  return undefined;
}

function arrayEmpty(arr) {
  if (arr === undefined) {
    throw new Error('Cannot check emptiness of undefined');
  }
  return arr.length === 0;
}

function arrayRemove(arr, item) {
  var index = arr.indexOf(item);
  if (index >= 0) {
    arr.splice(index, 1);
  }
}

function ConditionalArray(condition, value) {
  this.items = [];
  this.and(condition, value);
}

ConditionalArray.prototype.and = function (condition, value) {
  if (condition) {
    this.items.push(value);
  }
  return this;
};

ConditionalArray.prototype.toArray = function () {
  return this.items;
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var books = [{ 'identifier': 'GENESIS', 'name': 'Genesis', 'chapters': 50, 'verses': [31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27, 33, 38, 18, 34, 24, 20, 67, 34, 35, 46, 22, 35, 43, 55, 32, 20, 31, 29, 43, 36, 30, 23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 33, 26] }, { 'identifier': 'EXODUS', 'name': 'Exodus', 'chapters': 40, 'verses': [22, 25, 22, 31, 23, 30, 25, 32, 35, 29, 10, 51, 22, 31, 27, 36, 16, 27, 25, 26, 36, 31, 33, 18, 40, 37, 21, 43, 46, 38, 18, 35, 23, 35, 35, 38, 29, 31, 43, 38] }, { 'identifier': 'LEVITICUS', 'name': 'Leviticus', 'chapters': 27, 'verses': [17, 16, 17, 35, 19, 30, 38, 36, 24, 20, 47, 8, 59, 57, 33, 34, 16, 30, 37, 27, 24, 33, 44, 23, 55, 46, 34] }, { 'identifier': 'NUMBERS', 'name': 'Numbers', 'chapters': 36, 'verses': [54, 34, 51, 49, 31, 27, 89, 26, 23, 36, 35, 16, 33, 45, 41, 50, 13, 32, 22, 29, 35, 41, 30, 25, 18, 65, 23, 31, 40, 16, 54, 42, 56, 29, 34, 13] }, { 'identifier': 'DEUTERONOMY', 'name': 'Deuteronomy', 'chapters': 34, 'verses': [46, 37, 29, 49, 33, 25, 26, 20, 29, 22, 32, 32, 18, 29, 23, 22, 20, 22, 21, 20, 23, 30, 25, 22, 19, 19, 26, 68, 29, 20, 30, 52, 29, 12] }, { 'identifier': 'JOSHUA', 'name': 'Joshua', 'chapters': 24, 'verses': [18, 24, 17, 24, 15, 27, 26, 35, 27, 43, 23, 24, 33, 15, 63, 10, 18, 28, 51, 9, 45, 34, 16, 33] }, { 'identifier': 'JUDGES', 'name': 'Judges', 'chapters': 21, 'verses': [36, 23, 31, 24, 31, 40, 25, 35, 57, 18, 40, 15, 25, 20, 20, 31, 13, 31, 30, 48, 25] }, { 'identifier': 'RUTH', 'name': 'Ruth', 'chapters': 4, 'verses': [22, 23, 18, 22] }, { 'identifier': '1SAMUEL', 'name': '1 Samuel', 'chapters': 31, 'verses': [28, 36, 21, 22, 12, 21, 17, 22, 27, 27, 15, 25, 23, 52, 35, 23, 58, 30, 24, 42, 15, 23, 29, 22, 44, 25, 12, 25, 11, 31, 13] }, { 'identifier': '2SAMUEL', 'name': '2 Samuel', 'chapters': 24, 'verses': [27, 32, 39, 12, 25, 23, 29, 18, 13, 19, 27, 31, 39, 33, 37, 23, 29, 33, 43, 26, 22, 51, 39, 25] }, { 'identifier': '1KINGS', 'name': '1 Kings', 'chapters': 22, 'verses': [53, 46, 28, 34, 18, 38, 51, 66, 28, 29, 43, 33, 34, 31, 34, 34, 24, 46, 21, 43, 29, 53] }, { 'identifier': '2KINGS', 'name': '2 Kings', 'chapters': 25, 'verses': [18, 25, 27, 44, 27, 33, 20, 29, 37, 36, 21, 21, 25, 29, 38, 20, 41, 37, 37, 21, 26, 20, 37, 20, 30] }, { 'identifier': '1CHRONICLES', 'name': '1 Chronicles', 'chapters': 29, 'verses': [54, 55, 24, 43, 26, 81, 40, 40, 44, 14, 47, 40, 14, 17, 29, 43, 27, 17, 19, 8, 30, 19, 32, 31, 31, 32, 34, 21, 30] }, { 'identifier': '2CHRONICLES', 'name': '2 Chronicles', 'chapters': 36, 'verses': [17, 18, 17, 22, 14, 42, 22, 18, 31, 19, 23, 16, 22, 15, 19, 14, 19, 34, 11, 37, 20, 12, 21, 27, 28, 23, 9, 27, 36, 27, 21, 33, 25, 33, 27, 23] }, { 'identifier': 'EZRA', 'name': 'Ezra', 'chapters': 10, 'verses': [11, 70, 13, 24, 17, 22, 28, 36, 15, 44] }, { 'identifier': 'NEHEMIAH', 'name': 'Nehemiah', 'chapters': 13, 'verses': [11, 20, 32, 23, 19, 19, 73, 18, 38, 39, 36, 47, 31] }, { 'identifier': 'ESTHER', 'name': 'Esther', 'chapters': 10, 'verses': [22, 23, 15, 17, 14, 14, 10, 17, 32, 3] }, { 'identifier': 'JOB', 'name': 'Job', 'chapters': 42, 'verses': [22, 13, 26, 21, 27, 30, 21, 22, 35, 22, 20, 25, 28, 22, 35, 22, 16, 21, 29, 29, 34, 30, 17, 25, 6, 14, 23, 28, 25, 31, 40, 22, 33, 37, 16, 33, 24, 41, 30, 24, 34, 17] }, { 'identifier': 'PSALM', 'name': 'Psalm', 'chapters': 150, 'verses': [6, 12, 8, 8, 12, 10, 17, 9, 20, 18, 7, 8, 6, 7, 5, 11, 15, 50, 14, 9, 13, 31, 6, 10, 22, 12, 14, 9, 11, 12, 24, 11, 22, 22, 28, 12, 40, 22, 13, 17, 13, 11, 5, 26, 17, 11, 9, 14, 20, 23, 19, 9, 6, 7, 23, 13, 11, 11, 17, 12, 8, 12, 11, 10, 13, 20, 7, 35, 36, 5, 24, 20, 28, 23, 10, 12, 20, 72, 13, 19, 16, 8, 18, 12, 13, 17, 7, 18, 52, 17, 16, 15, 5, 23, 11, 13, 12, 9, 9, 5, 8, 28, 22, 35, 45, 48, 43, 13, 31, 7, 10, 10, 9, 8, 18, 19, 2, 29, 176, 7, 8, 9, 4, 8, 5, 6, 5, 6, 8, 8, 3, 18, 3, 3, 21, 26, 9, 8, 24, 13, 10, 7, 12, 15, 21, 10, 20, 14, 9, 6] }, { 'identifier': 'PROVERBS', 'name': 'Proverbs', 'chapters': 31, 'verses': [33, 22, 35, 27, 23, 35, 27, 36, 18, 32, 31, 28, 25, 35, 33, 33, 28, 24, 29, 30, 31, 29, 35, 34, 28, 28, 27, 28, 27, 33, 31] }, { 'identifier': 'ECCLESIASTES', 'name': 'Ecclesiastes', 'chapters': 12, 'verses': [18, 26, 22, 16, 20, 12, 29, 17, 18, 20, 10, 14] }, { 'identifier': 'SONGOFSOLOMON', 'name': 'Song of Solomon', 'chapters': 8, 'verses': [17, 17, 11, 16, 16, 13, 13, 14] }, { 'identifier': 'ISAIAH', 'name': 'Isaiah', 'chapters': 66, 'verses': [31, 22, 26, 6, 30, 13, 25, 22, 21, 34, 16, 6, 22, 32, 9, 14, 14, 7, 25, 6, 17, 25, 18, 23, 12, 21, 13, 29, 24, 33, 9, 20, 24, 17, 10, 22, 38, 22, 8, 31, 29, 25, 28, 28, 25, 13, 15, 22, 26, 11, 23, 15, 12, 17, 13, 12, 21, 14, 21, 22, 11, 12, 19, 12, 25, 24] }, { 'identifier': 'JEREMIAH', 'name': 'Jeremiah', 'chapters': 52, 'verses': [19, 37, 25, 31, 31, 30, 34, 22, 26, 25, 23, 17, 27, 22, 21, 21, 27, 23, 15, 18, 14, 30, 40, 10, 38, 24, 22, 17, 32, 24, 40, 44, 26, 22, 19, 32, 21, 28, 18, 16, 18, 22, 13, 30, 5, 28, 7, 47, 39, 46, 64, 34] }, { 'identifier': 'LAMENTATIONS', 'name': 'Lamentations', 'chapters': 5, 'verses': [22, 22, 66, 22, 22] }, { 'identifier': 'EZEKIEL', 'name': 'Ezekiel', 'chapters': 48, 'verses': [28, 10, 27, 17, 17, 14, 27, 18, 11, 22, 25, 28, 23, 23, 8, 63, 24, 32, 14, 49, 32, 31, 49, 27, 17, 21, 36, 26, 21, 26, 18, 32, 33, 31, 15, 38, 28, 23, 29, 49, 26, 20, 27, 31, 25, 24, 23, 35] }, { 'identifier': 'DANIEL', 'name': 'Daniel', 'chapters': 12, 'verses': [21, 49, 30, 37, 31, 28, 28, 27, 27, 21, 45, 13] }, { 'identifier': 'HOSEA', 'name': 'Hosea', 'chapters': 14, 'verses': [11, 23, 5, 19, 15, 11, 16, 14, 17, 15, 12, 14, 16, 9] }, { 'identifier': 'JOEL', 'name': 'Joel', 'chapters': 3, 'verses': [20, 32, 21] }, { 'identifier': 'AMOS', 'name': 'Amos', 'chapters': 9, 'verses': [15, 16, 15, 13, 27, 14, 17, 14, 15] }, { 'identifier': 'OBADIAH', 'name': 'Obadiah', 'chapters': 1, 'verses': [21] }, { 'identifier': 'JONAH', 'name': 'Jonah', 'chapters': 4, 'verses': [17, 10, 10, 11] }, { 'identifier': 'MICAH', 'name': 'Micah', 'chapters': 7, 'verses': [16, 13, 12, 13, 15, 16, 20] }, { 'identifier': 'NAHUM', 'name': 'Nahum', 'chapters': 3, 'verses': [15, 13, 19] }, { 'identifier': 'HABAKKUK', 'name': 'Habakkuk', 'chapters': 3, 'verses': [17, 20, 19] }, { 'identifier': 'ZEPHANIAH', 'name': 'Zephaniah', 'chapters': 3, 'verses': [18, 15, 20] }, { 'identifier': 'HAGGAI', 'name': 'Haggai', 'chapters': 2, 'verses': [15, 23] }, { 'identifier': 'ZECHARIAH', 'name': 'Zechariah', 'chapters': 14, 'verses': [21, 13, 10, 14, 11, 15, 14, 23, 17, 12, 17, 14, 9, 21] }, { 'identifier': 'MALACHI', 'name': 'Malachi', 'chapters': 4, 'verses': [14, 17, 18, 6] }, { 'identifier': 'MATTHEW', 'name': 'Matthew', 'chapters': 28, 'verses': [25, 23, 17, 25, 48, 34, 29, 34, 38, 42, 30, 50, 58, 36, 39, 28, 27, 35, 30, 34, 46, 46, 39, 51, 46, 75, 66, 20] }, { 'identifier': 'MARK', 'name': 'Mark', 'chapters': 16, 'verses': [45, 28, 35, 41, 43, 56, 37, 38, 50, 52, 33, 44, 37, 72, 47, 20] }, { 'identifier': 'LUKE', 'name': 'Luke', 'chapters': 24, 'verses': [80, 52, 38, 44, 39, 49, 50, 56, 62, 42, 54, 59, 35, 35, 32, 31, 37, 43, 48, 47, 38, 71, 56, 53] }, { 'identifier': 'JOHN', 'name': 'John', 'chapters': 21, 'verses': [51, 25, 36, 54, 47, 71, 53, 59, 41, 42, 57, 50, 38, 31, 27, 33, 26, 40, 42, 31, 25] }, { 'identifier': 'ACTS', 'name': 'Acts', 'chapters': 28, 'verses': [26, 47, 26, 37, 42, 15, 60, 40, 43, 48, 30, 25, 52, 28, 41, 40, 34, 28, 41, 38, 40, 30, 35, 27, 27, 32, 44, 31] }, { 'identifier': 'ROMANS', 'name': 'Romans', 'chapters': 16, 'verses': [32, 29, 31, 25, 21, 23, 25, 39, 33, 21, 36, 21, 14, 23, 33, 27] }, { 'identifier': '1CORINTHIANS', 'name': '1 Corinthians', 'chapters': 16, 'verses': [31, 16, 23, 21, 13, 20, 40, 13, 27, 33, 34, 31, 13, 40, 58, 24] }, { 'identifier': '2CORINTHIANS', 'name': '2 Corinthians', 'chapters': 13, 'verses': [24, 17, 18, 18, 21, 18, 16, 24, 15, 18, 33, 21, 14] }, { 'identifier': 'GALATIANS', 'name': 'Galatians', 'chapters': 6, 'verses': [24, 21, 29, 31, 26, 18] }, { 'identifier': 'EPHESIANS', 'name': 'Ephesians', 'chapters': 6, 'verses': [23, 22, 21, 32, 33, 24] }, { 'identifier': 'PHILIPPIANS', 'name': 'Philippians', 'chapters': 4, 'verses': [30, 30, 21, 23] }, { 'identifier': 'COLOSSIANS', 'name': 'Colossians', 'chapters': 4, 'verses': [29, 23, 25, 18] }, { 'identifier': '1THESSALONIANS', 'name': '1 Thessalonians', 'chapters': 5, 'verses': [10, 20, 13, 18, 28] }, { 'identifier': '2THESSALONIANS', 'name': '2 Thessalonians', 'chapters': 3, 'verses': [12, 17, 18] }, { 'identifier': '1TIMOTHY', 'name': '1 Timothy', 'chapters': 6, 'verses': [20, 15, 16, 16, 25, 21] }, { 'identifier': '2TIMOTHY', 'name': '2 Timothy', 'chapters': 4, 'verses': [18, 26, 17, 22] }, { 'identifier': 'TITUS', 'name': 'Titus', 'chapters': 3, 'verses': [16, 15, 15] }, { 'identifier': 'PHILEMON', 'name': 'Philemon', 'chapters': 1, 'verses': [25] }, { 'identifier': 'HEBREWS', 'name': 'Hebrews', 'chapters': 13, 'verses': [14, 18, 19, 16, 14, 20, 28, 13, 28, 39, 40, 29, 25] }, { 'identifier': 'JAMES', 'name': 'James', 'chapters': 5, 'verses': [27, 26, 18, 17, 20] }, { 'identifier': '1PETER', 'name': '1 Peter', 'chapters': 5, 'verses': [25, 25, 22, 19, 14] }, { 'identifier': '2PETER', 'name': '2 Peter', 'chapters': 3, 'verses': [21, 22, 18] }, { 'identifier': '1JOHN', 'name': '1 John', 'chapters': 5, 'verses': [10, 29, 24, 21, 21] }, { 'identifier': '2JOHN', 'name': '2 John', 'chapters': 1, 'verses': [13] }, { 'identifier': '3JOHN', 'name': '3 John', 'chapters': 1, 'verses': [14] }, { 'identifier': 'JUDE', 'name': 'Jude', 'chapters': 1, 'verses': [25] }, { 'identifier': 'REVELATION', 'name': 'Revelation', 'chapters': 22, 'verses': [20, 29, 22, 11, 14, 17, 17, 13, 21, 11, 19, 17, 18, 20, 8, 21, 18, 24, 21, 15, 27, 21] }];

var Bible = {
  otBooks: books.slice(0, 39),
  ntBooks: books.slice(39, 66),
  Passage: Passage,
  book: function book(bookIdentifier) {
    return books.find(function (book) {
      return book.identifier === bookIdentifier;
    });
  },
  bookName: function bookName(bookIdentifier) {
    var b = this.book(bookIdentifier);
    return b ? b.name : undefined;
  },
  chapters: function chapters(bookIdentifier) {
    var b = this.book(bookIdentifier);
    return b ? b.chapters : undefined;
  },
  buildPassage: function buildPassage(startVerse, endVerse) {
    return new Passage(startVerse, endVerse);
  },
  compareReferences: function compareReferences(verse1, verse2) {
    if (!verse1 || !verse2 || verse1.book !== verse2.book) {
      return NaN;
    }
    if (verse2.chapter > verse1.chapter) {
      return 1;
    } else if (verse2.chapter === verse1.chapter) {
      if (verse2.number > verse1.number) {
        return 1;
      } else if (verse2.number === verse1.number) {
        return 0;
      } else {
        return -1;
      }
    } else {
      return -1;
    }
  },
  passageContains: function passageContains(startVerse, endVerse, verseInQuestion) {
    var startingVerseComparison = this.compareReferences(startVerse, verseInQuestion);
    if (startingVerseComparison === 0) {
      return true;
    } else if (endVerse !== undefined) {
      var endingVerseComparison = this.compareReferences(verseInQuestion, endVerse);
      if (endingVerseComparison === 0 || startingVerseComparison === 1 && endingVerseComparison === 1) {
        return true;
      }
      return false;
    }
  }
};

function Verse(bookIdentifier, chapter, number) {
  this.book = bookIdentifier;
  this.chapter = chapter;
  this.number = number;
}

Verse.prototype.equals = function (verse) {
  return Bible.compareReferences(verse, this) === 0;
};
Verse.prototype.isAfter = function (verse) {
  return Bible.compareReferences(verse, this) === 1;
};
Verse.prototype.isBefore = function (verse) {
  return Bible.compareReferences(this, verse) === 1;
};

function Passage(startVerse, endVerse) {
  this.start = startVerse;
  this.end = endVerse;
}

Passage.prototype.description = function () {
  var text = Bible.bookName(this.start.book) + ' ' + this.start.chapter + ':' + this.start.number;
  if (this.end !== undefined) {
    var endChapter = this.end.chapter !== this.start.chapter ? this.end.chapter + ':' : '';
    text = text + '-' + endChapter + this.end.number;
  }
  return text;
};

Passage.prototype.fromJson = function (json) {
  var start = json.start;
  var end = json.end;
  return new Passage(new Verse(start.book, start.chapter, start.number), new Verse(end.book, end.chapter, end.number));
};

function WordRange(startingWord, endingWord) {
  this.kind = 'word-range';
  this.startingWord = startingWord;
  this.endingWord = endingWord;
}

WordRange.prototype.includes = function (word) {
  var start = this.startingWord.verse * 100 + this.startingWord.index;
  var end = this.endingWord.verse * 100 + this.endingWord.index;
  var wordRef = word.verse * 100 + word.index;
  return this.startingWord.book === word.book && wordRef >= start && wordRef <= end;
};

WordRange.prototype.fromJson = function (json) {
  return new WordRange(json.startingWord, json.endingWord);
};

exports.Bible = Bible;
exports.Verse = Verse;
exports.WordRange = WordRange;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _driveAuthHelper = __webpack_require__(44);

var _driveAuthHelper2 = _interopRequireDefault(_driveAuthHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var container = {
  authToken: '',
  platform: 'web',
  recentPersistentStrategy: undefined
};

function isWebView() {
  return (/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent)
  );
}

container.authHandler = {
  checkAuth: function checkAuth(callback) {
    if (isWebView()) {
      window.location = 'truewords:drive:checkAuth';
    } else {
      _driveAuthHelper2.default.checkAuth();
    }
  },
  signIn: function signIn(strategy) {
    if (strategy !== undefined) {
      container.recentPersistentStrategy = strategy;
    } else {
      strategy = container.recentPersistentStrategy;
    }

    if (isWebView()) {
      if (strategy === 'GOOGLE_DRIVE') {
        window.location = 'truewords:drive:signIn';
      }
    } else {
      if (strategy === 'GOOGLE_DRIVE') {
        _driveAuthHelper2.default.signIn();
      }
    }
  },
  signOut: function signOut(strategy) {
    container.recentPersistentStrategy = undefined;
    if (isWebView()) {
      if (strategy === 'GOOGLE_DRIVE') {
        window.location = 'truewords:drive:signOut';
      }
    } else {
      if (strategy === 'GOOGLE_DRIVE') {
        _driveAuthHelper2.default.signOut();
      }
    }
  },
  isSignedIn: function isSignedIn(strategy) {
    if (isWebView()) {
      return true;
    } else {
      if (strategy === 'GOOGLE_DRIVE') {
        return _driveAuthHelper2.default.isSignedIn();
      }
    }
    return false;
  },
  refreshAuthorization: function refreshAuthorization() {
    if (container.platform === 'web') {
      container.onAuthorizationExpired();
    }
  }
};

container.authHandler.isSessionExpired = function (strategy) {
  return false;
};

window.twauth = function (token, username, imageUrl) {
  container.authToken = token;
  container.user.name = username;
  container.user.imageUrl = imageUrl;
};

exports.default = container;

/***/ }),
/* 10 */,
/* 11 */,
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_js_activity__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__src_js_activity___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__src_js_activity__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__getters__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__actions__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__src_js_helpers_Persistor__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__src_js_helpers_Persistor___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__src_js_helpers_Persistor__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__src_js_models_Study__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__src_js_models_Study___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__src_js_models_Study__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__src_js_bible__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__src_js_bible___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__src_js_bible__);









// Make vue aware of Vuex
__WEBPACK_IMPORTED_MODULE_0_vue__["default"].use(__WEBPACK_IMPORTED_MODULE_1_vuex__["default"])

// Create an object to hold the initial state when the app starts up
const state = {
  page: 'home',
  persistor: new __WEBPACK_IMPORTED_MODULE_5__src_js_helpers_Persistor___default.a.Persistor(),
  platform: 'web',
  isAuthenticated: false,
  user: {},
  currentBible: 'ESV',
  studies: [],
  currentStudy: undefined,
  currentActivity: __WEBPACK_IMPORTED_MODULE_2__src_js_activity___default.a.types.PeoplePlacesThings,
  currentPassage: undefined,
  activities: []
}
/* harmony export (immutable) */ __webpack_exports__["state"] = state;


// Create an object storing various mutations. We will write the mutation
const mutations = {
  SET_PERSISTANCE_STRATEGY (state, persistenceStrategy) {
    if (persistenceStrategy !== undefined) {
      state.persistor = new __WEBPACK_IMPORTED_MODULE_5__src_js_helpers_Persistor___default.a.Persistor(persistenceStrategy)
    }
  },
  SET_PLATFORM (state, platform) {
    state.platform = platform
  },
  SET_IS_AUTHENTICATED (state, isAuthed) {
    state.isAuthenticated = isAuthed
  },
  SET_USER (state, user) {
    state.user = user
  },
  SET_STUDIES (state, studies) {
    state.studies = studies
  },
  CURRENT_BIBLE (state, bible) {
    state.currentBible = bible
  },
  CLEAR_DATA (state) {
    state.page = 'home'
    state.persistor = new __WEBPACK_IMPORTED_MODULE_5__src_js_helpers_Persistor___default.a.Persistor()
    state.isAuthenticated = false
    state.user = {}
    state.studies = []
    state.currentStudy = undefined
    state.currentActivity = __WEBPACK_IMPORTED_MODULE_2__src_js_activity___default.a.types.PeoplePlacesThings
    state.currentPassage = undefined
    state.activities = []
  },
  CREATE_STUDY (state, study) {
    state.studies.push(study)
    state.currentStudy = study
  },
  CURRENT_ACTIVITY (state, activityType) {
    state.currentActivity = activityType
  },
  CURRENT_STUDY (state, studyObject) {
    for (var i = 0; i < state.studies.length; i++) {
      if (state.studies[i].id === studyObject.id) {
        state.currentStudy = state.studies[i]
        state.currentStudy.apply(studyObject)
        return
      }
    }
    var passage = new __WEBPACK_IMPORTED_MODULE_7__src_js_bible__["Bible"].Passage(studyObject.passage)
    var study = __WEBPACK_IMPORTED_MODULE_6__src_js_models_Study___default.a.createStudy(studyObject.id, studyObject.date, passage, studyObject.verses, studyObject.bible)
    study.apply(studyObject)
    state.studies.push(study)
    state.currentStudy = study
  },
  ACTIVITY_SAVE (state, activityAchievement) {
    state.currentStudy.saveActivity(activityAchievement)
  }
}
/* harmony export (immutable) */ __webpack_exports__["mutations"] = mutations;


// Combine the initial state and the mutations to create a Vuex store.
// This store can be linked to our app.
/* harmony default export */ __webpack_exports__["default"] = (new __WEBPACK_IMPORTED_MODULE_1_vuex__["default"].Store({
  state,
  getters: __WEBPACK_IMPORTED_MODULE_3__getters__["a" /* default */],
  mutations,
  actions: __WEBPACK_IMPORTED_MODULE_4__actions__["a" /* default */]
}));


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ActivityAchievement = __webpack_require__(22);

var _ActivityAchievement2 = _interopRequireDefault(_ActivityAchievement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  createStudy: function createStudy(id, date, passage, verses, bible) {
    return new Study(id, date, passage, verses, bible);
  }
};


function Study(id, date, passage, verses, bible) {
  this.version = '0.5';
  this.id = id;
  this.date = date;
  this.passage = passage;
  this.verses = verses;
  this.bible = bible;
  this.activities = [];
}

Study.prototype.apply = function (json) {
  this.verses = json.verses;
  this.activities = json.activities.map(function (activityJson) {
    return new _ActivityAchievement2.default('json', activityJson);
  });
};

Study.prototype.text = function () {
  return this.verses.map(function (v) {
    return v.text;
  }).join(' ');
};

Study.prototype.lastEditLabel = function () {
  if (this.lastEdit) {
    return this.lastEdit.toDateString();
  } else {
    return '';
  }
};

Study.prototype.getWords = function () {
  if (this.words === undefined) {
    var b = this.passage.start.book;
    this.words = [];
    for (var vIndex in this.verses) {
      var verse = this.verses[vIndex];
      var wordTexts = verse.text.split(' ');
      this.words.push.apply(this.words, wordTexts.map(function (text, index) {
        return { book: b, chapter: verse.chapter, verse: verse.number, text: text, index: index };
      }));
    }
  }
  return this.words;
};

Study.prototype.saveActivity = function (activityAchievement) {
  activityAchievement.studyID = this.id;
  var existingActivity = this.findActivity(activityAchievement.type);
  if (existingActivity !== undefined) {
    var index = this.activities.indexOf(existingActivity);
    this.activities[index] = activityAchievement;
  } else {
    this.activities.push(activityAchievement);
  }
};

Study.prototype.findActivity = function (activityType) {
  return this.activities.find(function (a) {
    return a.type === activityType;
  });
};

Study.prototype.fileName = function () {
  return this.passage.description() + this.bible + '.study';
};

/***/ }),
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(100)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(101),
  /* template */
  __webpack_require__(102),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(138)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(139),
  /* template */
  __webpack_require__(143),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-1127905a",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(184)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(185),
  /* template */
  __webpack_require__(186),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ActivityData = __webpack_require__(6);

var _ActivityData2 = _interopRequireDefault(_ActivityData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ActivityAchievement(type, data, creationDate, version) {
  if (type === 'json') {
    this.type = data.type;
    this.data = _ActivityData2.default.fromJson(data.data);
    this.creationDate = new Date(data.creationDate);
    this.version = data.version;
  } else {
    this.type = type;
    this.data = data;
    this.creationDate = creationDate;
    this.version = version;
  }
}

exports.default = ActivityAchievement;

/***/ }),
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(111)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(112),
  /* template */
  __webpack_require__(114),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-42f3fd5a",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(144)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(145),
  /* template */
  __webpack_require__(146),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-0664f907",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(3);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  svgs: function svgs() {
    (0, _jquery2.default)('img.svg').each(function () {
      var $img = (0, _jquery2.default)(this);
      var imgClass = $img.attr('class');
      var imgURL = $img.attr('src');

      _jquery2.default.get(imgURL, function (data) {
        var $svg = (0, _jquery2.default)(data).find('svg');
        if (typeof imgClass !== 'undefined') {
          $svg = $svg.attr('class', imgClass);
        }

        $svg = $svg.removeAttr('xmlns:a');
        $img.replaceWith($svg);
      }, 'xml');
    });
  }
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(161)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(162),
  /* template */
  __webpack_require__(163),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-bb2f32b8",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(256)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(257),
  /* template */
  __webpack_require__(262),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-a0872f1e",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(34);

var _vue = __webpack_require__(11);

var _vue2 = _interopRequireDefault(_vue);

var _vueRouter = __webpack_require__(37);

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _AnalyticsHelper = __webpack_require__(38);

var _AnalyticsHelper2 = _interopRequireDefault(_AnalyticsHelper);

var _store = __webpack_require__(12);

var _store2 = _interopRequireDefault(_store);

var _App = __webpack_require__(45);

var _App2 = _interopRequireDefault(_App);

var _Login = __webpack_require__(84);

var _Login2 = _interopRequireDefault(_Login);

var _Home = __webpack_require__(97);

var _Home2 = _interopRequireDefault(_Home);

var _BibleChooser = __webpack_require__(104);

var _BibleChooser2 = _interopRequireDefault(_BibleChooser);

var _PassageChooser = __webpack_require__(108);

var _PassageChooser2 = _interopRequireDefault(_PassageChooser);

var _PassageViewer = __webpack_require__(28);

var _PassageViewer2 = _interopRequireDefault(_PassageViewer);

var _Studies = __webpack_require__(116);

var _Studies2 = _interopRequireDefault(_Studies);

var _Activities = __webpack_require__(120);

var _Activities2 = _interopRequireDefault(_Activities);

var _Activity = __webpack_require__(124);

var _Activity2 = _interopRequireDefault(_Activity);

var _Reader = __webpack_require__(249);

var _Reader2 = _interopRequireDefault(_Reader);

var _Hymns = __webpack_require__(253);

var _Hymns2 = _interopRequireDefault(_Hymns);

var _Hymn = __webpack_require__(32);

var _Hymn2 = _interopRequireDefault(_Hymn);

var _SettingsPage = __webpack_require__(264);

var _SettingsPage2 = _interopRequireDefault(_SettingsPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = __webpack_require__(3);
window.jQuery = window.$ = $;

_vue2.default.use(_vueRouter2.default);

var routes = [{ path: '/', component: _Home2.default, name: 'Home' }, { path: '/login', component: _Login2.default, name: 'Login' }, { path: '/settings', component: _SettingsPage2.default, name: 'Settings' }, { path: '/passage', component: _PassageViewer2.default, name: 'PassageViewer' }, { path: '/bible_chooser', component: _BibleChooser2.default, name: 'BibleChooser' }, { path: '/choosepassage', component: _PassageChooser2.default, name: 'PassageChooser' }, { path: '/viewpassage', component: _PassageViewer2.default, name: 'PassageViewer' }, { path: '/studies', component: _Studies2.default, name: 'Studies' }, { path: '/activities', component: _Activities2.default, name: 'Activities' }, { path: '/activity', component: _Activity2.default, name: 'Activity' }, { path: '/reader', component: _Reader2.default, name: 'Reader' }, { path: '/hymns', component: _Hymns2.default, name: 'Hymns' }, { path: '/hymn', component: _Hymn2.default, name: 'Hymn' }, { path: '*', redirect: '/', name: 'RedirectHome' }];

var router = new _vueRouter2.default({
  routes: routes
});

router.beforeEach(function (to, from, next) {
  if (['/activity', '/activities', '/reader'].indexOf(to.path) !== -1) {
    if (_store2.default.getters.getCurrentStudy === undefined) {
      next('/');
      return;
    }
  }
  next();
});

router.afterEach(function (to, from) {
  if (to.name !== 'Activity') {
    _AnalyticsHelper2.default.trackScreen(to.name);
  }
});

_vue2.default.mixin({
  data: function data() {
    return {
      analytics: _AnalyticsHelper2.default
    };
  },

  computed: {
    isSignedIn: function isSignedIn() {
      return this.$root.$children[0].isAuthenticated;
    },
    isLoadingData: function isLoadingData() {
      return this.$root.$children[0].isLoadingPersistedData;
    }
  },
  methods: {
    log: function log(message) {
      console.log(message);
    },
    refreshData: function refreshData() {
      this.$root.$children[0].refreshPersistedData();
    },
    alert: function alert(message, option) {
      $('#application').addClass('obscure');
      $('#alert-message').text(message);
      $('#alert').css('display', 'table');
      switch (option) {
        case 'ok':
          $('#alert').addClass('ok-alert');
          break;
        case 'confirm':
          $('#alert').addClass('confirm-alert');
          break;
        default:
          break;
      }
    },
    dismissAlert: function dismissAlert() {
      $('#application').removeClass('obscure');
      $('#alert-message').text('');
      $('#alert').css('display', 'none');
      $('#alert').removeClass('ok-alert confirm-alert');
    },
    setAlertCallback: function setAlertCallback(callback) {
      this.$root.$children[0].alertCallback = callback;
    }
  },
  mounted: function mounted() {
    var label = this.$options._componentTag;
    _AnalyticsHelper2.default.attach(label, this.$el);
  }
});

var v = new _vue2.default({
  el: '#app',
  store: _store2.default,
  router: router,
  render: function render(h) {
    return h(_App2.default);
  }
});
v;

__webpack_require__(268);
__webpack_require__(7);

/***/ }),
/* 34 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  trackScreen: function trackScreen(screenname) {
    if (window.location.hostname !== 'localhost') {
      window.ga('set', 'screenName', screenname);
      window.ga('send', 'screenview', {
        'screenName': screenname
      });
    }
  },
  trackEvent: function trackEvent(category, action, label, value) {
    if (window.location.hostname !== 'localhost') {
      window.ga('send', 'event', category, action, label, value);
    }
  },
  attach: function attach(label, domElement) {
    var $ = window.$;
    var self = this;
    var category = 'AutoAttached';
    window.ga(function (tracker) {
      category = tracker.get('screenName');
    });
    $(domElement).find('button:not(.track), a:not(.track)').addClass('track').click(function () {
      if (label === undefined) {
        label = '#' + $(this).closest('[id]')[0].id;
      }
      var detail = this.textContent || this.dataset.title;
      self.trackEvent(category, 'click', label + '-' + detail);
    });
  }
};

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  getPersistor: state => state.persistor,
  platform: state => state.platform,
  isAuthenticated: state => state.isAuthenticated,
  getUser: state => state.user,
  getCurrentBible: state => state.currentBible,
  getStudies: state => state.studies,
  getCurrentStudy: state => state.currentStudy,
  getCurrentActivity: state => state.currentActivity,
  getCurrentWords: state => state.currentStudy.getWords()
});


/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_js_models_Study__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_js_models_Study___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__src_js_models_Study__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_jquery__);



/* harmony default export */ __webpack_exports__["a"] = ({
  setPersistenceStrategy (context, persistenceStrategy) {
    context.commit('SET_PERSISTANCE_STRATEGY', persistenceStrategy)
  },
  setPlatform ({ commit }, platform) {
    commit('SET_PLATFORM', platform)
  },
  setAuthenticated ({ commit }, isAuthenticated) {
    commit('SET_IS_AUTHENTICATED', isAuthenticated)
  },
  setUser ({ commit }, user) {
    commit('SET_USER', user)
  },
  setStudies ({ commit }, studies) {
    commit('SET_STUDIES', studies)
  },
  setCurrentBible ({ commit }, bible) {
    commit('CURRENT_BIBLE', bible)
  },
  clearData ({ commit }) {
    commit('CLEAR_DATA')
  },
  createNewStudy (context, studyData) {
    var bible = context.getters.getCurrentBible
    var study = __WEBPACK_IMPORTED_MODULE_0__src_js_models_Study___default.a.createStudy(uuid(), new Date(), studyData.passage, studyData.verses, bible)
    return context.getters.getPersistor.saveStudy(study)
    .done(function (data) {
      context.commit('CREATE_STUDY', study)
    })
  },
  openStudy (context, studyID) {
    if (context.getters.getPersistor.isLoggedIn()) {
      return context.getters.getPersistor.loadStudy(studyID)
      .done(function (studyObject) {
        context.commit('CURRENT_STUDY', studyObject)
      })
    } else {
      var studies = context.getters.getStudies
      for (var i = 0; i < studies.length; i++) {
        if (studies[i].id === studyID) {
          context.commit('CURRENT_STUDY', studies[i])
          return __WEBPACK_IMPORTED_MODULE_1_jquery___default.a.when(studies[i])
        }
      }
      return __WEBPACK_IMPORTED_MODULE_1_jquery___default.a.when(new Error('Study not found!'))
    }
  },
  setCurrentStudy ({ commit }, studyObject) {
    commit('CURRENT_STUDY', studyObject)
  },
  setCurrentActivity ({ commit }, activityType) {
    commit('CURRENT_ACTIVITY', activityType)
  },
  saveActivity (context, activityAchievement) {
    context.commit('ACTIVITY_SAVE', activityAchievement)
    if (context.getters.getPersistor.isLoggedIn()) {
      return context.getters.getPersistor.updateStudy(context.getters.getCurrentStudy)
    } else {
      return __WEBPACK_IMPORTED_MODULE_1_jquery___default.a.when(console.log('Not saving activity, not logged in'))
    }
  }
});

function uuid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0
    var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}


/***/ }),
/* 41 */,
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = __webpack_require__(10);

var _stringify2 = _interopRequireDefault(_stringify);

var _DriveHelper = __webpack_require__(43);

var _DriveHelper2 = _interopRequireDefault(_DriveHelper);

var _Study = __webpack_require__(13);

var _Study2 = _interopRequireDefault(_Study);

var _bible = __webpack_require__(8);

var _container = __webpack_require__(9);

var _container2 = _interopRequireDefault(_container);

var _jquery = __webpack_require__(3);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Persistor: Persistor
};


function Persistor(persistenceStrategy) {
  this.persistenceStrategy = persistenceStrategy;
  this.drive = {
    studies: {}
  };
}

Persistor.prototype.isLoggedIn = function () {
  if (this.usingDrive()) {
    return _container2.default.authToken !== undefined;
  }
  return false;
};

Persistor.prototype.isSessionExpired = function () {
  return _container2.default.authHandler.isSessionExpired(this.persistenceStrategy);
};

Persistor.prototype.signOut = function () {
  _container2.default.authHandler.signOut(this.persistenceStrategy);
};

Persistor.prototype.refreshAuthorization = function () {
  _container2.default.authHandler.refreshAuthorization();
};

Persistor.prototype.refreshData = function (onFinish) {
  if (this.usingDrive()) {
    var self = this;
    _DriveHelper2.default.fetchFiles(_container2.default.authToken, 'name+contains+%27.study%27').done(function (data) {
      var studies = data.files.map(function (file) {
        var start = JSON.parse(file.properties.start);
        var end = file.properties.end !== undefined ? JSON.parse(file.properties.end) : undefined;
        var endVerse = end !== undefined ? new _bible.Verse(end.book, end.chapter, end.number) : undefined;
        var passage = _bible.Bible.buildPassage(new _bible.Verse(start.book, start.chapter, start.number), endVerse);
        var study = _Study2.default.createStudy(file.properties.id, file.properties.createdDate, passage, undefined, file.properties.bible);
        study.lastEdit = new Date(file.modifiedTime);
        self.addDriveFileForStudy(file.id, study.id);
        return study;
      });
      if (onFinish) {
        onFinish(studies);
      }
    }).fail(function (resp) {
      console.log('failed to refreshData');
      if (resp.status === 401) {
        window.location.reload(false);
      } else {
        if (onFinish) {
          onFinish();
        }
        window.alert('Failed to load your saved studies from Google Drive');
      }
    });
  }
};

Persistor.prototype.saveStudy = function (study) {
  if (this.usingDrive()) {
    var start = (0, _stringify2.default)(study.passage.start);
    var end = (0, _stringify2.default)(study.passage.end);
    var metadata = {
      name: study.fileName(),
      parents: ['appDataFolder'],
      mimeType: 'application/json',
      properties: { id: study.id, createdDate: study.date, start: start, end: end, bible: study.bible }
    };
    var self = this;
    return _DriveHelper2.default.upload(_container2.default.authToken, metadata, study).done(function (file) {
      self.addDriveFileForStudy(file.id, study.id);
    }).fail(function (resp) {
      handleFailure(self, resp, 'Save study');
    });
  }

  return _jquery2.default.when(console.log('Not logged in - requested to save study.'));
};

Persistor.prototype.updateStudy = function (study) {
  if (this.usingDrive()) {
    var self = this;
    return _DriveHelper2.default.update(_container2.default.authToken, this.drive.studies[study.id], study).fail(function (resp) {
      handleFailure(self, resp, 'Update study');
    });
  }

  return _jquery2.default.when(console.log('Not logged in - requested to update study.'));
};

Persistor.prototype.loadStudy = function (studyId) {
  if (this.usingDrive()) {
    var self = this;
    return _DriveHelper2.default.fetchFileContent(_container2.default.authToken, this.drive.studies[studyId]).fail(function (resp) {
      handleFailure(self, resp, 'Load study');
    });
  }

  return _jquery2.default.when();
};

function handleFailure(persistor, resp, operationId) {
  console.log('Failed to: ' + operationId);
  if (resp.status === 401) {
    persistor.refreshAuthorization();
  }
}

Persistor.prototype.deleteStudy = function (studyId) {
  if (this.usingDrive()) {
    var self = this;
    return _DriveHelper2.default.delete(_container2.default.authToken, this.drive.studies[studyId]).done(function () {
      self.drive.studies[studyId] = undefined;
    });
  }
};

Persistor.prototype.usingDrive = function () {
  return this.persistenceStrategy === 'GOOGLE_DRIVE';
};

Persistor.prototype.addDriveFileForStudy = function (driveFileId, studyId) {
  this.drive.studies[studyId] = driveFileId;
};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = __webpack_require__(10);

var _stringify2 = _interopRequireDefault(_stringify);

var _jquery = __webpack_require__(3);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var baseUrl = 'https://www.googleapis.com';

function api(path) {
  return baseUrl + path;
}

exports.default = {
  fetchFiles: function fetchFiles(authToken, query) {
    var url = api('/drive/v3/files?spaces=appDataFolder&fields=files(id,appProperties,properties,modifiedTime)&q=' + query);
    var requestConfig = {
      type: 'GET',
      url: url,
      beforeSend: function beforeSend(request) {
        request.setRequestHeader('Authorization', 'Bearer ' + authToken);
      }
    };
    return _jquery2.default.ajax(requestConfig).then(function (data) {
      if (data.files && data.files.length === 0) {
        return _jquery2.default.ajax(requestConfig);
      }
      return data;
    });
  },
  upload: function upload(authToken, metadata, jsonContent) {
    var data = buildBody(metadata, jsonContent);
    return _jquery2.default.ajax({
      type: 'POST',
      url: api('/upload/drive/v3/files?uploadType=multipart'),
      beforeSend: function beforeSend(request) {
        request.setRequestHeader('Authorization', 'Bearer ' + authToken);
        request.setRequestHeader('Content-Type', 'multipart/related; boundary="-------314159265358979323846"');
      },
      data: data
    });
  },
  update: function update(authToken, fileId, jsonContent) {
    var data = (0, _stringify2.default)(jsonContent);
    return _jquery2.default.ajax({
      type: 'PATCH',
      url: api('/upload/drive/v3/files/' + fileId + '?uploadType=media'),
      beforeSend: function beforeSend(request) {
        request.setRequestHeader('Authorization', 'Bearer ' + authToken);
        request.setRequestHeader('Content-Type', 'application/json');
      },
      data: data
    });
  },
  delete: function _delete(authToken, fileId) {
    return _jquery2.default.ajax({
      type: 'DELETE',
      url: api('/drive/v3/files/' + fileId),
      beforeSend: function beforeSend(request) {
        request.setRequestHeader('Authorization', 'Bearer ' + authToken);
        request.setRequestHeader('Content-Type', 'application/json');
      }
    });
  },
  fetchFileContent: function fetchFileContent(authToken, fileId) {
    return _jquery2.default.ajax({
      type: 'GET',
      url: api('/drive/v3/files/' + fileId + '?alt=media'),
      beforeSend: function beforeSend(request) {
        request.setRequestHeader('Authorization', 'Bearer ' + authToken);
      }
    });
  }
};


function buildBody(metadata, data) {
  var boundary = '-------314159265358979323846';
  var delimiter = '\r\n--' + boundary + '\r\n';
  var closeDelim = '\r\n--' + boundary + '--';

  var multipartRequestBody = delimiter + 'Content-Type: application/json\r\n\r\n' + (0, _stringify2.default)(metadata) + delimiter + 'Content-Type: application/json\r\n';

  multipartRequestBody += '\r\n' + (0, _stringify2.default)(data);
  multipartRequestBody += closeDelim;
  return multipartRequestBody;
}

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(3);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var googleAuth = {
  authToken: function authToken() {
    try {
      var user = window.gapi.auth2.getAuthInstance().currentUser.get();
      var expiresIn = (user.getAuthResponse().expires_at - new Date().getTime()) / 1000 / 60;
      if (expiresIn < 0) {
        return undefined;
      }
      if (expiresIn < 10) {
        user.reloadAuthResponse();
      }
      return user.getAuthResponse().access_token;
    } catch (e) {
      return undefined;
    }
  },
  user: function user() {
    var profile = window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
    return { name: profile.getName(), imageUrl: profile.getImageUrl() };
  }
};

googleAuth.signinCallback = function (isSignedIn) {
  if (isSignedIn) {
    window.twauth(googleAuth.authToken(), 'GOOGLE_DRIVE', googleAuth.user().name, googleAuth.user().imageUrl);
  } else {
    window.twdeauth();
  }
};

exports.default = {
  checkAuth: function checkAuth() {
    function initialAuthCheck() {
      var CLIENT_ID = '105793449722-prnvpc85hufiqrn8vebatsbfk2aa7u2b.apps.googleusercontent.com';
      var SCOPE = 'https://www.googleapis.com/auth/drive.appdata';
      window.gapi.auth2.init({ client_id: CLIENT_ID, scope: SCOPE }).then(function () {
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(googleAuth.signinCallback);
        var currentStatus = window.gapi.auth2.getAuthInstance().isSignedIn.get();
        if (currentStatus) {
          googleAuth.signinCallback(currentStatus);
        }
      });
    }

    if (window.gapi && window.gapi.auth2) {
      initialAuthCheck();
    } else {
      _jquery2.default.holdReady(true);
      _jquery2.default.getScript('https://apis.google.com/js/api.js', function () {
        _jquery2.default.holdReady(false);
        window.gapi.load('auth2', initialAuthCheck);
      });
    }
  },
  signIn: function signIn() {
    return window.gapi.auth2.getAuthInstance().signIn();
  },
  signOut: function signOut() {
    return window.gapi.auth2.getAuthInstance().signOut();
  },
  isSignedIn: function isSignedIn() {
    return window.gapi.auth2.getAuthInstance().isSignedIn.get();
  }
};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(46)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(47),
  /* template */
  __webpack_require__(83),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 46 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _Alert = __webpack_require__(75);

var _Alert2 = _interopRequireDefault(_Alert);

var _ReauthorizeModal = __webpack_require__(79);

var _ReauthorizeModal2 = _interopRequireDefault(_ReauthorizeModal);

var _vuex = __webpack_require__(1);

var _polyfill = __webpack_require__(7);

var _container = __webpack_require__(9);

var _container2 = _interopRequireDefault(_container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      alertCallback: undefined,
      isLoadingPersistedData: false,
      isSessionExpired: false,
      sessionTimer: undefined
    };
  },

  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)(['getPersistor', 'platform', 'isAuthenticated'])),
  components: {
    Alert: _Alert2.default, ReauthorizeModal: _ReauthorizeModal2.default
  },
  methods: (0, _extends3.default)({}, (0, _vuex.mapActions)(['setPersistenceStrategy', 'setPlatform', 'setStudies', 'setAuthenticated', 'setUser', 'clearData']), {
    didReauthorize: function didReauthorize() {
      this.isSessionExpired = false;
    },
    refreshPersistedData: function refreshPersistedData() {
      if (this.isAuthenticated) {
        console.log('Refreshing data');
        var self = this;
        this.isLoadingPersistedData = true;
        this.getPersistor.refreshData(function (studies) {
          console.log(studies.length + ' studies loaded');
          self.setStudies(studies);
          self.isLoadingPersistedData = false;
        });
      }
    },
    authorize: function authorize(token, strategy, username, userImage) {
      if (token) {
        this.setPersistenceStrategy(strategy);
        _container2.default.authToken = token;
        _container2.default.recentPersistentStrategy = strategy;
        this.setUser({ name: username, imageUrl: userImage });
        this.setAuthenticated(true);
        this.refreshPersistedData();
      }
    },
    deauthorize: function deauthorize() {
      _container2.default.authToken = undefined;
      this.clearData();
      this.$router.push('Home');
    },
    checkAuth: function checkAuth() {
      _container2.default.authHandler.checkAuth();
    },
    showReauthView: function showReauthView() {
      this.isSessionExpired = true;
    }
  }),
  mounted: function mounted() {
    window.twauth = this.authorize;
    window.twdeauth = this.deauthorize;
    _container2.default.platform = this.$route.query.platform || 'web';
    _container2.default.onAuthorizationExpired = this.showReauthView;
    this.setPlatform(_container2.default.platform);

    if (!(0, _polyfill.isTouchDevice)()) {
      document.querySelector('html').classList.add('hover-on');
    }

    this.checkAuth();
  }
};

/***/ }),
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(76)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(77),
  /* template */
  __webpack_require__(78),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 76 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  data: function data() {
    return {
      app: this.$root.$children[0]
    };
  },

  components: {},
  methods: {
    confirmYes: function confirmYes() {
      if (this.app.alertCallback) {
        this.app.alertCallback('yes');
      } else {
        console.log('Confirmation alert has no alertCallback implementation');
      }
    },
    confirmNo: function confirmNo() {
      if (this.app.alertCallback) {
        this.app.alertCallback('no');
      } else {
        console.log('Confirmation alert has no alertCallback implementation');
      }
    }
  }
};

/***/ }),
/* 78 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    attrs: {
      "id": "alert"
    }
  }, [_c('div', {
    staticClass: "alert-container"
  }, [_c('div', {
    staticClass: "alert-box shadow-long"
  }, [_c('p', {
    attrs: {
      "id": "alert-message"
    }
  }), _vm._v(" "), _c('button', {
    staticClass: "btn btn-block btn-alert",
    attrs: {
      "id": "ok-alert-button"
    },
    on: {
      "click": function($event) {
        _vm.dismissAlert()
      }
    }
  }, [_vm._v("OK")]), _vm._v(" "), _c('div', {
    staticClass: "row alert-confirm"
  }, [_c('div', {
    staticClass: "col-xs-6"
  }, [_c('button', {
    staticClass: "btn btn-alert btn-block",
    attrs: {
      "id": "yes-alert-button"
    },
    on: {
      "click": function($event) {
        _vm.confirmYes()
      }
    }
  }, [_vm._v("YES")])]), _vm._v(" "), _c('div', {
    staticClass: "col-xs-6"
  }, [_c('button', {
    staticClass: "btn btn-alert alt btn-block",
    attrs: {
      "id": "no-alert-button"
    },
    on: {
      "click": function($event) {
        _vm.confirmNo()
      }
    }
  }, [_vm._v("NO")])])])])])])
},staticRenderFns: []}

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(80)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(81),
  /* template */
  __webpack_require__(82),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 80 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _vuex = __webpack_require__(1);

var _container = __webpack_require__(9);

var _container2 = _interopRequireDefault(_container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {};
  },

  props: ['onReauth'],
  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)(['getPersistor', 'getUser'])),
  components: {},
  methods: {
    signIn: function signIn() {
      _container2.default.authHandler.signIn();
      this.onReauth();
    },
    signOut: function signOut() {
      this.getPersistor.signOut();
    }
  },
  mounted: function mounted() {
    _container2.default.authHandler.checkAuth();
  }
};

/***/ }),
/* 82 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "auth-modal"
  }, [_c('div', {
    staticClass: "auth-modal-container theme-back"
  }, [_c('div', {
    staticClass: "auth-modal-box theme-mid shadow-long",
    attrs: {
      "id": "refresh-auth"
    }
  }, [_c('p', {
    staticClass: "muted"
  }, [_vm._v(_vm._s(_vm.getUser.name))]), _vm._v(" "), _c('p', [_vm._v("Your session has expired.")]), _vm._v(" "), _c('p', [_vm._v("Would you like to sign back in?")]), _vm._v(" "), _c('br'), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('div', {
    staticClass: "col-xs-6"
  }, [_c('button', {
    staticClass: "btn callout-light btn-block",
    on: {
      "click": function($event) {
        _vm.signIn()
      }
    }
  }, [_vm._v("YES")])]), _vm._v(" "), _c('div', {
    staticClass: "col-xs-6"
  }, [_c('button', {
    staticClass: "btn callout-light btn-block",
    on: {
      "click": function($event) {
        _vm.signOut()
      }
    }
  }, [_vm._v("NO")])])])])])])
},staticRenderFns: []}

/***/ }),
/* 83 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "vfull theme-back"
  }, [_c('router-view', {
    attrs: {
      "id": "application"
    }
  }), _vm._v(" "), _c('alert'), _vm._v(" "), (_vm.isSessionExpired) ? _c('reauthorize-modal', {
    attrs: {
      "on-reauth": _vm.didReauthorize
    }
  }) : _vm._e()], 1)
},staticRenderFns: []}

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(85)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(86),
  /* template */
  __webpack_require__(96),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-3be9443c",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 85 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _Titlebar = __webpack_require__(5);

var _Titlebar2 = _interopRequireDefault(_Titlebar);

var _GoogleAuth = __webpack_require__(91);

var _GoogleAuth2 = _interopRequireDefault(_GoogleAuth);

var _vuex = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      existingStudies: []
    };
  },

  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)(['isAuthenticated', 'getUser', 'getPersistor', 'getStudies']), {
    username: function username() {
      return this.getUser ? this.getUser.name : undefined;
    },
    userimage: function userimage() {
      return this.getUser ? this.getUser.imageUrl : undefined;
    }
  }),
  watch: {
    getPersistor: function getPersistor(newPersistor, oldVal) {
      if (newPersistor && newPersistor.isLoggedIn()) {
        var self = this;
        this.existingStudies.forEach(function (study) {
          newPersistor.saveStudy(study).done(function () {
            self.getStudies.push(study);
          });
        });
      }
    },
    isAuthenticated: function isAuthenticated(authenticated) {
      var self = this;
      if (authenticated) {
        setTimeout(self.closePressed, 2000);
      }
    }
  },
  components: {
    Titlebar: _Titlebar2.default, GoogleAuth: _GoogleAuth2.default
  },
  methods: (0, _extends3.default)({}, (0, _vuex.mapActions)(['setUser', 'setAuthenticated']), {
    closePressed: function closePressed() {
      var referrer = this.$route.query.referrer || '/';
      this.$router.replace(referrer);
    }
  }),
  mounted: function mounted() {
    this.existingStudies = this.getStudies.slice(0);
  }
};

/***/ }),
/* 87 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 88 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(3);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {};
  },

  computed: {
    customLeftButtons: function customLeftButtons() {
      return this.leftItems === undefined ? [] : this.leftItems.filter(function (e) {
        return ['close', 'home', 'back', 'help'].indexOf(e) === -1;
      });
    },
    customRightButtons: function customRightButtons() {
      return this.rightItems === undefined ? [] : this.rightItems.filter(function (e) {
        return ['close', 'home', 'back', 'help'].indexOf(e) === -1;
      });
    }
  },
  components: {},
  methods: {
    showLeft: function showLeft(label) {
      return this.leftItems !== undefined && this.leftItems.indexOf(label) > -1;
    },
    showRight: function showRight(label) {
      return this.rightItems !== undefined && this.rightItems.indexOf(label) > -1;
    },
    help: function help() {
      this.onHelp !== undefined ? this.onHelp() : this.alert('Help coming soon!!!', 'ok');
    }
  },
  mounted: function mounted() {
    (0, _jquery2.default)('#tasks-button').click(function () {
      (0, _jquery2.default)('.menubar').toggleClass('show');
    });
  },

  props: ['title', 'leftItems', 'rightItems', 'onHelp', 'onBack', 'onClose', 'onSelect']
};

/***/ }),
/* 90 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "titlebar theme-mid shadow"
  }, [_c('div', {
    staticClass: "titlebar-item-group left"
  }, [(_vm.showLeft('close')) ? _c('a', {
    staticClass: "titlebar-item",
    attrs: {
      "data-title": "close"
    },
    on: {
      "click": function($event) {
        _vm.onClose()
      }
    }
  }, [_c('span', {
    staticClass: "glyphicon glyphicon-remove"
  })]) : _vm._e(), _vm._v(" "), (_vm.showLeft('home')) ? _c('router-link', {
    staticClass: "titlebar-item",
    attrs: {
      "data-title": "home",
      "to": "/"
    }
  }, [_c('span', {
    staticClass: "glyphicon glyphicon-home"
  })]) : _vm._e(), _vm._v(" "), (_vm.showLeft('back')) ? _c('a', {
    staticClass: "titlebar-item",
    attrs: {
      "data-title": "back"
    },
    on: {
      "click": function($event) {
        _vm.onBack()
      }
    }
  }, [_c('span', {
    staticClass: "glyphicon glyphicon-menu-left"
  })]) : _vm._e(), _vm._v(" "), (_vm.showLeft('help')) ? _c('div', {
    staticClass: "titlebar-item",
    attrs: {
      "data-title": "help"
    },
    on: {
      "click": function($event) {
        _vm.help()
      }
    }
  }, [_c('i', {
    staticClass: "fa fa-question-circle-o"
  })]) : _vm._e(), _vm._v(" "), _vm._l((_vm.customLeftButtons), function(title) {
    return _c('a', {
      staticClass: "titlebar-item",
      on: {
        "click": function($event) {
          _vm.onSelect(title)
        }
      }
    }, [_vm._v(_vm._s(title))])
  })], 2), _vm._v(" "), _c('div', {
    staticClass: "text-center title"
  }, [_vm._v("\n    " + _vm._s(_vm.title) + "\n    "), _vm._t("center")], 2), _vm._v(" "), _c('div', {
    staticClass: "titlebar-item-group right"
  }, [(_vm.showRight('close')) ? _c('a', {
    staticClass: "titlebar-item",
    attrs: {
      "data-title": "close"
    },
    on: {
      "click": function($event) {
        _vm.onClose()
      }
    }
  }, [_c('span', {
    staticClass: "glyphicon glyphicon-remove"
  })]) : _vm._e(), _vm._v(" "), (_vm.showRight('home')) ? _c('router-link', {
    staticClass: "titlebar-item",
    attrs: {
      "data-title": "home",
      "to": "/"
    }
  }, [_c('span', {
    staticClass: "glyphicon glyphicon-home"
  })]) : _vm._e(), _vm._v(" "), (_vm.showRight('back')) ? _c('a', {
    staticClass: "titlebar-item",
    on: {
      "click": function($event) {
        _vm.onBack()
      }
    }
  }, [_vm._v("BACK")]) : _vm._e(), _vm._v(" "), (_vm.showRight('help')) ? _c('div', {
    staticClass: "titlebar-item",
    attrs: {
      "data-title": "help"
    },
    on: {
      "click": function($event) {
        _vm.help()
      }
    }
  }, [_c('i', {
    staticClass: "fa fa-question-circle-o"
  })]) : _vm._e(), _vm._v(" "), _vm._l((_vm.customRightButtons), function(title) {
    return _c('a', {
      staticClass: "titlebar-item pull-right",
      on: {
        "click": function($event) {
          _vm.onSelect(title)
        }
      }
    }, [_vm._v(_vm._s(title))])
  }), _vm._v(" "), _c('div', {
    staticClass: "titlebar-item"
  }, [_vm._t("right")], 2)], 2)])
},staticRenderFns: []}

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(92)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(93),
  /* template */
  __webpack_require__(94),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 92 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _container = __webpack_require__(9);

var _container2 = _interopRequireDefault(_container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {};
  },

  methods: {
    signInToDrive: function signInToDrive() {
      _container2.default.authHandler.signIn('GOOGLE_DRIVE');
    }
  }
};

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "clearfix theme-mid shadow",
    attrs: {
      "id": "authorize-div"
    },
    on: {
      "click": function($event) {
        _vm.signInToDrive(_vm.event)
      }
    }
  }, [_c('img', {
    staticClass: "drive-logo",
    attrs: {
      "src": __webpack_require__(95)
    }
  }), _vm._v(" "), _vm._m(0)])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "drive-text"
  }, [_c('p', {
    staticClass: "drive-connect-label muted"
  }, [_vm._v("Save your studies in Google Drive")]), _vm._v(" "), _c('p', {
    staticClass: "drive-connect"
  }, [_vm._v("Sign in using Google")])])
}]}

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/drive.d56f3e7.png";

/***/ }),
/* 96 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('titlebar', {
    attrs: {
      "title": "SIGN IN",
      "left-items": ['close'],
      "on-close": _vm.closePressed
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "container substance"
  }, [(!_vm.isAuthenticated) ? _c('google-auth') : _vm._e(), _vm._v(" "), (_vm.isAuthenticated) ? _c('div', {
    staticClass: "text-center"
  }, [_c('p', {
    staticClass: "user-name"
  }, [_vm._v("Hello " + _vm._s(_vm.username) + "!")]), _vm._v(" "), (_vm.userimage) ? _c('img', {
    staticClass: "user-photo",
    attrs: {
      "src": _vm.userimage
    }
  }) : _vm._e(), _vm._v(" "), _c('hr'), _vm._v(" "), _c('p', {
    staticClass: "redirect-helper muted"
  }, [_vm._v("If you are not automatically redirected "), _c('router-link', {
    attrs: {
      "to": "Home"
    }
  }, [_vm._v("click here")])], 1)]) : _vm._e()], 1)], 1)
},staticRenderFns: []}

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(98)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(99),
  /* template */
  __webpack_require__(103),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 98 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _Titlebar = __webpack_require__(5);

var _Titlebar2 = _interopRequireDefault(_Titlebar);

var _Card = __webpack_require__(19);

var _Card2 = _interopRequireDefault(_Card);

var _vuex = __webpack_require__(1);

var _container2 = __webpack_require__(9);

var _container3 = _interopRequireDefault(_container2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      loaded: false
    };
  },

  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)(['isAuthenticated', 'getStudies', 'getPersistor', 'getUser', 'getCurrentStudy']), {
    manyStudies: function manyStudies() {
      return this.getStudies.length > 3;
    },
    username: function username() {
      return this.getUser ? this.getUser.name : undefined;
    },
    userimage: function userimage() {
      return this.getUser ? this.getUser.imageUrl : undefined;
    },
    recentStudies: function recentStudies() {
      return this.manyStudies ? this.getStudies.slice(0, 3) : this.getStudies;
    },
    container: function container() {
      return _container3.default;
    }
  }),
  components: {
    Card: _Card2.default, Titlebar: _Titlebar2.default
  },
  methods: (0, _extends3.default)({}, (0, _vuex.mapActions)(['setCurrentStudy', 'setStudies', 'openStudy']), {
    continueStudy: function continueStudy(studyId) {
      var self = this;
      this.alert('LOADING...');
      this.openStudy(studyId).done(function (x) {
        self.$router.push('/activities');
        self.analytics.trackEvent('ContinueStudy', 'click', self.getCurrentStudy.passage.description());
      }).always(self.dismissAlert);
    },
    toggleAbout: function toggleAbout(aboutView) {
      this.$el.querySelector('.about-tw .shrinkable').classList.toggle('shrunk');
      this.$el.querySelector('.about-tw .fa-chevron-right').classList.toggle('fa-rotate-90');
    },
    userPressed: function userPressed() {
      var self = this;
      this.setAlertCallback(function (confirmation) {
        if (confirmation === 'yes') {
          self.getPersistor.signOut();
        }
        self.dismissAlert();
      });
      this.alert('Sign out?', 'confirm');
    }
  }),
  mounted: function mounted() {
    this.refreshData();
  }
};

/***/ }),
/* 100 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  components: {},
  props: ['title', 'subtitle']
};

/***/ }),
/* 102 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "card"
  }, [_c('div', {
    staticClass: "card-header shadow flex-row"
  }, [_c('div', {
    staticClass: "card-title flex-zero callout"
  }, [_vm._v(_vm._s(_vm.title))]), _vm._v(" "), _c('div', {
    staticClass: "card-subtitle flex-one callout"
  }, [_vm._v(_vm._s(_vm.subtitle))])]), _vm._v(" "), _c('div', {
    staticClass: "card-content shadow theme-mid"
  }, [_vm._t("default")], 2)])
},staticRenderFns: []}

/***/ }),
/* 103 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('titlebar', {
    attrs: {
      "title": "TRUE WORDS"
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "flex-column vfull theme-back"
  }, [_c('div', {
    staticClass: "flex-one home-root"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('card', {
    staticClass: "nopad",
    attrs: {
      "title": "BEGIN",
      "subtitle": "Choose a Bible text to study"
    }
  }, [_c('div', {
    staticClass: "flex-row clearfix theme-back"
  }, [_c('router-link', {
    staticClass: "flex-one text-center testament-button theme-mid hover",
    attrs: {
      "to": "/choosepassage?t=ot"
    }
  }, [_vm._v("OLD TESTAMENT")]), _vm._v(" "), _c('router-link', {
    staticClass: "flex-one text-center testament-button theme-mid hover",
    attrs: {
      "to": "/choosepassage?t=nt"
    }
  }, [_vm._v("NEW TESTAMENT")])], 1)]), _vm._v(" "), _c('div', {
    staticClass: "theme-mid shadow",
    on: {
      "click": function($event) {
        _vm.toggleAbout($event.target)
      }
    }
  }, [_vm._m(0)]), _vm._v(" "), _c('card', {
    attrs: {
      "title": "CONTINUE",
      "subtitle": "Choose a study"
    }
  }, [(_vm.isAuthenticated && _vm.isLoadingData) ? _c('div', {
    staticClass: "callout-light alt"
  }, [_c('p', {
    staticClass: "text-center"
  }, [_c('i', {
    staticClass: "fa fa-circle-o-notch fa-2x fa-spin"
  })])]) : _vm._e(), _vm._v(" "), (_vm.isAuthenticated === true && !_vm.isLoadingData) ? _c('div', [(_vm.manyStudies) ? _c('p', {
    staticClass: "muted"
  }, [_vm._v("RECENT STUDIES "), _c('span', {
    staticClass: "callout-light alt"
  }, [_vm._v("| " + _vm._s(_vm.getStudies.length) + " TOTAL")])]) : _vm._e(), _vm._v(" "), _vm._l((_vm.recentStudies), function(study) {
    return _c('div', {
      key: study.id,
      staticClass: "row study",
      on: {
        "click": function($event) {
          _vm.continueStudy(study.id)
        }
      }
    }, [_c('div', {
      staticClass: "list-item col-xs-12"
    }, [_c('p', {
      staticClass: "col-sm-6 hidden-xs"
    }, [_vm._v(_vm._s(study.passage.description()))]), _vm._v(" "), _c('p', {
      staticClass: "col-sm-6 hidden-xs text-right muted"
    }, [_vm._v(_vm._s(study.lastEditLabel()) + " "), _c('span', {
      staticClass: "bible"
    }, [_vm._v(_vm._s(study.bible))])]), _vm._v(" "), _c('div', {
      staticClass: "col-sm-12 visible-xs nopad-left nopad-right"
    }, [_c('p', [_vm._v(_vm._s(study.passage.description()) + ",  "), _c('span', {
      staticClass: "muted"
    }, [_vm._v(_vm._s(study.lastEditLabel()) + " (" + _vm._s(study.bible) + ")")])])])])])
  }), _vm._v(" "), (_vm.manyStudies) ? _c('router-link', {
    staticClass: "btn callout-light btn-block",
    attrs: {
      "to": "Studies"
    }
  }, [_vm._v("ALL STUDIES")]) : _vm._e(), _vm._v(" "), (_vm.getStudies.length <= 0) ? _c('div', {
    staticClass: "muted flex-row"
  }, [_c('div', {
    staticClass: "flex-one"
  }, [_c('i', [_vm._v("No studies found")])]), _vm._v(" "), _c('div', {
    staticClass: "flex-zero"
  }, [_c('a', {
    staticClass: "refresh-studies",
    on: {
      "click": function($event) {
        _vm.refreshData()
      }
    }
  }, [_vm._v("reload")])])]) : _vm._e()], 2) : _vm._e(), _vm._v(" "), (_vm.isAuthenticated === false) ? _c('div', {
    staticClass: "sign-in-view"
  }, [_c('p', {
    staticClass: "muted"
  }, [_vm._v("You are not signed in.")]), _vm._v(" "), _c('p', {
    staticClass: "muted"
  }, [_vm._v("Sign in to save your studies.")]), _vm._v(" "), _c('router-link', {
    staticClass: "btn theme-hi btn-lg",
    attrs: {
      "to": "Login?referrer=Home"
    }
  }, [_vm._v("SIGN IN")])], 1) : _vm._e()])], 1)]), _vm._v(" "), _c('div', {
    staticClass: "bottombar clearfix flex-zero"
  }, [_c('div', {
    staticClass: "pull-left"
  }, [_c('router-link', {
    staticClass: "settings",
    attrs: {
      "to": "Settings"
    }
  }, [_c('i', {
    staticClass: "fa fa-gear muted"
  })])], 1), _vm._v(" "), _c('div', {
    staticClass: "pull-right muted user",
    on: {
      "click": _vm.userPressed
    }
  }, [(_vm.userimage) ? _c('img', {
    staticClass: "user-img",
    attrs: {
      "src": _vm.userimage
    }
  }) : _vm._e(), _vm._v("\n        " + _vm._s(_vm.username) + "\n      ")])])])], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "about-tw"
  }, [_c('p', [_c('i', {
    staticClass: "fa fa-play callout-light"
  }), _vm._v(" "), _c('span', {
    staticClass: "about-title callout-light alt"
  }, [_vm._v("ABOUT")]), _vm._v(" "), _c('span', [_vm._v("Read the Bible intentionally...")])]), _vm._v(" "), _c('i', {
    staticClass: "fa fa-chevron-right muted"
  }), _vm._v(" "), _c('div', {
    staticClass: "shrinkable shrunk"
  }, [_c('div', {
    staticClass: "video-intro embed-responsive embed-responsive-16by9"
  }, [_c('iframe', {
    attrs: {
      "src": "https://www.youtube.com/embed/pYVs7p-lgzY?rel=0",
      "frameborder": "0",
      "allowfullscreen": ""
    }
  })]), _vm._v(" "), _c('p', {
    staticClass: "list-item"
  }, [_vm._v("True Words will help you learn skills so that as you read the Bible you can "), _c('i', {
    staticClass: "callout-light alt"
  }, [_vm._v("know")]), _vm._v(" what the text says, "), _c('i', {
    staticClass: "callout-light alt"
  }, [_vm._v("understand")]), _vm._v(" what it means, and "), _c('i', {
    staticClass: "callout-light alt"
  }, [_vm._v("apply")]), _vm._v(" it to your life. This tool was made with "), _c('i', {
    staticClass: "callout-light alt"
  }, [_vm._v("everyone")]), _vm._v(" in mind, children and scholars alike. Taste and see that the Lord is good!")])])])
}]}

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(105)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(106),
  /* template */
  __webpack_require__(107),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 105 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _vuex = __webpack_require__(1);

var _Titlebar = __webpack_require__(5);

var _Titlebar2 = _interopRequireDefault(_Titlebar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      versions: [{ display: 'ESV', name: 'English Standard Version', id: 'ESV' }, { display: 'NASB', name: 'New American Standard Bible', id: 'NASB' }, { display: 'RVR60 (Español)', name: 'Reina-Valera 1960', id: 'RVR60' }]
    };
  },

  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)(['getCurrentBible'])),
  components: {
    Titlebar: _Titlebar2.default
  },
  methods: (0, _extends3.default)({
    closePressed: function closePressed() {
      this.$router.back();
    },
    bibleSelected: function bibleSelected(bible) {
      this.setCurrentBible(bible);
      this.$router.back();
    }
  }, (0, _vuex.mapActions)(['setCurrentBible'])),
  mounted: function mounted() {}
};

/***/ }),
/* 107 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('titlebar', {
    attrs: {
      "title": "BIBLE CHOOSER",
      "left-items": ['close'],
      "on-close": _vm.closePressed
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "container substance"
  }, _vm._l((_vm.versions), function(version) {
    return _c('div', {
      staticClass: "version shadow-light text-center theme-mid hover",
      on: {
        "click": function($event) {
          _vm.bibleSelected(version.id)
        }
      }
    }, [_c('h1', [_vm._v(_vm._s(version.display))]), _vm._v(" "), _c('p', {
      staticClass: "muted"
    }, [_vm._v(_vm._s(version.name))])])
  }))], 1)
},staticRenderFns: []}

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(109)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(110),
  /* template */
  __webpack_require__(115),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 109 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _jquery = __webpack_require__(3);

var _jquery2 = _interopRequireDefault(_jquery);

var _vuex = __webpack_require__(1);

var _Titlebar = __webpack_require__(5);

var _Titlebar2 = _interopRequireDefault(_Titlebar);

var _bible = __webpack_require__(8);

var _PassageViewer = __webpack_require__(28);

var _PassageViewer2 = _interopRequireDefault(_PassageViewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      otBooks: _bible.Bible.otBooks,
      testament: 'NT',
      selectedBook: undefined,
      selectedBookName: _bible.Bible.bookName(this.selectedBook),
      selectedChapter: 1,
      chapterCount: 0,
      ntBooks: _bible.Bible.ntBooks
    };
  },

  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)(['getCurrentBible'])),
  components: {
    Titlebar: _Titlebar2.default, PassageViewer: _PassageViewer2.default
  },
  mounted: function mounted() {
    this.$route.query.t === 'ot' ? this.toggleTestament('OT') : this.toggleTestament('NT');
  },

  methods: {
    toggleTestament: function toggleTestament(tm) {
      this.testament = tm;
      this.selectedBook = undefined;
    },
    chooseBible: function chooseBible() {
      this.$router.push('bible_chooser');
    },
    bookSelected: function bookSelected(element) {
      this.selectedBook = (0, _jquery2.default)(element).data('book');
      this.selectedBookName = _bible.Bible.bookName(this.selectedBook);
      this.chapterCount = _bible.Bible.chapters(this.selectedBook);
      (0, _jquery2.default)('.nav-pills > a[href="#chapter-chooser"]').tab('show');
    },
    chapterSelected: function chapterSelected(element) {
      this.selectedChapter = -1;
      this.selectedChapter = (0, _jquery2.default)(element).closest('.chapter-label-container').data('chapter');
      this.$router.push('viewpassage?book=' + this.selectedBook + '&chapter=' + this.selectedChapter);
    }
  }
};

/***/ }),
/* 111 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _vue = __webpack_require__(11);

var _vue2 = _interopRequireDefault(_vue);

var _bible = __webpack_require__(8);

var _bibleloader = __webpack_require__(113);

var _bibleloader2 = _interopRequireDefault(_bibleloader);

var _vuex = __webpack_require__(1);

var _jquery = __webpack_require__(3);

var _jquery2 = _interopRequireDefault(_jquery);

var _Titlebar = __webpack_require__(5);

var _Titlebar2 = _interopRequireDefault(_Titlebar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      bible: _bible.Bible,
      bookIdentifier: undefined,
      chapter: undefined,
      verses: undefined,
      cachedVerses: {},
      startingVerse: undefined,
      endingVerse: undefined,
      readingMode: 'list',
      loading: false
    };
  },

  components: {
    Titlebar: _Titlebar2.default
  },
  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)(['getCurrentBible']), {
    isPassageSelected: function isPassageSelected() {
      return this.startingVerse !== undefined;
    },
    actionText: function actionText() {
      if (this.startingVerse !== undefined && this.endingVerse !== undefined) {
        return 'BEGIN, OR TAP VERSES TO EDIT SELECTION';
      } else if (this.startingVerse !== undefined) {
        return 'SELECT AN ENDING VERSE, OR BEGIN';
      } else {
        return 'SELECT A STARTING VERSE';
      }
    },
    readingModeButtonClass: function readingModeButtonClass() {
      return this.readingMode === 'list' ? ['glyphicon-align-center'] : ['glyphicon-list'];
    }
  }),
  watch: {
    chapter: function chapter(value) {
      if (this.bookIdentifier !== undefined && value > 0) {
        this.loadVerses();
      }
    },
    bookIdentifier: function bookIdentifier(value) {
      if (this.chapter !== undefined) {
        this.loadVerses();
      }
    }
  },
  methods: (0, _extends3.default)({
    loadVerses: function loadVerses() {
      var cache = this.getCache(this.getCurrentBible, this.bookIdentifier, this.chapter);
      if (cache !== undefined) {
        this.verses = cache;
        (0, _jquery2.default)('.viewer').animate({ scrollTop: 0 }, 'slow');
      } else {
        var self = this;
        this.loading = true;
        _bibleloader2.default.load(this.bookIdentifier, this.chapter, this.getCurrentBible, function (json) {
          json.forEach(function (v) {
            v.chapter = self.chapter;
          });
          self.cacheVerses(self.getCurrentBible, self.bookIdentifier, self.chapter, json);
          self.verses = json;
          self.loading = false;
          (0, _jquery2.default)('.viewer').animate({ scrollTop: 0 }, 'slow');
        });
      }
    },
    goBack: function goBack() {
      this.$router.back();
    },
    toggleTextStyle: function toggleTextStyle() {
      this.readingMode = this.readingMode === 'list' ? 'inline' : 'list';
    },
    isSelected: function isSelected(verse) {
      if (this.bookIdentifier && this.chapter) {
        var bibleVerse = new _bible.Verse(this.bookIdentifier, this.chapter, verse.number);
        return _bible.Bible.passageContains(this.startingVerse, this.endingVerse, bibleVerse);
      }
      return false;
    },
    getCache: function getCache(bibleVersion, book, chapter, verses) {
      if (this.cachedVerses[bibleVersion]) {
        if (this.cachedVerses[bibleVersion][book]) {
          return this.cachedVerses[bibleVersion][book][chapter];
        }
      }
      return undefined;
    },
    cacheVerses: function cacheVerses(bibleVersion, book, chapter, verses) {
      if (this.cachedVerses[bibleVersion] === undefined) {
        this.cachedVerses[bibleVersion] = {};
      }
      if (this.cachedVerses[bibleVersion][book] === undefined) {
        this.cachedVerses[bibleVersion][book] = {};
      }
      this.cachedVerses[bibleVersion][book][chapter] = verses;
    },
    verseSelected: function verseSelected(element) {
      var verseElement = element.closest('.verse');
      var selectedVerseNumber = (0, _jquery2.default)(verseElement).data('verse');
      var bibleVerse = new _bible.Verse(this.bookIdentifier, this.chapter, selectedVerseNumber);
      if (this.startingVerse === undefined) {
        this.startingVerse = bibleVerse;
      } else if (this.startingVerse.equals(bibleVerse)) {
        this.startingVerse = undefined;
        this.endingVerse = undefined;
      } else {
        if (bibleVerse.isAfter(this.startingVerse)) {
          this.endingVerse = bibleVerse;
        } else {
          this.endingVerse = this.endingVerse || this.startingVerse;
          this.startingVerse = bibleVerse;
        }
        _vue2.default.set(this.verses, 0, this.verses[0]);
      }
    },
    chapterBack: function chapterBack() {
      this.chapter = this.chapter === 1 ? 1 : this.chapter - 1;
    },
    chapterForward: function chapterForward() {
      this.chapter = this.chapter === _bible.Bible.chapters(this.bookIdentifier) ? this.chapter : this.chapter + 1;
    },
    bookNavSelected: function bookNavSelected() {
      this.cachedVerses = {};
      this.$router.push('/choosepassage');
    },
    getVerses: function getVerses() {
      var _this = this;

      var self = this;
      var cachedBook = this.cachedVerses[this.getCurrentBible][this.bookIdentifier];
      var verses = cachedBook[this.startingVerse.chapter].filter(function (v) {
        return v.number >= self.startingVerse.number;
      });
      if (this.endingVerse.chapter > this.startingVerse.chapter) {
        for (var i = this.startingVerse.chapter + 1; i <= this.endingVerse.chapter; i++) {
          if (i === this.endingVerse.chapter) {
            verses = verses.concat(cachedBook[i].filter(function (v) {
              return v.number <= _this.endingVerse.number;
            }));
          } else {
            verses = verses.concat(cachedBook[i]);
          }
        }
      } else {
        verses = verses.filter(function (v) {
          return v.number <= self.endingVerse.number;
        });
      }
      return verses;
    },
    beginPressed: function beginPressed() {
      var versesArray = this.getVerses();
      var passage = _bible.Bible.buildPassage(this.startingVerse, this.endingVerse);
      var self = this;
      this.alert('SAVING...');
      this.createNewStudy({ passage: passage, verses: versesArray }).done(function () {
        self.cachedVerses = {};
        self.$router.push('/activities');
      }).fail(function () {
        self.alert('Failed to create study', 'ok');
      }).always(self.dismissAlert);
    }
  }, (0, _vuex.mapActions)(['createNewStudy'])),
  mounted: function mounted() {
    this.bookIdentifier = this.$route.query.book || 'MATTHEW';
    this.chapter = parseInt(this.$route.query.chapter) || 1;
  }
};

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(3);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ESV = window.esv;
exports.default = {
  load: function load(bookIdentifier, chapter, version, onload) {
    if (version === 'NASB') {
      var path = '/static/bibles/nasb/' + bookIdentifier + '/' + chapter + '.json';
      _jquery2.default.getJSON(path, function (json) {
        onload(json);
      });
    } else if (version === 'ESV') {
      _jquery2.default.ajax({
        url: 'https://bible.truewordsapp.com/esv/' + bookIdentifier + '/' + chapter,
        type: 'GET',
        beforeSend: function beforeSend(xhr) {
          xhr.setRequestHeader('x-esv-api-key', ESV);
        },
        success: function success(verses) {
          verses.forEach(function (v) {
            v.text = v.text.replace(/<f>\d*<\/f>/g, '');
          });
          onload(verses);
        }
      });
    } else {
      _jquery2.default.ajax({
        url: 'https://bible.truewordsapp.com/verses/' + version + '/' + bookIdentifier + '/' + chapter,
        type: 'GET',
        success: onload
      });
    }
  }
};

/***/ }),
/* 114 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('titlebar', {
    attrs: {
      "left-items": ['back'],
      "on-back": _vm.goBack
    }
  }, [_c('div', {
    staticClass: "btn-group",
    attrs: {
      "role": "group",
      "aria-label": "chapter-nav"
    },
    slot: "center"
  }, [_c('button', {
    staticClass: "btn theme-mid shadow",
    attrs: {
      "type": "button"
    },
    on: {
      "click": function($event) {
        _vm.chapterBack()
      }
    }
  }, [_c('span', {
    staticClass: "glyphicon glyphicon-chevron-left"
  })]), _vm._v(" "), _c('button', {
    staticClass: "btn theme-mid shadow off",
    attrs: {
      "type": "button"
    },
    on: {
      "click": function($event) {
        _vm.bookNavSelected()
      }
    }
  }, [_vm._v(_vm._s(_vm.bible.bookName(_vm.bookIdentifier)) + " " + _vm._s(_vm.chapter))]), _vm._v(" "), _c('button', {
    staticClass: "btn theme-mid shadow",
    attrs: {
      "type": "button"
    },
    on: {
      "click": function($event) {
        _vm.chapterForward()
      }
    }
  }, [_c('span', {
    staticClass: "glyphicon glyphicon-chevron-right"
  })])]), _vm._v(" "), _c('div', {
    slot: "right"
  }, [_c('span', {
    staticClass: "verses-style glyphicon",
    class: _vm.readingModeButtonClass,
    on: {
      "click": function($event) {
        _vm.toggleTextStyle()
      }
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "flex-column vfull"
  }, [_c('div', {
    staticClass: "flex-one substance"
  }, [_c('div', {
    staticClass: "container verses",
    class: {
      loading: _vm.loading, inline: _vm.readingMode === 'inline'
    }
  }, [(!_vm.verses) ? _c('p', {
    staticClass: "text-center muted"
  }, [_c('i', {
    staticClass: "fa fa-circle-o-notch fa-2x fa-spin"
  })]) : _vm._e(), _vm._v(" "), _vm._l((_vm.verses), function(verse) {
    return _c('div', {
      staticClass: "verse theme-mid hover",
      class: {
        'selected': _vm.isSelected(verse)
      },
      attrs: {
        "data-verse": verse.number
      },
      on: {
        "click": function($event) {
          _vm.verseSelected($event.target)
        }
      }
    }, [_c('span', {
      staticClass: "verse-number muted"
    }, [_vm._v(_vm._s(verse.number))]), _c('span', {
      staticClass: "verse-text"
    }, [_vm._v(_vm._s(verse.text))])])
  })], 2), _vm._v(" "), _c('div', {
    staticClass: "navigation"
  }, [_c('button', {
    staticClass: "btn btn-navigate callout-light alt hover",
    on: {
      "click": function($event) {
        _vm.chapterBack()
      }
    }
  }, [_vm._v("PREV")]), _vm._v(" "), _c('button', {
    staticClass: "btn btn-navigate callout-light alt hover",
    on: {
      "click": function($event) {
        _vm.chapterForward()
      }
    }
  }, [_vm._v("NEXT")])])]), _vm._v(" "), _c('div', {
    staticClass: "bottombar flex-zero"
  }, [_c('p', {
    staticClass: "text-center passage-instruction pulse"
  }, [_vm._v(_vm._s(_vm.actionText))]), _vm._v(" "), (_vm.isPassageSelected) ? _c('button', {
    staticClass: "btn btn-lg callout-light btn-block study-begin",
    on: {
      "click": function($event) {
        _vm.beginPressed()
      }
    }
  }, [_vm._v("BEGIN")]) : _vm._e()])])], 1)
},staticRenderFns: []}

/***/ }),
/* 115 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('titlebar', {
    attrs: {
      "title": "BIBLE",
      "left-items": ['home']
    }
  }, [_c('a', {
    on: {
      "click": function($event) {
        _vm.chooseBible()
      }
    },
    slot: "right"
  }, [_vm._v(_vm._s(_vm.getCurrentBible))])]), _vm._v(" "), _c('div', {
    staticClass: "container substance theme-back"
  }, [_c('div', {
    staticClass: "flex-row testament-tabs"
  }, [_c('button', {
    staticClass: "btn flex-one callout-light",
    class: {
      alt: _vm.testament === 'NT'
    },
    on: {
      "click": function($event) {
        _vm.toggleTestament('OT')
      }
    }
  }, [_vm._v("OLD TESTAMENT")]), _vm._v(" "), _c('button', {
    staticClass: "btn flex-one callout-light",
    class: {
      alt: _vm.testament === 'OT'
    },
    on: {
      "click": function($event) {
        _vm.toggleTestament('NT')
      }
    }
  }, [_vm._v("NEW TESTAMENT")])]), _vm._v(" "), _c('div', {
    attrs: {
      "id": "passageChooser"
    }
  }, [(!_vm.selectedBook) ? _c('div', [(_vm.testament === 'OT') ? _c('div', {
    staticClass: "clearfix",
    attrs: {
      "id": "ot-chooser"
    }
  }, _vm._l((_vm.otBooks), function(book, index) {
    return _c('div', {
      staticClass: "col-xs-6 col-sm-3 col-md-5c book"
    }, [_c('div', {
      key: index,
      staticClass: "book-name shadow theme-mid hover",
      attrs: {
        "data-book": book.identifier
      },
      on: {
        "click": function($event) {
          _vm.bookSelected($event.target)
        }
      }
    }, [_vm._v(_vm._s(book.name))])])
  })) : _vm._e(), _vm._v(" "), (_vm.testament === 'NT') ? _c('div', {
    staticClass: "clearfix",
    attrs: {
      "id": "nt-chooser"
    }
  }, _vm._l((_vm.ntBooks), function(book, index) {
    return _c('div', {
      staticClass: "col-xs-6 col-sm-3 col-md-5c book"
    }, [_c('div', {
      key: index,
      staticClass: "book-name shadow theme-mid hover",
      attrs: {
        "data-book": book.identifier
      },
      on: {
        "click": function($event) {
          _vm.bookSelected($event.target)
        }
      }
    }, [_vm._v(_vm._s(book.name))])])
  })) : _vm._e()]) : _vm._e(), _vm._v(" "), (_vm.selectedBook) ? _c('div', {
    staticClass: "clearfix",
    attrs: {
      "id": "chapter-chooser"
    }
  }, [_c('p', {
    staticClass: "selected-book text-center theme-mid"
  }, [_vm._v(_vm._s(_vm.selectedBookName))]), _vm._v(" "), _vm._l((_vm.chapterCount), function(n, index) {
    return _c('div', {
      staticClass: "col-xs-2 col-md-1 chapter"
    }, [_c('div', {
      staticClass: "chapter-sizer"
    }), _vm._v(" "), _c('div', {
      key: index,
      staticClass: "chapter-label-container",
      attrs: {
        "data-chapter": n
      },
      on: {
        "click": function($event) {
          _vm.chapterSelected($event.target)
        }
      }
    }, [_c('p', {
      staticClass: "chapter-label shadow theme-mid hover"
    }, [_vm._v(_vm._s(n))])])])
  })], 2) : _vm._e()])])], 1)
},staticRenderFns: []}

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(117)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(118),
  /* template */
  __webpack_require__(119),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-27c2933a",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 117 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _vuex = __webpack_require__(1);

var _Titlebar = __webpack_require__(5);

var _Titlebar2 = _interopRequireDefault(_Titlebar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {};
  },

  components: { Titlebar: _Titlebar2.default },
  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)(['getStudies', 'getCurrentStudy'])),
  methods: (0, _extends3.default)({}, (0, _vuex.mapActions)(['openStudy']), {
    continueStudy: function continueStudy(studyId) {
      var self = this;
      this.alert('LOADING...');
      this.openStudy(studyId).done(function (x) {
        self.$router.push('/activities');
        self.analytics.trackEvent('ContinueStudy', 'click', self.getCurrentStudy.passage.description());
      }).always(self.dismissAlert);
    }
  })
};

/***/ }),
/* 119 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('titlebar', {
    attrs: {
      "title": "STUDIES",
      "left-items": ['home']
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "container studies-root theme-back"
  }, _vm._l((_vm.getStudies), function(study) {
    return _c('div', {
      key: study.id,
      staticClass: "row study",
      on: {
        "click": function($event) {
          _vm.continueStudy(study.id)
        }
      }
    }, [_c('div', {
      staticClass: "study-label theme-mid hover shadow col-xs-12"
    }, [_c('p', {
      staticClass: "col-sm-6 hidden-xs"
    }, [_vm._v(_vm._s(study.passage.description()))]), _vm._v(" "), _c('p', {
      staticClass: "col-sm-6 hidden-xs text-right muted"
    }, [_vm._v(_vm._s(study.lastEditLabel()) + " "), _c('span', {
      staticClass: "bible"
    }, [_vm._v(_vm._s(study.bible))])]), _vm._v(" "), _c('div', {
      staticClass: "col-sm-12 visible-xs nopad-left nopad-right"
    }, [_c('p', [_vm._v(_vm._s(study.passage.description()) + ",  "), _c('span', {
      staticClass: "muted"
    }, [_vm._v(_vm._s(study.lastEditLabel()) + " (" + _vm._s(study.bible) + ")")])])])])])
  }))], 1)
},staticRenderFns: []}

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(121)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(122),
  /* template */
  __webpack_require__(123),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-48ecae2a",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 121 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _activity = __webpack_require__(4);

var _activity2 = _interopRequireDefault(_activity);

var _Titlebar = __webpack_require__(5);

var _Titlebar2 = _interopRequireDefault(_Titlebar);

var _Card = __webpack_require__(19);

var _Card2 = _interopRequireDefault(_Card);

var _vuex = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      activities: _activity2.default
    };
  },

  components: {
    Titlebar: _Titlebar2.default, Card: _Card2.default
  },
  props: ['data'],
  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)(['getCurrentStudy', 'getPersistor'])),
  methods: (0, _extends3.default)({
    goToReaderView: function goToReaderView() {
      this.$router.push('/reader');
    },
    goToHymnView: function goToHymnView() {
      var passage = encodeURIComponent(this.getCurrentStudy.passage.description());
      this.$router.push('/hymns?passage=' + passage);
    },

    activitySelected: function activitySelected(type) {
      if (this.isEnabled(type)) {
        this.setCurrentActivity(type);
        this.$router.push('/activity');
      } else {
        this.alert(this.activities.manager.titleForType(type) + ' activity coming soon!', 'ok');
      }
    },
    login: function login() {
      this.$router.push('login?referrer=activities');
    },
    completedActivity: function completedActivity(type) {
      return this.getCurrentStudy.findActivity(type);
    },
    completionPhrase: function completionPhrase(type) {
      var activity = this.getCurrentStudy.findActivity(type);
      if (activity !== undefined) {
        var days = daysAgo(activity.creationDate);
        var phrase = (days === 0 ? 'today' : days + ' days ago') + '';
        return '<span class="muted light">' + phrase + '</span>&nbsp;&nbsp;<span class="glyphicon glyphicon-ok-circle green"></span>';
      }
      return '';
    },

    isEnabled: function isEnabled(type) {
      return this.activities.manager.find(type).enabled;
    },
    deletePressed: function deletePressed() {
      var self = this;
      this.setAlertCallback(function (id) {
        if (id === 'yes') {
          self.dismissAlert();
          self.alert('Deleting this study...');
          self.getPersistor.deleteStudy(self.getCurrentStudy.id).done(function () {
            self.dismissAlert();
            self.$router.replace('/');
          }).fail(function () {
            self.alert('Failed to delete this study', 'ok');
          });
        } else {
          self.dismissAlert();
        }
      });
      this.alert('Are you sure you want to delete this study?', 'confirm');
    }
  }, (0, _vuex.mapActions)(['setCurrentActivity']))
};


function daysAgo(date) {
  var oneDay = 24 * 60 * 60 * 1000;
  var now = new Date();
  return Math.round(Math.abs((date.getTime() - now.getTime()) / oneDay));
}

/***/ }),
/* 123 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {}, [_c('titlebar', {
    attrs: {
      "title": "ACTIVITIES",
      "left-items": ['home']
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "container substance"
  }, [_c('div', {
    staticClass: "passage-label brand-font theme-back"
  }, [_vm._v("\n      " + _vm._s(_vm.getCurrentStudy.passage.description()) + "\n    ")]), _vm._v(" "), (!_vm.getPersistor.isLoggedIn()) ? _c('div', {
    staticClass: "text-center"
  }, [_c('button', {
    staticClass: "btn callout-light",
    on: {
      "click": function($event) {
        _vm.login()
      }
    }
  }, [_vm._v("Login to save your work")]), _vm._v(" "), _c('hr')]) : _vm._e(), _vm._v(" "), _c('card', {
    attrs: {
      "title": "PREPARE"
    }
  }, [_c('div', {
    staticClass: "list-item theme-mid",
    on: {
      "click": function($event) {
        _vm.goToReaderView()
      }
    }
  }, [_vm._v("Read the text")]), _vm._v(" "), _c('div', {
    staticClass: "list-item theme-mid",
    on: {
      "click": function($event) {
        _vm.goToHymnView()
      }
    }
  }, [_vm._v("Hymns")])]), _vm._v(" "), _c('card', {
    attrs: {
      "title": "OBSERVE",
      "subtitle": "What does it say?"
    }
  }, _vm._l((_vm.activities.manager.observationActivities), function(type) {
    return _c('div', {
      staticClass: "list-item flex-row theme-mid",
      on: {
        "click": function($event) {
          _vm.activitySelected(type)
        }
      }
    }, [_c('div', {
      staticClass: "flex-one"
    }, [_vm._v(_vm._s(_vm.activities.manager.titleForType(type)))]), _vm._v(" "), _c('div', {
      staticClass: "flex-zero nowrap text-right",
      domProps: {
        "innerHTML": _vm._s(_vm.completionPhrase(type))
      }
    })])
  })), _vm._v(" "), _c('card', {
    attrs: {
      "title": "INTERPRET",
      "subtitle": "What does it mean?"
    }
  }, _vm._l((_vm.activities.manager.interpretationActivities), function(type) {
    return _c('div', {
      staticClass: "list-item flex-row theme-mid",
      on: {
        "click": function($event) {
          _vm.activitySelected(type)
        }
      }
    }, [_c('div', {
      staticClass: "flex-one"
    }, [_vm._v(_vm._s(_vm.activities.manager.titleForType(type)))]), _vm._v(" "), _c('div', {
      staticClass: "flex-zero nowrap text-right",
      domProps: {
        "innerHTML": _vm._s(_vm.completionPhrase(type))
      }
    })])
  })), _vm._v(" "), _c('card', {
    attrs: {
      "title": "APPLY",
      "subtitle": "What should I do?"
    }
  }, _vm._l((_vm.activities.manager.applicationActivities), function(type) {
    return _c('div', {
      staticClass: "list-item flex-row theme-mid",
      on: {
        "click": function($event) {
          _vm.activitySelected(type)
        }
      }
    }, [_c('div', {
      staticClass: "flex-one"
    }, [_vm._v(_vm._s(_vm.activities.manager.titleForType(type)))]), _vm._v(" "), _c('div', {
      staticClass: "flex-zero nowrap text-right",
      domProps: {
        "innerHTML": _vm._s(_vm.completionPhrase(type))
      }
    })])
  })), _vm._v(" "), _c('div', {
    staticClass: "delete-view"
  }, [_c('button', {
    staticClass: "btn",
    on: {
      "click": function($event) {
        _vm.deletePressed()
      }
    }
  }, [_vm._v("DELETE STUDY")])])], 1)], 1)
},staticRenderFns: []}

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(125)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(126),
  /* template */
  __webpack_require__(248),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 125 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = __webpack_require__(10);

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _jquery = __webpack_require__(3);

var _jquery2 = _interopRequireDefault(_jquery);

var _store = __webpack_require__(12);

var _store2 = _interopRequireDefault(_store);

var _vuex = __webpack_require__(1);

var _activity = __webpack_require__(4);

var _activity2 = _interopRequireDefault(_activity);

var _ActivityDataFactory = __webpack_require__(127);

var _ActivityDataFactory2 = _interopRequireDefault(_ActivityDataFactory);

var _ActivityAchievement = __webpack_require__(22);

var _ActivityAchievement2 = _interopRequireDefault(_ActivityAchievement);

var _Titlebar = __webpack_require__(5);

var _Titlebar2 = _interopRequireDefault(_Titlebar);

var _Menubar = __webpack_require__(128);

var _Menubar2 = _interopRequireDefault(_Menubar);

var _Buckets = __webpack_require__(131);

var _Buckets2 = _interopRequireDefault(_Buckets);

var _Actions = __webpack_require__(135);

var _Actions2 = _interopRequireDefault(_Actions);

var _Adjectives = __webpack_require__(148);

var _Adjectives2 = _interopRequireDefault(_Adjectives);

var _Topics = __webpack_require__(152);

var _Topics2 = _interopRequireDefault(_Topics);

var _Outline = __webpack_require__(158);

var _Outline2 = _interopRequireDefault(_Outline);

var _Paraphrase = __webpack_require__(165);

var _Paraphrase2 = _interopRequireDefault(_Paraphrase);

var _Space = __webpack_require__(169);

var _Space2 = _interopRequireDefault(_Space);

var _Stewardship = __webpack_require__(177);

var _Stewardship2 = _interopRequireDefault(_Stewardship);

var _BucketsReviewer = __webpack_require__(181);

var _BucketsReviewer2 = _interopRequireDefault(_BucketsReviewer);

var _ActionsReviewer = __webpack_require__(188);

var _ActionsReviewer2 = _interopRequireDefault(_ActionsReviewer);

var _AdjectivesReviewer = __webpack_require__(192);

var _AdjectivesReviewer2 = _interopRequireDefault(_AdjectivesReviewer);

var _TopicsReviewer = __webpack_require__(196);

var _TopicsReviewer2 = _interopRequireDefault(_TopicsReviewer);

var _OutlineReviewer = __webpack_require__(200);

var _OutlineReviewer2 = _interopRequireDefault(_OutlineReviewer);

var _ParaphraseReviewer = __webpack_require__(204);

var _ParaphraseReviewer2 = _interopRequireDefault(_ParaphraseReviewer);

var _SpaceReviewer = __webpack_require__(208);

var _SpaceReviewer2 = _interopRequireDefault(_SpaceReviewer);

var _StewardshipReviewer = __webpack_require__(212);

var _StewardshipReviewer2 = _interopRequireDefault(_StewardshipReviewer);

var _BucketsHelp = __webpack_require__(216);

var _BucketsHelp2 = _interopRequireDefault(_BucketsHelp);

var _ActionsHelp = __webpack_require__(220);

var _ActionsHelp2 = _interopRequireDefault(_ActionsHelp);

var _AdjectivesHelp = __webpack_require__(224);

var _AdjectivesHelp2 = _interopRequireDefault(_AdjectivesHelp);

var _TopicsHelp = __webpack_require__(228);

var _TopicsHelp2 = _interopRequireDefault(_TopicsHelp);

var _OutlineHelp = __webpack_require__(232);

var _OutlineHelp2 = _interopRequireDefault(_OutlineHelp);

var _ParaphraseHelp = __webpack_require__(236);

var _ParaphraseHelp2 = _interopRequireDefault(_ParaphraseHelp);

var _SpaceHelp = __webpack_require__(240);

var _SpaceHelp2 = _interopRequireDefault(_SpaceHelp);

var _StewardshipHelp = __webpack_require__(244);

var _StewardshipHelp2 = _interopRequireDefault(_StewardshipHelp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      leftMenuItems: ['close'],
      rightMenuItems: ['help'],
      activityData: undefined,
      isReviewing: false,
      lastSavedData: undefined,
      autosaveTimer: undefined
    };
  },

  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)(['getCurrentActivity', 'getCurrentStudy']), {
    title: function title() {
      return _activity2.default.manager.subtitleForType(this.getCurrentActivity);
    },
    currentActivity: function currentActivity() {
      return this.activityForType(this.getCurrentActivity);
    },
    currentReviewer: function currentReviewer() {
      return this.reviewerForType(this.getCurrentActivity);
    },
    currentHelpView: function currentHelpView() {
      return this.helpViewForType(this.getCurrentActivity);
    }
  }),
  watch: {
    isReviewing: function isReviewing(_isReviewing) {
      var _this = this;

      if (_isReviewing) {
        clearInterval(this.autosaveTimer);
        this.rightMenuItems = ['EDIT'];
        this.helpDismiss(true);
        this.analytics.trackScreen(this.title + 'Reviewer');
      } else {
        this.rightMenuItems = ['help'];
        this.startAutosaving();
        this.$nextTick(function () {
          if (_this.$refs.activity.willAppear) {
            _this.$refs.activity.willAppear();
          }
          _this.analytics.trackScreen(_this.title);
        });
      }
    }
  },
  components: {
    Titlebar: _Titlebar2.default, Menubar: _Menubar2.default, Actions: _Actions2.default, Buckets: _Buckets2.default, Adjectives: _Adjectives2.default, Topics: _Topics2.default, Outline: _Outline2.default, Paraphrase: _Paraphrase2.default, Space: _Space2.default, Stewardship: _Stewardship2.default, BucketsReviewer: _BucketsReviewer2.default, ActionsReviewer: _ActionsReviewer2.default, AdjectivesReviewer: _AdjectivesReviewer2.default, TopicsReviewer: _TopicsReviewer2.default, OutlineReviewer: _OutlineReviewer2.default, ParaphraseReviewer: _ParaphraseReviewer2.default, SpaceReviewer: _SpaceReviewer2.default, StewardshipReviewer: _StewardshipReviewer2.default, ActionsHelp: _ActionsHelp2.default, BucketsHelp: _BucketsHelp2.default, AdjectivesHelp: _AdjectivesHelp2.default, TopicsHelp: _TopicsHelp2.default, OutlineHelp: _OutlineHelp2.default, ParaphraseHelp: _ParaphraseHelp2.default, SpaceHelp: _SpaceHelp2.default, StewardshipHelp: _StewardshipHelp2.default
  },
  methods: (0, _extends3.default)({}, (0, _vuex.mapActions)(['saveActivity']), {
    startAutosaving: function startAutosaving() {
      var _this2 = this;

      clearInterval(this.autosaveTimer);
      var self = this;
      this.autosaveTimer = setInterval(function () {
        if ((0, _stringify2.default)(self.activityData) !== self.lastSavedData) {
          var achievement = new _ActivityAchievement2.default(self.currentActivity, self.activityData, new Date(), _activity2.default.manager.version(self.currentActivity));
          self.saveActivity(achievement).then(function (d) {
            self.lastSavedData = (0, _stringify2.default)(self.activityData);
            _this2.log('Progress saved');
          }).fail(function (e) {
            return _this2.log('Failed to save progress: ' + e);
          });
        }
      }, 20 * 1000);
    },
    closePressed: function closePressed() {
      this.$router.back();
    },
    helpPressed: function helpPressed() {
      (0, _jquery2.default)('#help').addClass('visible');
      (0, _jquery2.default)('#activity').addClass('blur');
      (0, _jquery2.default)('#review').addClass('blur');
    },
    helpDismiss: function helpDismiss(immediately) {
      (0, _jquery2.default)('#help').removeClass('visible');
      if (immediately === undefined || !immediately) {
        (0, _jquery2.default)('#help').addClass('not-visible');
      }
      (0, _jquery2.default)('#activity').removeClass('blur');
      (0, _jquery2.default)('#review').removeClass('blur');
    },
    titlebarSelect: function titlebarSelect(buttonTitle) {
      if (buttonTitle === 'EDIT') {
        this.isReviewing = false;
      }
    },
    onFinish: function onFinish(activityType, activityData) {
      var self = this;
      var achievement = new _ActivityAchievement2.default(activityType, activityData, new Date(), _activity2.default.manager.version(activityType));
      this.alert('SAVING...');
      this.saveActivity(achievement).done(function () {
        self.currentReviewer = self.reviewerForType(activityType);
        self.isReviewing = true;
        self.dismissAlert();
      }).fail(function (resp) {
        console.log(resp);
        self.alert('Failed to save your activity. Check your connection and try again.', 'ok');
        self.analytics.trackEvent('Error', 'saveActivity', resp);
      });
    },
    activityForType: function activityForType(activityType) {
      switch (activityType) {
        case _activity2.default.types.PeoplePlacesThings:
          return 'buckets';
        case _activity2.default.types.Actions:
          return 'actions';
        case _activity2.default.types.Adjectives:
          return 'adjectives';
        case _activity2.default.types.Topics:
          return 'topics';
        case _activity2.default.types.Outline:
          return 'outline';
        case _activity2.default.types.Paraphrase:
          return 'paraphrase';
        case _activity2.default.types.Space:
          return 'space';
        case _activity2.default.types.Stewardship:
          return 'stewardship';
        default:
          return undefined;
      }
    },
    reviewerForType: function reviewerForType(activityType) {
      switch (activityType) {
        case _activity2.default.types.PeoplePlacesThings:
          return 'buckets-reviewer';
        case _activity2.default.types.Actions:
          return 'actions-reviewer';
        case _activity2.default.types.Adjectives:
          return 'adjectives-reviewer';
        case _activity2.default.types.Topics:
          return 'topics-reviewer';
        case _activity2.default.types.Outline:
          return 'outline-reviewer';
        case _activity2.default.types.Paraphrase:
          return 'paraphrase-reviewer';
        case _activity2.default.types.Space:
          return 'space-reviewer';
        case _activity2.default.types.Stewardship:
          return 'stewardship-reviewer';
        default:
          return undefined;
      }
    },
    helpViewForType: function helpViewForType(activityType) {
      switch (activityType) {
        case _activity2.default.types.PeoplePlacesThings:
          return 'buckets-help';
        case _activity2.default.types.Actions:
          return 'actions-help';
        case _activity2.default.types.Adjectives:
          return 'adjectives-help';
        case _activity2.default.types.Topics:
          return 'topics-help';
        case _activity2.default.types.Outline:
          return 'outline-help';
        case _activity2.default.types.Paraphrase:
          return 'paraphrase-help';
        case _activity2.default.types.Space:
          return 'space-help';
        case _activity2.default.types.Stewardship:
          return 'stewardship-help';
        default:
          return undefined;
      }
    }
  }),
  store: _store2.default,
  mounted: function mounted() {
    var completedActivity = this.getCurrentStudy.findActivity(this.getCurrentActivity);
    if (completedActivity !== undefined) {
      this.activityData = completedActivity.data;
      this.isReviewing = true;
    } else {
      this.analytics.trackScreen(this.title);
      this.activityData = _ActivityDataFactory2.default.createForType(this.getCurrentActivity, this.getCurrentStudy);
      this.isReviewing = false;
      this.startAutosaving();
    }
    this.lastSavedData = (0, _stringify2.default)(this.activityData);
  },
  beforeDestroy: function beforeDestroy() {
    clearInterval(this.autosaveTimer);
  }
};

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = __webpack_require__(23);

var _assign2 = _interopRequireDefault(_assign);

var _activity = __webpack_require__(4);

var _activity2 = _interopRequireDefault(_activity);

var _ActivityData = __webpack_require__(6);

var _ActivityData2 = _interopRequireDefault(_ActivityData);

var _polyfill = __webpack_require__(7);

var _bible = __webpack_require__(8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  createForType: function createForType(activityType, study) {
    switch (activityType) {
      case _activity2.default.types.PeoplePlacesThings:
        return peoplePlacesThingsData();
      case _activity2.default.types.Actions:
        return actionsData();
      case _activity2.default.types.Adjectives:
        return adjectivesData();
      case _activity2.default.types.Topics:
        return topicsData(study);
      case _activity2.default.types.Outline:
        return outlineData(study);
      case _activity2.default.types.Paraphrase:
        return paraphraseData();
      case _activity2.default.types.Space:
        return spaceData();
      case _activity2.default.types.Stewardship:
        return stewardshipData(study);
      default:
        throw new Error('No ActivityData for this activity type');
    }
  }
};


function peoplePlacesThingsData() {
  var data = _ActivityData2.default.new();
  data.addContainer('PEOPLE', 'word-selection');
  data.addContainer('PLACES', 'word-selection');
  data.addContainer('THINGS', 'word-selection');
  return data;
}

function actionsData() {
  var data = _ActivityData2.default.new();
  data.initCollection('map');
  return data;
}

function adjectivesData() {
  var data = _ActivityData2.default.new();
  data.initCollection('map');
  return data;
}

function topicsData() {
  var data = _ActivityData2.default.new();
  data.initCollection('free-text');
  return data;
}

function outlineData(study) {
  var data = _ActivityData2.default.new();
  data.initCollection('section');
  var firstWord = study.getWords()[0];
  var lastWord = (0, _polyfill.arrayLast)(study.getWords());
  var section = new _ActivityData.Section('', new _bible.WordRange(firstWord, lastWord));
  data.collection.add(section);
  return data;
}

function paraphraseData() {
  var data = _ActivityData2.default.new();
  data.initCollection('free-text');
  return data;
}

function spaceData() {
  var data = _ActivityData2.default.new();
  data.addContainer('S', 'free-text');
  data.addContainer('P', 'free-text');
  data.addContainer('A', 'free-text');
  data.addContainer('C', 'free-text');
  data.addContainer('E', 'free-text');
  return data;
}

function stewardshipData(study) {
  var data = _ActivityData2.default.new();
  data.initCollection('question-answer');
  var freeText = new _ActivityData.FreeText(undefined, study.passage);
  data.collection.add(new _ActivityData.QuestionAnswer('time', 'What will you spend time doing?', copy(freeText)));
  data.collection.add(new _ActivityData.QuestionAnswer('money', 'For what will you spend money?', copy(freeText)));
  data.collection.add(new _ActivityData.QuestionAnswer('thoughts', 'What attitudes and ideas will you think about?', copy(freeText)));
  data.collection.add(new _ActivityData.QuestionAnswer('people', 'Who will you see and interact with?', copy(freeText)));
  data.collection.add(new _ActivityData.QuestionAnswer('affect-time', 'the way you spend your time?', copy(freeText)));
  data.collection.add(new _ActivityData.QuestionAnswer('affect-money', 'the way you spend your money?', copy(freeText)));
  data.collection.add(new _ActivityData.QuestionAnswer('affect-thoughts', 'the things you feel and think?', copy(freeText)));
  data.collection.add(new _ActivityData.QuestionAnswer('affect-people', 'the way you interact with people?', copy(freeText)));
  return data;
}

function copy(obj) {
  return (0, _assign2.default)({}, obj);
}

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(129)
}
var Component = __webpack_require__(0)(
  /* script */
  null,
  /* template */
  __webpack_require__(130),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-08f6e72d",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 129 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 130 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _vm._m(0)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    staticClass: "menubar"
  }, [_c('button', {
    staticClass: "btn btn-default pull-right"
  }, [_vm._v("Start over")])])])
}]}

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(132)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(133),
  /* template */
  __webpack_require__(134),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-0d4aa79e",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 132 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _store = __webpack_require__(12);

var _store2 = _interopRequireDefault(_store);

var _vuex = __webpack_require__(1);

var _jquery = __webpack_require__(3);

var _jquery2 = _interopRequireDefault(_jquery);

var _activity = __webpack_require__(4);

var _activity2 = _interopRequireDefault(_activity);

var _polyfill = __webpack_require__(7);

var _ActivityData = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      currentWord: undefined,
      currentWordContainer: undefined,
      activityType: _activity2.default.types.PeoplePlacesThings,
      textViewNode: undefined,
      startScrollPosition: undefined,
      startXPos: undefined,
      curDown: undefined
    };
  },

  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)({ words: 'getCurrentWords' }), {
    currentWordAssigned: function currentWordAssigned() {
      return (0, _jquery2.default)('.bucket-word.current').hasClass('red');
    },
    showScrollTip: function showScrollTip() {
      return !(0, _polyfill.isTouchDevice)();
    }
  }),
  props: ['finish', 'data'],
  watch: {
    currentWord: function currentWord(newWord, oldVal) {
      var wordId = newWord.verse + '-' + newWord.index;
      var wordElement = (0, _jquery2.default)('.bucket-word[data-word=' + wordId + ']');
      this.scrollToWord(wordElement);
      var selection = this.findContainerAndWordSelection(newWord);
      if (selection) {
        (0, _jquery2.default)('#buckets-clear-button').show();
      } else {
        (0, _jquery2.default)('#buckets-clear-button').hide();
      }
    }
  },
  methods: {
    container: function container(index) {
      return this.data.containers[index];
    },
    moveToNextWord: function moveToNextWord() {
      if (this.currentWord !== (0, _polyfill.arrayLast)(this.words)) {
        var nextWord = this.words.indexOf(this.currentWord) + 1;
        this.currentWord = this.words[nextWord];
      }
    },
    findCenterWordElement: function findCenterWordElement() {
      var centerX = (0, _jquery2.default)(window).width() / 2;
      var centerY = (0, _jquery2.default)(window).height() / 2;
      var $centerElement = (0, _jquery2.default)(document.elementFromPoint(centerX, centerY));

      if (!$centerElement.hasClass('bucket-word')) {
        return undefined;
      }

      return $centerElement;
    },
    showWordPreview: function showWordPreview() {
      if ((0, _polyfill.isTouchDevice)()) {
        var centerWord = this.findCenterWordElement();
        if (centerWord) {
          (0, _jquery2.default)('#word-viewer').addClass('scrolling');
          (0, _jquery2.default)('#word-viewer').text(centerWord.text());
        }
      }
    },
    hideWordPreview: function hideWordPreview() {
      (0, _jquery2.default)('#word-viewer').removeClass('scrolling');
    },
    determineCurrentWord: function determineCurrentWord() {
      var $centerElement = this.findCenterWordElement();

      if ($centerElement) {
        (0, _jquery2.default)('.current').removeClass('current');
        $centerElement.addClass('current');

        this.currentWord = this.words[$centerElement.data('index')];

        var result = this.findContainerAndWordSelection();
        if (result) {
          result.wordSelection.words.forEach(function (w) {
            var wordId = w.verse + '-' + w.index;
            var $wordElement = (0, _jquery2.default)('.bucket-word[data-word=' + wordId + ']');
            $wordElement.addClass('current');
          });
        }
      }
    },
    scrollToWord: function scrollToWord(wordElement) {
      var width = wordElement.width();
      var scrollLeft = (0, _jquery2.default)('.text-view').scrollLeft();
      var elementOffset = wordElement.offset().left;
      var offset = scrollLeft + elementOffset + width / 2 - (0, _jquery2.default)(window).width() / 2;
      (0, _jquery2.default)('.text-view').animate({ scrollLeft: offset }, 200, function () {
        (0, _jquery2.default)('.indicator').removeClass('active');
      });
    },
    joinLeft: function joinLeft() {
      (0, _jquery2.default)('.current:first').prev().addClass('current');
    },
    joinRight: function joinRight() {
      (0, _jquery2.default)('.current:last').next().addClass('current');
    },
    buildWordSelectionFromCurrentSelection: function buildWordSelectionFromCurrentSelection() {
      var self = this;
      var selectedWords = (0, _jquery2.default)('.current').map(function () {
        var index = parseInt(this.dataset.index);
        if (typeof index === 'number') {
          return self.words[index];
        }
      }).get();
      return new _ActivityData.WordSelection(selectedWords);
    },
    bucketClass: function bucketClass(bucketIndex) {
      if (bucketIndex === 0) {
        return 'orange';
      } else if (bucketIndex === 1) {
        return 'purple';
      } else if (bucketIndex === 2) {
        return 'red';
      }
      return '';
    },
    assignToBucket: function assignToBucket(bucketIndex) {
      var self = this;
      this.data.containers.forEach(function (container, i) {
        var wordSelection = container.search(self.currentWord);
        if (i === bucketIndex) {
          if (wordSelection === undefined) {
            container.add(self.buildWordSelectionFromCurrentSelection());
          }
        } else if (wordSelection !== undefined) {
          container.remove(wordSelection);
        }
      });

      var $currentSelection = (0, _jquery2.default)('.current');
      $currentSelection.removeClass('orange purple red');
      $currentSelection.addClass(self.bucketClass(bucketIndex));

      this.moveToNextWord();
    },
    findContainerAndWordSelection: function findContainerAndWordSelection(word) {
      var result;
      var self = this;
      this.data.containers.every(function (container, i) {
        var wordSelection = container.search(self.currentWord);
        if (wordSelection !== undefined) {
          result = { container: container, wordSelection: wordSelection };
          return false;
        }
        return true;
      });
      return result;
    },
    clearCurrentWordSelection: function clearCurrentWordSelection() {
      var result = this.findContainerAndWordSelection(this.currentWord);
      if (result) {
        result.container.remove(result.wordSelection);
        (0, _jquery2.default)('.bucket-word.current').removeClass('orange red purple');
      }
    },
    setupData: function setupData() {
      var self = this;
      (0, _jquery2.default)('.bucket-word').removeClass('orange purple red');
      this.data.containers.forEach(function (container, cIndex) {
        container.items.forEach(function (wordSelection) {
          wordSelection.words.forEach(function (word) {
            var wordId = word.verse + '-' + word.index;
            var $wordElement = (0, _jquery2.default)('.bucket-word[data-word=' + wordId + ']');
            $wordElement.addClass(self.bucketClass(cIndex));
          });
        });
      });
    },
    setupTextViewDragging: function setupTextViewDragging() {
      if (!(0, _polyfill.isTouchDevice)()) {
        var self = this;
        var $textView = (0, _jquery2.default)('.text-view');
        $textView.on('mousemove', function (e) {
          if (self.curDown) {
            $textView.scrollLeft(self.startScrollPosition + (self.startXPos - e.pageX));
          }
        });

        $textView.on('mousedown', function (e) {
          self.startScrollPosition = $textView.scrollLeft();
          self.startXPos = e.pageX;
          self.curDown = true;
        });

        $textView.on('mouseup', function (e) {
          self.curDown = false;
          if ($textView.scrollLeft() !== self.startScrollPosition) {
            (0, _jquery2.default)('.scroll-tip').fadeOut();
          }
        });
      }
    },
    willAppear: function willAppear() {
      this.setupData();
    },
    donePressed: function donePressed() {
      this.finish(this.activityType, this.data);
    }
  },
  components: {},
  store: _store2.default,
  mounted: function mounted() {
    var self = this;

    this.setupData();

    var $textView = (0, _jquery2.default)('.text-view');
    this.textViewNode = $textView[0];

    $textView.scroll(function () {
      clearTimeout(_jquery2.default.data(this, 'scrollTimer'));
      (0, _jquery2.default)('.indicator').addClass('active');
      $textView.addClass('scrolling');
      self.showWordPreview();
      _jquery2.default.data(this, 'scrollTimer', setTimeout(function () {
        $textView.removeClass('scrolling');
        self.hideWordPreview();
        self.determineCurrentWord();
      }, 250));
    });

    self.setupTextViewDragging();

    var padding = (0, _jquery2.default)(window).width() / 2 - 2;
    (0, _jquery2.default)('.text-view').css('padding-left', padding + 'px');
    (0, _jquery2.default)('.text-view').css('padding-right', padding + 'px');

    this.$nextTick(function () {
      this.currentWord = this.words[0];
      (0, _jquery2.default)('.bucket-word:nth(0)').addClass('current');
    });
  }
};

/***/ }),
/* 134 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "flex-column vfull"
  }, [_c('div', {
    staticClass: "flex-one flex-column"
  }, [_c('div', {
    staticClass: "flex-two flex-row"
  }, [_c('div', {
    staticClass: "flex-one flex-column flex-center bucket back-orange dropzone",
    attrs: {
      "data-index": "0"
    },
    on: {
      "click": function($event) {
        _vm.assignToBucket(0)
      }
    }
  }, [_c('p', [_c('i', {
    staticClass: "fa fa-user-circle-o"
  }), _vm._v(" " + _vm._s(_vm.container(0).name) + " "), (!_vm.container(0).isEmpty()) ? _c('span', {
    staticClass: "bubble"
  }, [_vm._v(_vm._s(_vm.container(0).items.length))]) : _vm._e()])]), _vm._v(" "), _c('div', {
    staticClass: "flex-one flex-column flex-center bucket back-purple dropzone",
    attrs: {
      "data-index": "1"
    },
    on: {
      "click": function($event) {
        _vm.assignToBucket(1)
      }
    }
  }, [_c('p', [_c('i', {
    staticClass: "fa fa-institution"
  }), _vm._v(" " + _vm._s(_vm.container(1).name) + " "), (!_vm.container(1).isEmpty()) ? _c('span', {
    staticClass: "bubble"
  }, [_vm._v(_vm._s(_vm.container(1).items.length))]) : _vm._e()])])]), _vm._v(" "), _c('div', {
    staticClass: "relative flex-three flex-column flex-center"
  }, [_c('div', {
    staticClass: "flex-one flex-row"
  }, [_c('div', {
    staticClass: "flex-one flex-column"
  }, [_c('div', {
    staticClass: "flex-one"
  }), _vm._v(" "), _c('div', {
    staticClass: "flex-zero join-container"
  }, [_c('div', {
    staticClass: "join-button theme-mid muted left",
    on: {
      "click": function($event) {
        _vm.joinLeft()
      }
    }
  }, [_c('span', {
    staticClass: "glyphicon glyphicon-menu-left"
  }), _vm._v(" JOIN\n            ")])])]), _vm._v(" "), _vm._m(0), _vm._v(" "), _c('div', {
    staticClass: "flex-one flex-column text-right"
  }, [_c('div', {
    staticClass: "flex-one"
  }), _vm._v(" "), _c('div', {
    staticClass: "flex-zero join-container"
  }, [_c('div', {
    staticClass: "join-button theme-mid muted right",
    on: {
      "click": function($event) {
        _vm.joinRight()
      }
    }
  }, [_vm._v("\n              JOIN "), _c('span', {
    staticClass: "glyphicon glyphicon-menu-right"
  })])])])]), _vm._v(" "), _c('div', {
    staticClass: "text-view theme-mid shadow-long"
  }, _vm._l((_vm.words), function(word, index) {
    return _c('p', {
      key: word.index,
      staticClass: "bucket-word",
      attrs: {
        "data-index": index,
        "data-word": word.verse + '-' + word.index
      }
    }, [_vm._v(_vm._s(word.text))])
  })), _vm._v(" "), _c('div', {
    staticClass: "flex-one"
  }, [_c('div', {
    staticClass: "image-button",
    attrs: {
      "id": "buckets-clear-button"
    },
    on: {
      "click": function($event) {
        _vm.clearCurrentWordSelection()
      }
    }
  }, [_c('img', {
    staticClass: "svg close-button",
    attrs: {
      "src": "/static/images/close.svg"
    }
  })]), _vm._v(" "), (_vm.showScrollTip) ? _c('div', {
    staticClass: "scroll-tip muted-more"
  }, [_vm._v("\n          Drag text to scroll\n        ")]) : _vm._e()]), _vm._v(" "), _c('div', {
    staticClass: "indicator callout-light"
  })]), _vm._v(" "), _c('div', {
    staticClass: "flex-two flex-row"
  }, [_c('div', {
    staticClass: "flex-one flex-column flex-center bucket back-red dropzone",
    attrs: {
      "data-index": "2"
    },
    on: {
      "click": function($event) {
        _vm.assignToBucket(2)
      }
    }
  }, [_c('p', [_c('i', {
    staticClass: "fa fa-tree"
  }), _vm._v(" " + _vm._s(_vm.container(2).name) + " "), (!_vm.container(2).isEmpty()) ? _c('span', {
    staticClass: "bubble"
  }, [_vm._v(_vm._s(_vm.container(2).items.length))]) : _vm._e()])])])]), _vm._v(" "), _c('div', {
    staticClass: "bottombar flex-zero",
    attrs: {
      "id": "buckets-action"
    }
  }, [_c('button', {
    staticClass: "btn-lg btn-clear btn-block",
    on: {
      "click": function($event) {
        _vm.donePressed()
      }
    }
  }, [_vm._v("DONE")])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "flex-two flex-column word-viewer-container"
  }, [_c('div', {
    staticClass: "flex-one"
  }), _vm._v(" "), _c('div', [_c('span', {
    staticClass: "theme-mid muted shadow-long",
    attrs: {
      "id": "word-viewer"
    }
  })])])
}]}

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(136)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(137),
  /* template */
  __webpack_require__(147),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 136 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _SelectableText = __webpack_require__(20);

var _SelectableText2 = _interopRequireDefault(_SelectableText);

var _SelectorBar = __webpack_require__(29);

var _SelectorBar2 = _interopRequireDefault(_SelectorBar);

var _vuex = __webpack_require__(1);

var _ActivityData = __webpack_require__(6);

var _activity = __webpack_require__(4);

var _activity2 = _interopRequireDefault(_activity);

var _polyfill = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      currentActionIndex: 0,
      currentStep: 'action',
      isSelecting: false,
      finishedSelecting: false,
      selectionDelegate: {
        onFocus: undefined,
        onChange: undefined
      }
    };
  },

  props: ['finish', 'data'],
  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)({ words: 'getCurrentWords' }), {
    actions: function actions() {
      return this.data.collection.items;
    },
    currentAction: function currentAction() {
      return this.actions[this.currentActionIndex];
    },
    action: function action() {
      return this.currentAction ? this.currentAction.action : undefined;
    },
    tense: function tense() {
      return this.currentAction ? this.currentAction.tense : undefined;
    },
    actor: function actor() {
      return this.currentAction ? this.currentAction.actor : undefined;
    },
    target: function target() {
      return this.currentAction ? this.currentAction.target : undefined;
    },
    result: function result() {
      return this.currentAction ? this.currentAction.result : undefined;
    },
    isCompletedSelectableStep: function isCompletedSelectableStep() {
      var selectableSteps = ['actor', 'target', 'result'];
      return selectableSteps.includes(this.currentStep) && this[this.currentStep] !== undefined;
    },
    stepValue: function stepValue() {
      return this[this.currentStep] ? this[this.currentStep].toString() : '';
    },
    instructionText: function instructionText() {
      if (this.currentStep === 'actor' && !this.actor) {
        var tensified = this.tense === 'past' ? 'did' : this.tense === 'future' ? 'will do' : 'does';
        return 'Select who or what ' + tensified + ' this?';
      } else if (this.currentStep === 'target' && !this.target) {
        var targetTense = this.tense === 'past' ? 'this was' : this.tense === 'future' ? 'will this be' : 'is this';
        return 'Select who or what ' + targetTense + ' done to?';
      } else if (this.currentStep === 'result' && !this.result) {
        return 'Select the result or purpose of this action?';
      } else if (this.currentStep === undefined) {
        if (this.currentActionIndex !== undefined && (this.actor || this.tense || this.target || this.result)) {
          return 'Edit the actor, tense, target or result';
        }
        return 'Optionally, find the actor, tense, target or result';
      }
      return '';
    }
  }),
  watch: {
    currentActionIndex: function currentActionIndex(newValue, oldVal) {
      if (this.$refs.selectableText) {
        this.highlighCurrentAction();
      }
      this.currentStep = 'actor';
    }
  },
  components: {
    SelectableText: _SelectableText2.default, SelectorBar: _SelectorBar2.default
  },
  methods: {
    isMode: function isMode(mode) {
      switch (mode) {
        case 'detailing':
          return this.finishedSelecting;
        case 'selecting':
          return this.isSelecting;
        case 'start':
          return !this.isSelecting && this.actions.length === 0;
        case 'selected':
          return !this.isSelecting && !this.finishedSelecting && this.actions.length > 0;
        default:
          return false;
      }
    },
    buttonClasses: function buttonClasses(step) {
      return new _polyfill.ConditionalArray(this[step] !== undefined, 'completed').and(step !== this.currentStep, 'alt').toArray();
    },
    deleteAction: function deleteAction() {
      this.setAlertCallback(this.confirmDeleteAction);
      this.alert('Are you sure you want to delete this Action, "' + this.currentAction.action.toString() + '", and all of its values (actor, target, etc.)?', 'confirm');
    },
    confirmDeleteAction: function confirmDeleteAction(response) {
      if (response === 'yes') {
        this.$refs.selectableText.clearFill(this.currentAction.action.words);
        this.data.collection.items.splice(this.currentActionIndex, 1);
        this.currentActionIndex = 0;
        this.currentStep = 'action';
        if (this.actions.length === 0) {
          this.finishedSelecting = false;
        }
        this.highlighCurrentAction();
      }
      this.dismissAlert();
    },
    onSelectionFocus: function onSelectionFocus(isFocused) {
      this.isSelecting = isFocused;
    },
    onSelectionChange: function onSelectionChange(wordSelection, operation) {
      var _this = this;

      if (!wordSelection.words || wordSelection.words.length === 0) {
        return;
      }
      if (this.isMode('detailing')) {
        this.$refs.selectableText.clearFill(wordSelection.words);
        switch (this.currentStep) {
          case 'actor':
            this.currentAction.actor = wordSelection;
            break;
          case 'target':
            this.currentAction.target = wordSelection;
            break;
          case 'result':
            this.currentAction.result = wordSelection;
            break;
          default:
            return;
        }
        this.highlighCurrentAction();
      } else if (operation === 'SELECT') {
        this.data.collection.add(new _ActivityData.Action(wordSelection));
      } else if (operation === 'DESELECT') {
        this.actions.every(function (action, i) {
          if (action.action.equals(wordSelection)) {
            _this.data.collection.items.splice(i, 1);
            return false;
          }
          return true;
        });
      }
    },
    clear: function clear(step) {
      switch (step) {
        case 'actor':
          this.currentAction.actor = undefined;
          break;
        case 'target':
          this.currentAction.target = undefined;
          break;
        case 'result':
          this.currentAction.result = undefined;
          break;
        default:
      }
      this.$refs.selectableText.clearSelection();
    },
    tenseSelected: function tenseSelected(tense) {
      this.currentAction.tense = tense;
    },
    helpSelectingPressed: function helpSelectingPressed() {
      this.alert('Swipe right to extend the end of your selection\nSwipe left to decrease the end of your selection.\nSwipe up to extend the beginning of your selection\nSwipe down to decrease the beginning. \nTap once to finish selecting. \nTap twice to remove selection.', 'ok');
    },
    beginDetailing: function beginDetailing() {
      this.data.collection.items.sort(function (a1, a2) {
        return a1.action.compare(a2.action);
      });
      this.currentStep = 'actor';
      this.finishedSelecting = true;
      this.highlighCurrentAction();
    },
    highlighCurrentAction: function highlighCurrentAction() {
      this.$refs.selectableText.clearHighlight();
      if (this.action) {
        this.$refs.selectableText.highlightWords(this.action.words, 'red');
      }
      if (this.actor) {
        this.$refs.selectableText.highlightWords(this.actor.words, 'red');
      }
      if (this.target) {
        this.$refs.selectableText.highlightWords(this.target.words);
      }
      if (this.result) {
        this.$refs.selectableText.highlightWords(this.result.words, 'orange');
      }
      this.$refs.selectableText.muteSelectedWords();
      this.$refs.selectableText.unmuteWords(this.action.words);
      this.$refs.selectableText.scrollTo(this.currentAction.action.words);
    },
    nextAction: function nextAction() {
      if (this.currentActionIndex === this.actions.length - 1) {
        this.currentActionIndex = 0;
      } else {
        this.currentActionIndex += 1;
      }
    },
    previousAction: function previousAction() {
      if (this.currentActionIndex === 0) {
        this.currentActionIndex = this.actions.length - 1;
      } else {
        this.currentActionIndex -= 1;
      }
    },
    setupData: function setupData() {
      if (this.data && this.$refs.selectableText) {
        var self = this;
        this.data.collection.items.forEach(function (actionEntry) {
          self.$refs.selectableText.setSelected(actionEntry.action.words);
        });
      }
    },
    willAppear: function willAppear() {
      this.setupData();
    },
    finishedPressed: function finishedPressed() {
      this.finish(_activity2.default.types.Actions, this.data);
    }
  },
  mounted: function mounted() {
    this.selectionDelegate.onChange = this.onSelectionChange;
    this.selectionDelegate.onFocus = this.onSelectionFocus;
    this.setupData();
  }
};

/***/ }),
/* 138 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _vuex = __webpack_require__(1);

var _jquery = __webpack_require__(3);

var _jquery2 = _interopRequireDefault(_jquery);

var _Touchpad = __webpack_require__(140);

var _Touchpad2 = _interopRequireDefault(_Touchpad);

var _ActivityData = __webpack_require__(6);

var _polyfill = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      focusedElement: undefined,
      currentSelectionIndex: 0,
      initialSelection: undefined
    };
  },

  components: { Touchpad: _Touchpad2.default },
  watch: {
    focusedElement: function focusedElement(value) {
      if (this.delegate && this.delegate.onFocus) {
        this.delegate.onFocus(value !== undefined);
      }
    }
  },
  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)({ words: 'getCurrentWords' })),
  props: ['delegate'],
  methods: {
    wordId: function wordId(word) {
      return word.verse + '-' + word.index;
    },
    broadcastChange: function broadcastChange(wordSelection, operation) {
      if (this.delegate && this.delegate.onChange) {
        this.delegate.onChange(wordSelection, operation);
      }
    },
    focused: function focused(element) {
      if (element.dataset.selection) {
        var $selection = (0, _jquery2.default)('.word[data-selection="' + element.dataset.selection + '"]');
        this.unfill($selection);
        $selection.addClass('focused');
      } else {
        (0, _jquery2.default)(element).addClass('focused');
      }
      this.focusedElement = element;
    },
    registerSelection: function registerSelection() {
      this.currentSelectionIndex += 1;
      (0, _jquery2.default)('.focused').attr('data-selection', this.currentSelectionIndex);
    },
    setSelected: function setSelected(words) {
      var _this = this;

      this.currentSelectionIndex += 1;
      var self = this;
      words.forEach(function (word) {
        var $wordElement = (0, _jquery2.default)('.word[data-id=' + self.wordId(word) + ']');
        self.fill($wordElement);
        $wordElement.attr('data-selection', _this.currentSelectionIndex);
      });
    },
    muteSelectedWords: function muteSelectedWords() {
      (0, _jquery2.default)('.filled').addClass('mute-filled');
      (0, _jquery2.default)('.filled').removeClass('filled');
    },
    unmuteWords: function unmuteWords(words) {
      var self = this;
      words.forEach(function (word) {
        var $elements = (0, _jquery2.default)('.word[data-id=' + self.wordId(word) + ']');
        $elements.removeClass('mute-filled');
        $elements.addClass('filled');
      });
    },
    clearFill: function clearFill(words) {
      var self = this;
      words.forEach(function (word) {
        var $elements = (0, _jquery2.default)('.word[data-id=' + self.wordId(word) + ']');
        self.unfill($elements);
        $elements.removeAttr('data-selection');
      });
    },
    highlightWords: function highlightWords(words, color) {
      var self = this;
      words.forEach(function (word) {
        (0, _jquery2.default)('.word[data-id=' + self.wordId(word) + ']').addClass(color ? 'highlighted-' + color : 'highlighted');
      });
    },
    selectedText: function selectedText() {
      return (0, _jquery2.default)('.focused').map(function () {
        return _jquery2.default.trim((0, _jquery2.default)(this).text());
      }).get().join(' ');
    },
    selectedWords: function selectedWords() {
      var wordSelections = [];
      var self = this;
      for (var i = 1; i <= this.currentSelectionIndex; i++) {
        var words = (0, _jquery2.default)('.word[data-selection="' + i + '"]').map(function (i, el) {
          return self.words[el.dataset.index];
        }).get();
        if (words.length > 0) {
          wordSelections.push(new _ActivityData.WordSelection(words));
        }
      }
      return wordSelections;
    },
    highlightSelection: function highlightSelection(maintainSelection) {
      (0, _jquery2.default)('.focused').addClass('highlighted');
      if (maintainSelection === undefined || !maintainSelection) {
        (0, _jquery2.default)('.focused').removeClass('focused');
      }
    },
    fill: function fill($elements) {
      $elements.addClass('filled');
      if ($elements.length > 1) {
        $elements.first().addClass('fill-start');
        $elements.last().addClass('fill-end');
      }
    },
    unfill: function unfill($elements) {
      $elements.removeClass('filled fill-start fill-end');
    },
    fillSelection: function fillSelection(maintainSelection) {
      this.fill((0, _jquery2.default)('.focused'));
      if (maintainSelection === undefined || !maintainSelection) {
        (0, _jquery2.default)('.focused').removeClass('focused');
      }
    },
    clearHighlight: function clearHighlight() {
      (0, _jquery2.default)('.word').removeClass('highlighted highlighted-red highlighted-green highlighted-orange highlighted-purple');
    },
    clearSelection: function clearSelection() {
      (0, _jquery2.default)('.focused').removeAttr('data-selection');
      (0, _jquery2.default)('.focused').removeClass('focused start end');
    },
    scrollTo: function scrollTo(words) {
      (0, _polyfill.scrollToView)((0, _jquery2.default)('.word[data-id=' + this.wordId(words[0]) + ']'), (0, _jquery2.default)('#selectable-text'));
    },
    reset: function reset() {
      (0, _jquery2.default)('.word').removeClass('highlighted focused start end');
      this.unfill((0, _jquery2.default)('.word'));
    },
    onTouchpadMove: function onTouchpadMove(direction) {
      switch (direction) {
        case 'RIGHT':
          var $nextWord = (0, _jquery2.default)('.focused').next('.word');
          if (!$nextWord.hasClass('filled')) {
            $nextWord.addClass('focused');
          }
          break;
        case 'LEFT':
          (0, _jquery2.default)('.focused').last().removeClass('focused').removeAttr('data-selection');
          break;
        case 'UP':
          var $prevWord = (0, _jquery2.default)('.focused').prev('.word');
          if (!$prevWord.hasClass('filled')) {
            $prevWord.addClass('focused');
          }
          break;
        case 'DOWN':
          (0, _jquery2.default)('.focused').first().removeClass('focused').removeAttr('data-selection');
          break;
        default:
          return;
      }
    },
    focusedWords: function focusedWords() {
      var self = this;
      return (0, _jquery2.default)('#selectable-text .word.focused').toArray().map(function (el) {
        return self.words[el.dataset.index];
      });
    },
    onTouchpadTap: function onTouchpadTap() {
      var words = this.focusedWords();
      this.registerSelection();
      this.fillSelection();
      this.focusedElement = undefined;
      this.broadcastChange(new _ActivityData.WordSelection(words), 'SELECT');
    },
    onTouchpadDoubleTap: function onTouchpadDoubleTap() {
      var words = this.focusedWords();
      this.clearSelection();
      this.focusedElement = undefined;
      this.broadcastChange(new _ActivityData.WordSelection(words), 'DESELECT');
    }
  }
};

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(141),
  /* template */
  __webpack_require__(142),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(3);

var _jquery2 = _interopRequireDefault(_jquery);

var _polyfill = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      startPosition: undefined,
      position: undefined,
      totalDeltaX: 0,
      totalDeltaY: 0,
      deltaX: 0,
      deltaY: 0,
      tapCount: 0
    };
  },

  props: ['onMove', 'onTap', 'onDoubleTap'],
  methods: {
    onTouchStart: function onTouchStart(event) {
      this.startPosition = getPoint(event);
      this.position = this.startPosition;
    },
    onTouchMove: function onTouchMove(event) {
      if (this.position) {
        if (event.preventDefault) {
          event.preventDefault();
        }

        var point = getPoint(event);
        this.deltaX = point.x - this.position.x;
        this.deltaY = point.y - this.position.y;

        this.totalDeltaX += Math.abs(this.deltaX);
        this.totalDeltaY += Math.abs(this.deltaY);

        var threshold = 25;
        if (this.deltaX > threshold) {
          this.position = point;
          this.moveRight();
        }
        if (this.deltaX < -threshold) {
          this.position = point;
          this.moveLeft();
        }
        if (this.deltaY < -threshold) {
          this.position = point;
          this.moveUp();
        }
        if (this.deltaY > threshold) {
          this.position = point;
          this.moveDown();
        }
      }
    },
    onTouchEnd: function onTouchEnd(event) {
      if (this.totalDeltaX < 10 && this.totalDeltaY < 10) {
        this.tapCount += 1;
        var self = this;
        window.setTimeout(function () {
          if (self.tapCount === 1 && self.onTap) {
            self.onTap();
          } else if (self.tapCount > 1 && self.onDoubleTap) {
            self.onDoubleTap();
          }
          self.tapCount = 0;
        }, 250);
      }
      this.startPosition = undefined;
      this.totalDeltaX = 0;
      this.totalDeltaY = 0;
      this.position = undefined;
      this.deltaX = 0;
      this.deltaY = 0;
    },
    moveRight: function moveRight() {
      if (this.onMove) {
        this.onMove('RIGHT');
      }
    },
    moveLeft: function moveLeft() {
      if (this.onMove) {
        this.onMove('LEFT');
      }
    },
    moveUp: function moveUp() {
      if (this.onMove) {
        this.onMove('UP');
      }
    },
    moveDown: function moveDown() {
      if (this.onMove) {
        this.onMove('DOWN');
      }
    }
  },
  mounted: function mounted() {
    var self = this;
    (0, _jquery2.default)('.touchpad').on((0, _polyfill.isEventSupported)('touchstart') ? 'touchstart' : 'mousedown', self.onTouchStart);
    (0, _jquery2.default)('.touchpad').on('mousemove touchmove', self.onTouchMove);
    (0, _jquery2.default)('.touchpad').on((0, _polyfill.isEventSupported)('touchend') ? 'touchend' : 'mouseup', self.onTouchEnd);
  }
};


function getPoint(e) {
  return {
    x: e.pageX || e.originalEvent.pageX || e.originalEvent.touches[0].pageX,
    y: e.pageY || e.originalEvent.pageY || e.originalEvent.touches[0].pageY
  };
}

/***/ }),
/* 142 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "touchpad"
  })
},staticRenderFns: []}

/***/ }),
/* 143 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "container",
    attrs: {
      "id": "content"
    }
  }, [_c('div', {
    staticClass: "row clearfix"
  }, [(_vm.words) ? _c('div', {
    staticClass: "col-sm-12 clearfix",
    attrs: {
      "id": "selectable-text"
    }
  }, _vm._l((_vm.words), function(word, index) {
    return _c('span', {
      key: index,
      staticClass: "word",
      attrs: {
        "id": 'word-' + index,
        "data-index": index,
        "data-id": _vm.wordId(word)
      },
      on: {
        "click": function($event) {
          _vm.focused($event.target)
        }
      }
    }, [_vm._v(_vm._s(word.text))])
  })) : _vm._e()]), _vm._v(" "), (_vm.focusedElement) ? _c('touchpad', {
    attrs: {
      "id": "touchpad",
      "on-move": _vm.onTouchpadMove,
      "on-tap": _vm.onTouchpadTap,
      "on-double-tap": _vm.onTouchpadDoubleTap
    }
  }) : _vm._e()], 1)
},staticRenderFns: []}

/***/ }),
/* 144 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  data: function data() {
    return {};
  },

  props: ['next', 'previous', 'click', 'clickTitle']
};

/***/ }),
/* 146 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "selector-bar flex-row"
  }, [_c('div', {
    staticClass: "navigate-adjective callout-light hover",
    on: {
      "click": _vm.previous
    }
  }, [_c('i', {
    staticClass: "fa fa-chevron-left"
  })]), _vm._v(" "), _c('div', {
    staticClass: "flex-two finish-button callout-light hover",
    on: {
      "click": _vm.click
    }
  }, [_vm._v(_vm._s(_vm.clickTitle))]), _vm._v(" "), _c('div', {
    staticClass: "navigate-adjective callout-light hover",
    on: {
      "click": _vm.next
    }
  }, [_c('i', {
    staticClass: "fa fa-chevron-right"
  })])])
},staticRenderFns: []}

/***/ }),
/* 147 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "flex-column vfull"
  }, [_c('div', {
    staticClass: "flex-one substance"
  }, [_c('selectable-text', {
    ref: "selectableText",
    attrs: {
      "delegate": _vm.selectionDelegate
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "flex-zero bottombar"
  }, [(_vm.isMode('start')) ? _c('p', {
    staticClass: "text-center"
  }, [_vm._v("Select an action")]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "text-center"
  }, [(_vm.isMode('selecting') && !_vm.isMode('detailing')) ? _c('button', {
    staticClass: "btn callout-light",
    on: {
      "click": _vm.helpSelectingPressed
    }
  }, [_c('i', {
    staticClass: "fa fa-question-circle-o"
  }), _vm._v(" How to select...")]) : _vm._e()]), _vm._v(" "), (_vm.isMode('selected')) ? _c('button', {
    staticClass: "btn callout-light btn-block",
    on: {
      "click": _vm.beginDetailing
    }
  }, [_vm._v("NEXT")]) : _vm._e(), _vm._v(" "), (_vm.isMode('detailing')) ? _c('div', {
    staticClass: "actions-detail"
  }, [(this.currentActionIndex !== undefined) ? _c('div', {
    staticClass: "action-header"
  }, [_c('i', {
    staticClass: "delete-action red hi-right fa fa-trash-o",
    on: {
      "click": function($event) {
        _vm.deleteAction()
      }
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "action-title hi-right"
  }, [_vm._v(_vm._s(_vm.action.toString()))]), _vm._v(" "), _c('p', {
    staticClass: "step-value"
  }, [_vm._v(_vm._s(_vm.stepValue))])]) : _vm._e(), _vm._v(" "), (this.action) ? _c('div', {
    staticClass: "action-components hi-top hi-bottom flex-row"
  }, [_c('button', {
    staticClass: "btn theme-hi c-red hover",
    class: _vm.buttonClasses('actor'),
    on: {
      "click": function($event) {
        _vm.currentStep = 'actor'
      }
    }
  }, [_vm._v("Actor")]), _vm._v(" "), _c('button', {
    staticClass: "btn theme-hi c-green hover",
    class: _vm.buttonClasses('tense'),
    on: {
      "click": function($event) {
        _vm.currentStep = 'tense'
      }
    }
  }, [_vm._v("Tense")]), _vm._v(" "), _c('button', {
    staticClass: "btn theme-hi c-blue hover",
    class: _vm.buttonClasses('target'),
    on: {
      "click": function($event) {
        _vm.currentStep = 'target'
      }
    }
  }, [_vm._v("Target")]), _vm._v(" "), _c('button', {
    staticClass: "btn theme-hi c-orange hover",
    class: _vm.buttonClasses('result'),
    on: {
      "click": function($event) {
        _vm.currentStep = 'result'
      }
    }
  }, [_vm._v("Result")])]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "action-instruction text-center"
  }, [_vm._v(_vm._s(_vm.instructionText))]), _vm._v(" "), _c('div', {
    staticClass: "step-actions"
  }, [(_vm.currentStep === 'tense') ? _c('div', {
    staticClass: "flex-row",
    attrs: {
      "id": "tense-selector"
    }
  }, [_c('button', {
    staticClass: "btn callout-light",
    class: {
      alt: this.tense !== 'past'
    },
    on: {
      "click": function($event) {
        _vm.tenseSelected('past')
      }
    }
  }, [_vm._v("PAST")]), _vm._v(" "), _c('button', {
    staticClass: "btn callout-light",
    class: {
      alt: this.tense !== 'present'
    },
    on: {
      "click": function($event) {
        _vm.tenseSelected('present')
      }
    }
  }, [_vm._v("PRESENT")]), _vm._v(" "), _c('button', {
    staticClass: "btn callout-light",
    class: {
      alt: this.tense !== 'future'
    },
    on: {
      "click": function($event) {
        _vm.tenseSelected('future')
      }
    }
  }, [_vm._v("FUTURE")])]) : _vm._e()]), _vm._v(" "), _c('selector-bar', {
    attrs: {
      "next": _vm.nextAction,
      "previous": _vm.previousAction,
      "click-title": "DONE",
      "click": _vm.finishedPressed
    }
  })], 1) : _vm._e()])])
},staticRenderFns: []}

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(149)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(150),
  /* template */
  __webpack_require__(151),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-e27bb136",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 149 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _SelectableText = __webpack_require__(20);

var _SelectableText2 = _interopRequireDefault(_SelectableText);

var _vuex = __webpack_require__(1);

var _ActivityData = __webpack_require__(6);

var _activity = __webpack_require__(4);

var _activity2 = _interopRequireDefault(_activity);

var _SelectorBar = __webpack_require__(29);

var _SelectorBar2 = _interopRequireDefault(_SelectorBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      mode: 'start',
      selection: undefined,
      selectionDelegate: {
        onFocus: undefined,
        onChange: undefined
      },
      isSelecting: false,
      finishedSelecting: false,
      detailingAdjectiveIndex: 0
    };
  },

  props: ['finish', 'data'],
  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)({ words: 'getCurrentWords' }), {
    adjectives: function adjectives() {
      return this.data.collection.items;
    },
    currentAdjective: function currentAdjective() {
      return this.adjectives[this.detailingAdjectiveIndex].wordSelection;
    },
    currentTarget: function currentTarget() {
      return this.adjectives[this.detailingAdjectiveIndex].target;
    },
    showStartText: function showStartText() {
      return !this.isSelecting && this.adjectives && this.adjectives.length === 0;
    },
    showFinishButton: function showFinishButton() {
      return this.adjectives && this.adjectives.length > 0 && !this.isSelecting;
    }
  }),
  components: {
    SelectableText: _SelectableText2.default, SelectorBar: _SelectorBar2.default
  },
  methods: {
    isMode: function isMode(mode) {
      switch (mode) {
        case 'detailing':
          return this.finishedSelecting;
        case 'selecting':
          return this.isSelecting;
        case 'start':
          return !this.isSelecting && this.adjectives.length === 0;
        case 'selected':
          return !this.isSelecting && !this.finishedSelecting && this.adjectives.length > 0;
        default:
          return false;
      }
    },
    selectedWords: function selectedWords() {
      return this.$refs.selectableText.selectedWords();
    },
    onSelectionChange: function onSelectionChange(wordSelection, operation) {
      var _this = this;

      if (!wordSelection.words || wordSelection.words.length === 0) {
        return;
      }
      if (this.isMode('detailing')) {
        this.$refs.selectableText.clearFill(wordSelection.words);
        this.adjectives[this.detailingAdjectiveIndex].target = wordSelection;
        this.highlighCurrentAdjective();
      } else if (operation === 'SELECT') {
        this.data.collection.items.push(new _ActivityData.Adjective(wordSelection));
      } else if (operation === 'DESELECT') {
        this.adjectives.every(function (adj, i) {
          if (adj.wordSelection.equals(wordSelection)) {
            _this.data.collection.items.splice(i, 1);
            return false;
          }
          return true;
        });
      }
    },
    onSelectionFocus: function onSelectionFocus(isFocused) {
      this.isSelecting = isFocused;
    },
    helpSelectingPressed: function helpSelectingPressed() {
      this.alert('Swipe right to extend the end of your selection\nSwipe left to decrease the end of your selection.\nSwipe up to extend the beginning of your selection\nSwipe down to decrease the beginning. \nTap once to finish selecting. \nTap twice to remove selection.', 'ok');
    },
    highlighCurrentAdjective: function highlighCurrentAdjective() {
      this.$refs.selectableText.muteSelectedWords();
      this.$refs.selectableText.clearHighlight();
      this.$refs.selectableText.highlightWords(this.currentAdjective.words);
      this.$refs.selectableText.unmuteWords(this.currentAdjective.words);
      if (this.currentTarget) {
        this.$refs.selectableText.highlightWords(this.currentTarget.words);
      }
      this.$refs.selectableText.scrollTo(this.currentAdjective.words);
    },
    nextPressed: function nextPressed() {
      this.data.collection.items.sort(function (a1, a2) {
        return a1.wordSelection.compare(a2.wordSelection);
      });
      this.finishedSelecting = true;
      this.highlighCurrentAdjective();
    },
    nextAdjectivePressed: function nextAdjectivePressed() {
      this.detailingAdjectiveIndex += 1;
      if (this.detailingAdjectiveIndex === this.adjectives.length) {
        this.detailingAdjectiveIndex = 0;
      }
      this.highlighCurrentAdjective();
    },
    previousAdjectivePressed: function previousAdjectivePressed() {
      this.detailingAdjectiveIndex -= 1;
      if (this.detailingAdjectiveIndex === -1) {
        this.detailingAdjectiveIndex = this.adjectives.length - 1;
      }
      this.highlighCurrentAdjective();
    },
    skipDetailing: function skipDetailing() {
      this.finish(_activity2.default.types.Adjectives, this.data);
    },
    setupData: function setupData() {
      if (this.data && this.$refs.selectableText) {
        var self = this;
        this.data.collection.items.forEach(function (adjectiveEntry) {
          self.$refs.selectableText.setSelected(adjectiveEntry.wordSelection.words);
        });
      }
    },
    willAppear: function willAppear() {
      this.setupData();
      this.finishedSelecting = false;
    },
    finishedPressed: function finishedPressed() {
      this.finish(_activity2.default.types.Adjectives, this.data);
    }
  },
  mounted: function mounted() {
    this.selectionDelegate.onChange = this.onSelectionChange;
    this.selectionDelegate.onFocus = this.onSelectionFocus;
    this.setupData();
  }
};

/***/ }),
/* 151 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "flex-column vfull"
  }, [_c('div', {
    staticClass: "flex-one substance"
  }, [_c('selectable-text', {
    ref: "selectableText",
    attrs: {
      "delegate": _vm.selectionDelegate
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "flex-zero bottombar noselect"
  }, [(_vm.isMode('start')) ? _c('p', {
    staticClass: "instruction muted"
  }, [_vm._v("Select an adjective")]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "text-center"
  }, [(_vm.isMode('selecting') && !_vm.isMode('detailing')) ? _c('button', {
    staticClass: "btn callout-light",
    on: {
      "click": _vm.helpSelectingPressed
    }
  }, [_c('i', {
    staticClass: "fa fa-question-circle-o"
  }), _vm._v(" How to select...")]) : _vm._e()]), _vm._v(" "), (_vm.isMode('selected')) ? _c('button', {
    staticClass: "btn callout-light btn-block",
    on: {
      "click": _vm.nextPressed
    }
  }, [_vm._v("NEXT")]) : _vm._e(), _vm._v(" "), (_vm.isMode('detailing')) ? _c('div', [_c('div', {
    staticClass: "detailing-label"
  }, [_c('span', {
    staticClass: "current-adjective back-red"
  }, [_vm._v(_vm._s(_vm.currentAdjective.toString()))]), _vm._v(" "), _c('i', {
    staticClass: "fa fa-long-arrow-right"
  }), _vm._v("\n        " + _vm._s(_vm.currentTarget ? _vm.currentTarget.toString() : 'Select who or what is described.') + "\n      ")]), _vm._v(" "), _c('div', {
    staticClass: "detailing"
  }, [_c('selector-bar', {
    attrs: {
      "next": _vm.nextAdjectivePressed,
      "previous": _vm.previousAdjectivePressed,
      "click-title": "DONE",
      "click": _vm.skipDetailing
    }
  })], 1)]) : _vm._e()])])
},staticRenderFns: []}

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(153)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(154),
  /* template */
  __webpack_require__(157),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-3233205f",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 153 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _vuex = __webpack_require__(1);

var _ActivityData = __webpack_require__(6);

var _activity = __webpack_require__(4);

var _activity2 = _interopRequireDefault(_activity);

var _vuedraggable = __webpack_require__(155);

var _vuedraggable2 = _interopRequireDefault(_vuedraggable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      topic: '',
      showTopics: false,
      moving: undefined,
      lastMove: undefined
    };
  },

  props: ['finish', 'data'],
  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)(['getCurrentStudy']), {
    topics: function topics() {
      return this.data.collection.items;
    },
    viewButtonLabel: function viewButtonLabel() {
      return this.showTopics ? 'PASSAGE' : 'TOPICS (' + this.topics.length + ')';
    }
  }),
  components: { Draggable: _vuedraggable2.default },
  methods: {
    addTopic: function addTopic() {
      var self = this;
      if (!this.data.collection.items.find(function (ft) {
        return ft.text === self.topic;
      })) {
        this.data.collection.add(new _ActivityData.FreeText(this.topic, this.getCurrentStudy.passage, this.topics.length));
        this.topic = '';
      }
    },
    deleteTopic: function deleteTopic(topic) {
      var index = this.topics.indexOf(topic);
      this.data.collection.items.splice(index, 1);
      this.sort();
    },
    toggleView: function toggleView() {
      this.showTopics = !this.showTopics;
    },
    moved: function moved(event) {
      this.sort();
    },
    sort: function sort() {
      this.data.collection.items.forEach(function (topic, i) {
        topic.order = i;
      });
    },
    donePressed: function donePressed() {
      this.finish(_activity2.default.types.Topics, this.data);
    }
  }
};

/***/ }),
/* 155 */,
/* 156 */,
/* 157 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "flex-column vfull"
  }, [_c('div', {
    staticClass: "flex-row topic-input"
  }, [_vm._m(0), _vm._v(" "), _c('form', {
    staticClass: "flex-one",
    on: {
      "submit": function($event) {
        $event.preventDefault();
        _vm.addTopic($event)
      }
    }
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.topic),
      expression: "topic"
    }],
    staticClass: "callout-bottom theme-back",
    attrs: {
      "autofocus": "",
      "type": "text",
      "placeholder": "topic"
    },
    domProps: {
      "value": (_vm.topic)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.topic = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('button', {
    attrs: {
      "disabled": !_vm.topic
    },
    on: {
      "click": _vm.addTopic
    }
  }, [_c('i', {
    staticClass: "fa fa-plus-circle callout-light alt flex-zero"
  })])]), _vm._v(" "), _c('div', {
    staticClass: "flex-one substance"
  }, [(!_vm.showTopics) ? _c('div', {
    staticClass: "container passage"
  }, _vm._l((_vm.getCurrentStudy.verses), function(verse) {
    return _c('div', {
      staticClass: "verse-container",
      attrs: {
        "data-verse": verse.number
      }
    }, [_c('div', {
      staticClass: "verse theme-mid hover"
    }, [_c('span', {
      staticClass: "verse-number muted"
    }, [(verse.number === 1) ? _c('span', [_vm._v(_vm._s(verse.chapter) + ":")]) : _vm._e(), _vm._v(_vm._s(verse.number))]), _vm._v(" "), _c('span', {
      staticClass: "verse-text"
    }, [_vm._v(_vm._s(verse.text))])])])
  })) : _vm._e(), _vm._v(" "), (_vm.showTopics) ? _c('div', {
    staticClass: "container topics-view"
  }, [(_vm.topics.length === 0) ? _c('p', {
    staticClass: "text-center muted"
  }, [_c('i', [_vm._v("You have not added any topics")])]) : _vm._e(), _vm._v(" "), (_vm.topics.length > 1) ? _c('p', {
    staticClass: "text-center muted"
  }, [_c('i', [_vm._v("Drag to order topics by importance to the text")])]) : _vm._e(), _vm._v(" "), _c('draggable', {
    on: {
      "end": _vm.moved
    },
    model: {
      value: (_vm.data.collection.items),
      callback: function($$v) {
        _vm.data.collection.items = $$v
      },
      expression: "data.collection.items"
    }
  }, _vm._l((_vm.topics), function(topic, index) {
    return _c('div', {
      staticClass: "flex-row topic-row theme-mid"
    }, [_c('p', {
      staticClass: "topic-counter hi-right"
    }, [_c('span', [_vm._v(_vm._s(topic.order + 1))])]), _vm._v(" "), _c('p', {
      staticClass: "flex-one topic"
    }, [_vm._v("#" + _vm._s(topic.text))]), _vm._v(" "), _c('div', {
      staticClass: "topic-delete hi-left",
      on: {
        "click": function($event) {
          _vm.deleteTopic(topic)
        }
      }
    }, [_c('i', {
      staticClass: "fa fa-close"
    })])])
  }))], 1) : _vm._e()]), _vm._v(" "), _c('div', {
    staticClass: "flex-row bottombar"
  }, [_c('button', {
    staticClass: "flex-one btn callout-light",
    on: {
      "click": _vm.toggleView
    }
  }, [(_vm.showTopics) ? _c('i', {
    staticClass: "fa fa-arrow-left"
  }) : _vm._e(), _vm._v(" " + _vm._s(_vm.viewButtonLabel))]), _vm._v(" "), _c('div', {
    staticClass: "flex-two done-button",
    class: {
      shown: _vm.showTopics
    }
  }, [_c('button', {
    staticClass: "btn callout-light",
    on: {
      "click": function($event) {
        _vm.donePressed()
      }
    }
  }, [_vm._v("DONE")])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', {
    staticClass: "flex-zero callout-light alt"
  }, [_c('i', {
    staticClass: "fa fa-tag"
  })])
}]}

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(159)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(160),
  /* template */
  __webpack_require__(164),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-b42a50d2",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 159 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _SelectableText = __webpack_require__(20);

var _SelectableText2 = _interopRequireDefault(_SelectableText);

var _vuex = __webpack_require__(1);

var _jquery = __webpack_require__(3);

var _jquery2 = _interopRequireDefault(_jquery);

var _ActivityData = __webpack_require__(6);

var _activity = __webpack_require__(4);

var _activity2 = _interopRequireDefault(_activity);

var _bible = __webpack_require__(8);

var _images = __webpack_require__(30);

var _images2 = _interopRequireDefault(_images);

var _polyfill = __webpack_require__(7);

var _Section = __webpack_require__(31);

var _Section2 = _interopRequireDefault(_Section);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      wordsBySection: {}
    };
  },

  props: ['finish', 'data'],
  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)(['getCurrentWords'])),
  components: {
    SelectableText: _SelectableText2.default, SectionVue: _Section2.default
  },
  methods: {
    wordSelected: function wordSelected(section, wordIndex, sectionIndex) {
      var currentWords = this.wordsBySection[section.id];
      var newWordSection = currentWords.splice(wordIndex, currentWords.length - wordIndex);
      var newSection = new _ActivityData.Section('', new _bible.WordRange(newWordSection[0], (0, _polyfill.arrayLast)(newWordSection)));

      this.wordsBySection[newSection.id] = newWordSection;

      var newIndex = sectionIndex + 1;
      this.data.collection.items.splice(newIndex, 0, newSection);

      recalculateWordRanges(this.data, this.wordsBySection);

      this.$nextTick(function () {
        _images2.default.svgs();
        (0, _jquery2.default)('.section-title.root > .section-edit').focus();
      });
    },
    deleteSection: function deleteSection(section, sectionIndex) {
      if (sectionIndex === 0) {
        this.alert('You must provide a section title at the beginning of the passage.', 'ok');
      } else {
        var sections = this.data.collection.items;
        var previousSection = sections[sectionIndex - 1];

        this.wordsBySection[previousSection.id] = this.wordsBySection[previousSection.id].concat(this.wordsBySection[section.id]);
        this.wordsBySection[section.id] = undefined;

        sections.splice(sectionIndex, 1);
        previousSection.wordRange.endingWord = (0, _polyfill.arrayLast)(this.wordsBySection[previousSection.id]);
      }
    },
    isOutlined: function isOutlined() {
      return !(0, _polyfill.arrayEmpty)(this.data.collection.items) && this.data.collection.items[0].title.length > 0;
    },
    finishedClicked: function finishedClicked() {
      if (this.isOutlined()) {
        this.finish(_activity2.default.types.Outline, this.data);
      } else {
        this.alert('You must provide at least one section title', 'ok');
      }
    }
  },
  watch: {
    data: function data(newData, oldVal) {
      this.wordsBySection = assessWordsBySection(newData, this.getCurrentWords);
    }
  },
  mounted: function mounted() {
    this.wordsBySection = assessWordsBySection(this.data, this.getCurrentWords);
    this.$nextTick(function () {
      _images2.default.svgs();
    });
  }
};


function assessWordsBySection(data, words) {
  var wordsBySection = {};
  data.collection.items.forEach(function (section) {
    var wordsForSection = words.filter(function (word) {
      return section.wordRange.includes(word);
    });
    wordsBySection[section.id] = wordsForSection;
  });
  return wordsBySection;
}

function recalculateWordRanges(data, wordsBySection) {
  data.collection.items.forEach(function (section) {
    var words = wordsBySection[section.id];
    section.wordRange = new _bible.WordRange(words[0], (0, _polyfill.arrayLast)(words));
  });
}

/***/ }),
/* 161 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(3);

var _jquery2 = _interopRequireDefault(_jquery);

var _images = __webpack_require__(30);

var _images2 = _interopRequireDefault(_images);

var _ActivityData = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'subsection-vue',
  data: function data() {
    return {};
  },

  props: ['section', 'index', 'allowsSubSections', 'delete', 'prefix'],
  computed: {},
  components: {},
  methods: {
    deleteAction: function deleteAction(section, index) {
      this.delete(section, index);
    },
    addSubSection: function addSubSection(section, input) {
      section.addSubSection(new _ActivityData.Section(input.value));
      input.value = '';
      this.$nextTick(function () {
        _images2.default.svgs();
      });
    },
    editSection: function editSection(sectionDiv) {
      if ((0, _jquery2.default)(sectionDiv).closest('.section.readonly').length === 0) {
        (0, _jquery2.default)(sectionDiv).closest('.section-title').addClass('editing');
        (0, _jquery2.default)(sectionDiv).siblings('.section-edit').focus();
      }
    },
    applySectionEdit: function applySectionEdit(section, input) {
      if (input.value.length > 0) {
        section.title = input.value;
        (0, _jquery2.default)(input).closest('.section-title').removeClass('editing');
      }
    },
    deleteSubsection: function deleteSubsection() {
      throw new Error('Delete subsections not implemented');
    }
  },
  mounted: function mounted() {
    if ((0, _jquery2.default)(this.$el).closest('.subsections').length === 0) {
      (0, _jquery2.default)(this.$el).find('.section-title:first').addClass('root');
    }
    if (this.section.title.length > 0) {
      (0, _jquery2.default)(this.$el).find('.section-title').removeClass('editing');
    }
    this.$nextTick(function () {
      _images2.default.svgs();
    });
  }
};

/***/ }),
/* 163 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "section"
  }, [_c('div', {
    staticClass: "section-title callout-bottom editing"
  }, [_c('div', {
    staticClass: "section-item",
    on: {
      "click": function($event) {
        _vm.editSection($event.target)
      }
    }
  }, [_vm._v("\n      " + _vm._s(_vm.prefix) + _vm._s(_vm.section.title) + " "), (_vm.section.title) ? _c('span', {
    staticClass: "word-range"
  }, [_vm._v(_vm._s(_vm.section.rangeDescription()))]) : _vm._e()]), _vm._v(" "), _c('input', {
    staticClass: "section-edit",
    attrs: {
      "type": "text",
      "placeholder": "title"
    },
    domProps: {
      "value": _vm.section.title
    },
    on: {
      "blur": function($event) {
        _vm.applySectionEdit(_vm.section, $event.target)
      }
    }
  }), _vm._v(" "), (_vm.allowsSubSections) ? _c('div', {
    staticClass: "action"
  }, [_c('div', {
    staticClass: "action-button",
    on: {
      "click": function($event) {
        _vm.deleteAction(_vm.section, _vm.index)
      }
    }
  }, [_c('img', {
    staticClass: "svg close-button",
    attrs: {
      "src": "/static/images/close.svg"
    }
  })])]) : _vm._e()]), _vm._v(" "), _c('div', {
    staticClass: "subsections"
  }, [_vm._l((_vm.section.subSections.items), function(subsection) {
    return (_vm.allowsSubSections) ? _c('div', [_c('subsection-vue', {
      attrs: {
        "section": subsection,
        "allows-sub-sections": false,
        "delete": _vm.deleteSubsection,
        "prefix": '• '
      }
    })], 1) : _vm._e()
  }), _vm._v(" "), (_vm.allowsSubSections) ? _c('div', {
    staticClass: "temp"
  }, [_c('input', {
    attrs: {
      "type": "text",
      "placeholder": "supporting idea (optional)..."
    },
    on: {
      "change": function($event) {
        _vm.addSubSection(_vm.section, $event.target)
      }
    }
  })]) : _vm._e()], 2)])
},staticRenderFns: []}

/***/ }),
/* 164 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "flex-column vfull"
  }, [_c('div', {
    staticClass: "flex-one substance"
  }, [_c('div', {
    staticClass: "container"
  }, _vm._l((_vm.data.collection.items), function(section, sectionIndex) {
    return _c('div', {
      key: sectionIndex,
      staticClass: "row section-container"
    }, [_c('div', {
      staticClass: "col-xs-12"
    }, [_c('section-vue', {
      staticClass: "section-content",
      attrs: {
        "section": section,
        "index": sectionIndex,
        "allows-sub-sections": true,
        "delete": _vm.deleteSection
      }
    }), _vm._v(" "), _vm._l((_vm.wordsBySection[section.id]), function(word, index) {
      return _c('span', {
        key: index,
        staticClass: "word",
        on: {
          "click": function($event) {
            _vm.wordSelected(section, index, sectionIndex)
          }
        }
      }, [_vm._v(_vm._s(word.text))])
    })], 2)])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "flex-zero bottombar"
  }, [_c('button', {
    staticClass: "btn callout-light btn-block",
    class: {
      disabled: !_vm.isOutlined()
    },
    attrs: {
      "id": "outline-action"
    },
    on: {
      "click": function($event) {
        _vm.finishedClicked()
      }
    }
  }, [_vm._v("FINISHED")])])])
},staticRenderFns: []}

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(166)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(167),
  /* template */
  __webpack_require__(168),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-7643d458",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 166 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _jquery = __webpack_require__(3);

var _jquery2 = _interopRequireDefault(_jquery);

var _vuex = __webpack_require__(1);

var _activity = __webpack_require__(4);

var _activity2 = _interopRequireDefault(_activity);

var _bible = __webpack_require__(8);

var _ActivityData = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      activityType: _activity2.default.types.Paraphrase,
      currentVerse: undefined,
      paraphrasingVerse: undefined
    };
  },

  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)(['getCurrentStudy'])),
  props: ['finish', 'data'],
  methods: {
    willAppear: function willAppear() {
      this.setupData();
    },
    setupData: function setupData() {
      this.data.collection.items.forEach(function (freeText) {
        var verse = freeText.passage.end.number;
        var verseContainer = (0, _jquery2.default)('.verse-container[data-verse=' + verse + ']');
        verseContainer.find('.paraphrase').text(freeText.text);
      });
    },
    verseSelected: function verseSelected(targetNode) {
      if (this.paraphrasingVerse) {
        return;
      }

      var verseContainer = (0, _jquery2.default)(targetNode).closest('.verse-container');
      this.paraphrasingVerse = verseContainer;
      (0, _jquery2.default)('.paraphrasing').removeClass('paraphrasing');
      (0, _jquery2.default)('.paraphrase-input').text(verseContainer.find('.paraphrase').text());
      (0, _jquery2.default)('#paraphrase-container').removeClass('collapsed');
      (0, _jquery2.default)('#paraphrase-container').show();
      (0, _jquery2.default)('.paraphrase-input').focus();
      (0, _jquery2.default)('.content').addClass('keyboard');
      var paraphrasingVerseRange = determineParaphrasingRange(verseContainer);
      this.setParaphrasingSummaryLabel(paraphrasingVerseRange);
      (0, _jquery2.default)('.verse-container').addClass('disabled');
    },
    doneParaphrasing: function doneParaphrasing() {
      (0, _jquery2.default)('#paraphrase-container').hide();
      var input = (0, _jquery2.default)('.paraphrase-input').text();
      (0, _jquery2.default)('.paraphrase-input').text('');
      (0, _jquery2.default)(this.paraphrasingVerse).find('.paraphrase').text(input);
      this.paraphrasingVerse = undefined;
      (0, _jquery2.default)('.paraphrasing').removeClass('paraphrasing');
      (0, _jquery2.default)('.verse-container').removeClass('disabled');
      (0, _jquery2.default)('.content').removeClass('keyboard');
    },
    toggleParaphraseCollapse: function toggleParaphraseCollapse() {
      (0, _jquery2.default)('#paraphrase-container').toggleClass('collapsed');
      if (!(0, _jquery2.default)('#paraphrase-container').hasClass('collapsed')) {
        (0, _jquery2.default)('.paraphrase-input').focus();
      }
    },
    setParaphrasingSummaryLabel: function setParaphrasingSummaryLabel(paraphrasingVerseRange) {
      if (paraphrasingVerseRange.length === 1) {
        (0, _jquery2.default)('.paraphrasing-summary').text('Paraphrase v.' + paraphrasingVerseRange[0]);
      } else {
        var endVerse = paraphrasingVerseRange[paraphrasingVerseRange.length - 1];
        (0, _jquery2.default)('.paraphrasing-summary').text('Paraphrase vs.' + paraphrasingVerseRange[0] + '-' + endVerse);
      }
    },
    donePressed: function donePressed() {
      if ((0, _jquery2.default)('.paraphrase').last().is(':empty')) {
        this.alert('You must paraphrase at least the last verse.', 'ok');
      } else {
        var book = this.getCurrentStudy.passage.start.book;
        var chapter = this.getCurrentStudy.passage.start.chapter;
        var self = this;
        this.data.collection.clear();
        (0, _jquery2.default)('.paraphrase:not(:empty)').each(function () {
          var verseRange = determineParaphrasingRange((0, _jquery2.default)(this).closest('.verse-container'));
          var startVerse = new _bible.Verse(book, chapter, verseRange[0]);
          var endVerse = new _bible.Verse(book, chapter, verseRange[verseRange.length - 1]);
          var passage = _bible.Bible.buildPassage(startVerse, endVerse);
          self.data.collection.add(new _ActivityData.FreeText((0, _jquery2.default)(this).text(), passage));
        });
        this.finish(this.activityType, this.data);
      }
    }
  },
  components: {},
  mounted: function mounted() {
    this.setupData();
  }
};


function determineParaphrasingRange(currentVerseContainer) {
  var range = [currentVerseContainer.data('verse')];
  currentVerseContainer.addClass('paraphrasing');
  currentVerseContainer.prevAll('.verse-container').each(function () {
    var pInput = (0, _jquery2.default)(this).find('.paraphrase');
    if (pInput.text().length > 0) {
      return false;
    }
    (0, _jquery2.default)(this).addClass('paraphrasing');
    range.push(this.dataset.verse);
  });
  return range.reverse();
}

/***/ }),
/* 168 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "flex-column vfull"
  }, [_c('div', {
    staticClass: "flex-zero shadow-long theme-mid",
    attrs: {
      "id": "paraphrase-container"
    }
  }, [_c('div', {
    staticClass: "paraphrase-input input",
    attrs: {
      "contenteditable": "true"
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "paraphrase-menu"
  }, [_c('button', {
    staticClass: "btn theme-mid shadow btn-xs",
    attrs: {
      "id": "paraphrase-collapse"
    },
    on: {
      "click": function($event) {
        _vm.toggleParaphraseCollapse()
      }
    }
  }, [_c('span', {
    staticClass: "glyphicon glyphicon-triangle-top"
  }), _vm._v(" "), _c('span', {
    staticClass: "glyphicon glyphicon-triangle-bottom"
  })]), _vm._v(" "), _c('p', {
    staticClass: "paraphrasing-summary muted"
  }), _vm._v(" "), _c('button', {
    staticClass: "btn callout-light btn-xs",
    attrs: {
      "id": "paraphrase-done"
    },
    on: {
      "click": function($event) {
        _vm.doneParaphrasing()
      }
    }
  }, [_vm._v("DONE")])])]), _vm._v(" "), _c('div', {
    staticClass: "flex-one substance content"
  }, [_c('div', {
    staticClass: "container"
  }, _vm._l((_vm.getCurrentStudy.verses), function(verse) {
    return _c('div', {
      staticClass: "verse-container",
      attrs: {
        "data-verse": verse.number
      },
      on: {
        "click": function($event) {
          _vm.verseSelected($event.target)
        }
      }
    }, [_c('div', {
      staticClass: "verse theme-mid hover"
    }, [_c('span', {
      staticClass: "verse-number muted"
    }, [(verse.number === 1) ? _c('span', [_vm._v(_vm._s(verse.chapter) + ":")]) : _vm._e(), _vm._v(_vm._s(verse.number))]), _vm._v(" "), _c('span', {
      staticClass: "verse-text"
    }, [_vm._v(_vm._s(verse.text))])]), _vm._v(" "), _c('div', {
      staticClass: "paraphrase muted"
    })])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "flex-zero bottombar"
  }, [_c('button', {
    staticClass: "btn callout-light btn-block",
    on: {
      "click": function($event) {
        _vm.donePressed()
      }
    }
  }, [_vm._v("FINISHED")])])])
},staticRenderFns: []}

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(170)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(171),
  /* template */
  __webpack_require__(176),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-672c099b",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 170 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _jquery = __webpack_require__(3);

var _jquery2 = _interopRequireDefault(_jquery);

var _vuex = __webpack_require__(1);

var _activity = __webpack_require__(4);

var _activity2 = _interopRequireDefault(_activity);

var _TextInput = __webpack_require__(172);

var _TextInput2 = _interopRequireDefault(_TextInput);

var _ActivityData = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      activityType: _activity2.default.types.Space,
      currentVerse: undefined,
      textInputTitle: 'Sin to confess',
      currentSpaceContainer: undefined,
      editingEntry: undefined,
      containerLabels: {
        S: 'SIN TO CONFESS',
        P: 'PROMISE TO CLAIM',
        A: 'ACTION TO TAKE',
        C: 'COMMAND TO OBEY',
        E: 'EXAMPLE TO FOLLOW'
      }
    };
  },

  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)(['getCurrentStudy']), {
    showDoneButton: function showDoneButton() {
      return !this.data.containers[0].isEmpty() || !this.data.containers[1].isEmpty() || !this.data.containers[2].isEmpty() || !this.data.containers[3].isEmpty() || !this.data.containers[4].isEmpty();
    }
  }),
  components: { TextInput: _TextInput2.default },
  props: ['finish', 'data'],
  methods: {
    verseSelected: function verseSelected(targetNode) {
      (0, _jquery2.default)('.verse-container.selected').removeClass('selected');
      var verseContainer = (0, _jquery2.default)(targetNode).closest('.verse-container');
      verseContainer.addClass('selected');
    },
    actionSelected: function actionSelected(action) {
      this.textInputTitle = this.containerLabels[action];
      this.currentSpaceContainer = action;
      (0, _jquery2.default)('.overlay').show();
      this.$refs.textInput.focus();
    },
    editEntry: function editEntry(entry, container) {
      this.textInputTitle = this.containerLabels[container.name];
      this.currentSpaceContainer = container.name;
      this.editingEntry = entry;
      (0, _jquery2.default)('.overlay').show();
      this.$refs.textInput.focus(entry.text);
    },
    deleteEntry: function deleteEntry(index, container) {
      container.items.splice(index, 1);
    },
    textInputDone: function textInputDone(text) {
      (0, _jquery2.default)('.overlay').hide();
      if (text.length > 0) {
        var container = this.data.findContainer(this.currentSpaceContainer);
        if (this.editingEntry) {
          this.editingEntry.text = text;
          this.editingEntry = undefined;
        } else {
          container.add(new _ActivityData.FreeText(text, this.getCurrentStudy.passage));
        }
      }
    },
    finished: function finished() {
      this.finish(this.activityType, this.data);
    }
  },
  mounted: function mounted() {}
};

/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(173)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(174),
  /* template */
  __webpack_require__(175),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 173 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  components: {},
  props: ['title', 'done'],
  methods: {
    donePressed: function donePressed() {
      this.done(document.getElementById('text-input').textContent);
      document.getElementById('text-input').textContent = '';
    },
    focus: function focus(optionalText) {
      document.getElementById('text-input').textContent = optionalText;
      document.getElementById('text-input').focus();
    }
  }
};

/***/ }),
/* 175 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "clearfix theme-mid"
  }, [_c('div', {
    staticClass: "text-input-titlebar clearfix"
  }, [_c('div', {
    staticClass: "text-input-title muted"
  }, [_vm._v("\n      " + _vm._s(_vm.title) + "\n    ")]), _vm._v(" "), _c('div', {
    staticClass: "text-input-done"
  }, [_c('button', {
    staticClass: "btn callout-light pull-right",
    on: {
      "click": function($event) {
        _vm.donePressed()
      }
    }
  }, [_vm._v("DONE")])])]), _vm._v(" "), _c('div', {
    staticClass: "text-input input",
    attrs: {
      "id": "text-input",
      "contenteditable": "true"
    }
  })])
},staticRenderFns: []}

/***/ }),
/* 176 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "flex-column vfull"
  }, [_c('div', {
    staticClass: "flex-one substance"
  }, [_c('div', {
    staticClass: "overlay theme-mid shadow-long"
  }, [_c('text-input', {
    ref: "textInput",
    attrs: {
      "title": _vm.textInputTitle,
      "done": _vm.textInputDone
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "container"
  }, [_vm._l((_vm.getCurrentStudy.verses), function(verse) {
    return _c('div', {
      staticClass: "verse-container",
      attrs: {
        "data-verse": verse.number
      },
      on: {
        "click": function($event) {
          _vm.verseSelected($event.target)
        }
      }
    }, [_c('div', {
      staticClass: "verse theme-mid hover"
    }, [_c('span', {
      staticClass: "verse-number"
    }, [(verse.number === 1) ? _c('span', [_vm._v(_vm._s(verse.chapter) + ":")]) : _vm._e(), _vm._v(_vm._s(verse.number))]), _vm._v(" "), _c('span', {
      staticClass: "verse-text"
    }, [_vm._v(_vm._s(verse.text))])])])
  }), _vm._v(" "), _c('hr'), _vm._v(" "), (_vm.data) ? _c('div', {
    staticClass: "space-progress"
  }, _vm._l((_vm.data.containers), function(container) {
    return (container.items.length > 0) ? _c('div', [_c('p', {
      staticClass: "space-title muted"
    }, [_vm._v(_vm._s(_vm.containerLabels[container.name]))]), _vm._v(" "), _vm._l((container.items), function(item, index) {
      return _c('div', {
        staticClass: "flex-row"
      }, [_c('p', {
        staticClass: "flex-one space-entry input",
        on: {
          "click": function($event) {
            _vm.editEntry(item, container)
          }
        }
      }, [_vm._v(_vm._s(item.text))]), _vm._v(" "), _c('img', {
        staticClass: "flex-zero",
        attrs: {
          "src": "/static/images/close.svg"
        },
        on: {
          "click": function($event) {
            _vm.deleteEntry(index, container)
          }
        }
      })])
    })], 2) : _vm._e()
  })) : _vm._e()], 2)]), _vm._v(" "), _c('div', {
    staticClass: "flex-zero bottombar"
  }, [(_vm.showDoneButton) ? _c('div', {
    staticClass: "col-xs-12 space-done-button"
  }, [_c('button', {
    staticClass: "btn callout-light btn-block",
    on: {
      "click": function($event) {
        _vm.finished()
      }
    }
  }, [_vm._v("FINISHED")])]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "col-xs-5c"
  }, [_c('button', {
    staticClass: "btn callout-light alt btn-block",
    on: {
      "click": function($event) {
        _vm.actionSelected('S')
      }
    }
  }, [_vm._v("S")])]), _vm._v(" "), _c('div', {
    staticClass: "col-xs-5c"
  }, [_c('button', {
    staticClass: "btn callout-light alt btn-block",
    on: {
      "click": function($event) {
        _vm.actionSelected('P')
      }
    }
  }, [_vm._v("P")])]), _vm._v(" "), _c('div', {
    staticClass: "col-xs-5c"
  }, [_c('button', {
    staticClass: "btn callout-light alt btn-block",
    on: {
      "click": function($event) {
        _vm.actionSelected('A')
      }
    }
  }, [_vm._v("A")])]), _vm._v(" "), _c('div', {
    staticClass: "col-xs-5c"
  }, [_c('button', {
    staticClass: "btn callout-light alt btn-block",
    on: {
      "click": function($event) {
        _vm.actionSelected('C')
      }
    }
  }, [_vm._v("C")])]), _vm._v(" "), _c('div', {
    staticClass: "col-xs-5c"
  }, [_c('button', {
    staticClass: "btn callout-light alt btn-block",
    on: {
      "click": function($event) {
        _vm.actionSelected('E')
      }
    }
  }, [_vm._v("E")])])])])
},staticRenderFns: []}

/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(178)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(179),
  /* template */
  __webpack_require__(180),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-06ee169e",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 178 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _jquery = __webpack_require__(3);

var _jquery2 = _interopRequireDefault(_jquery);

var _vuex = __webpack_require__(1);

var _activity = __webpack_require__(4);

var _activity2 = _interopRequireDefault(_activity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      activityType: _activity2.default.types.Stewardship,
      mode: 'context',
      currentStep: 'time',
      timeEntry: undefined,
      moneyEntry: undefined,
      thoughtsEntry: undefined,
      peopleEntry: undefined,
      affectTimeEntry: undefined,
      affectMoneyEntry: undefined,
      affectThoughtsEntry: undefined,
      affectPeopleEntry: undefined
    };
  },

  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)(['getCurrentStudy']), {
    stepCondition: function stepCondition() {
      switch (this.currentStep) {
        case 'time':
          return this.affectTimeEntry.questionText;
        case 'money':
          return this.affectMoneyEntry.questionText;
        case 'thoughts':
          return this.affectThoughtsEntry.questionText;
        case 'people':
          return this.affectPeopleEntry.questionText;
        default:
          return '';
      }
    },
    stepConditionContext: function stepConditionContext() {
      switch (this.currentStep) {
        case 'time':
          return this.timeEntry.freeText.text;
        case 'money':
          return this.moneyEntry.freeText.text;
        case 'thoughts':
          return this.thoughtsEntry.freeText.text;
        case 'people':
          return this.peopleEntry.freeText.text;
        default:
      }
    },
    nextButtonText: function nextButtonText() {
      return this.currentStep === 'people' ? 'FINISHED' : 'NEXT';
    }
  }),
  components: {},
  props: ['finish', 'data'],
  watch: {
    currentStep: function currentStep(newVal, oldVal) {
      switch (newVal) {
        case 'time':
          (0, _jquery2.default)('.user-input').text(this.affectTimeEntry.freeText.text);
          break;
        case 'money':
          (0, _jquery2.default)('.user-input').text(this.affectMoneyEntry.freeText.text);
          break;
        case 'thoughts':
          (0, _jquery2.default)('.user-input').text(this.affectThoughtsEntry.freeText.text);
          break;
        case 'people':
          (0, _jquery2.default)('.user-input').text(this.affectPeopleEntry.freeText.text);
          break;
        default:
      }
    }
  },
  methods: {
    contextQuestionsFinished: function contextQuestionsFinished() {
      var _this = this;

      this.mode = 'text';
      this.$nextTick(function () {
        (0, _jquery2.default)('.user-input').focus();
        (0, _jquery2.default)('.user-input').text(_this.affectTimeEntry.freeText.text);
      });
    },
    nextPressed: function nextPressed() {
      var input = (0, _jquery2.default)('.user-input').text();
      if (this.currentStep !== 'done' && input.length < 1) {
        this.alert('You must provide an answer (even to say "The passage has no implications for this part of my life")', 'ok');
      } else {
        this.assignUserInput((0, _jquery2.default)('.user-input').text());
        (0, _jquery2.default)('.user-input').text('');
        this.nextStep();
        (0, _jquery2.default)('.user-input').focus();
      }
    },
    assignUserInput: function assignUserInput(text) {
      switch (this.currentStep) {
        case 'time':
          this.affectTimeEntry.freeText.text = text;
          break;
        case 'money':
          this.affectMoneyEntry.freeText.text = text;
          break;
        case 'thoughts':
          this.affectThoughtsEntry.freeText.text = text;
          break;
        case 'people':
          this.affectPeopleEntry.freeText.text = text;
          this.finished();
          break;
        case 'done':
          this.finished();
          break;
        default:
      }
    },
    nextStep: function nextStep() {
      switch (this.currentStep) {
        case 'time':
          this.currentStep = 'money';
          break;
        case 'money':
          this.currentStep = 'thoughts';
          break;
        case 'thoughts':
          this.currentStep = 'people';
          break;
        case 'people':
          this.currentStep = 'done';
          break;
        case 'done':
          this.finished();
          break;
        default:
      }
    },
    previousStep: function previousStep() {
      switch (this.currentStep) {
        case 'time':
          this.currentStep = 'time';
          break;
        case 'money':
          this.currentStep = 'time';
          break;
        case 'thoughts':
          this.currentStep = 'money';
          break;
        case 'people':
          this.currentStep = 'thoughts';
          break;
        case 'done':
          this.currentStep = 'people';
          break;
        default:
      }
    },
    findQuestionEntry: function findQuestionEntry(type) {
      var items = this.data.collection.items;
      for (var item in items) {
        if (items[item].questionId === type) {
          return items[item];
        }
      }
      return undefined;
    },
    finished: function finished() {
      this.finish(this.activityType, this.data);
    }
  },
  mounted: function mounted() {
    this.timeEntry = this.findQuestionEntry('time');
    this.moneyEntry = this.findQuestionEntry('money');
    this.thoughtsEntry = this.findQuestionEntry('thoughts');
    this.peopleEntry = this.findQuestionEntry('people');
    this.affectTimeEntry = this.findQuestionEntry('affect-time');
    this.affectMoneyEntry = this.findQuestionEntry('affect-money');
    this.affectThoughtsEntry = this.findQuestionEntry('affect-thoughts');
    this.affectPeopleEntry = this.findQuestionEntry('affect-people');
  }
};

/***/ }),
/* 180 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "flex-column vfull"
  }, [_c('div', {
    staticClass: "flex-one substance"
  }, [(_vm.mode === 'context') ? _c('div', {
    staticClass: "container context-mode"
  }, [_c('h3', [_vm._v("In the next 3 days...")]), _vm._v(" "), (_vm.timeEntry) ? _c('div', {
    staticClass: "context-container",
    attrs: {
      "id": "time-entry"
    }
  }, [_c('p', {
    staticClass: "context-question"
  }, [_vm._v(_vm._s(_vm.timeEntry.questionText))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.timeEntry.freeText.text),
      expression: "timeEntry.freeText.text"
    }],
    staticClass: "form-control input",
    attrs: {
      "placeholder": "time..."
    },
    domProps: {
      "value": (_vm.timeEntry.freeText.text)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.timeEntry.freeText.text = $event.target.value
      }
    }
  })]) : _vm._e(), _vm._v(" "), (_vm.moneyEntry) ? _c('div', {
    staticClass: "context-container",
    attrs: {
      "id": "money-entry"
    }
  }, [_c('p', {
    staticClass: "context-question"
  }, [_vm._v(_vm._s(_vm.moneyEntry.questionText))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.moneyEntry.freeText.text),
      expression: "moneyEntry.freeText.text"
    }],
    staticClass: "form-control input",
    attrs: {
      "placeholder": "money..."
    },
    domProps: {
      "value": (_vm.moneyEntry.freeText.text)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.moneyEntry.freeText.text = $event.target.value
      }
    }
  })]) : _vm._e(), _vm._v(" "), (_vm.thoughtsEntry) ? _c('div', {
    staticClass: "context-container",
    attrs: {
      "id": "thoughts-entry"
    }
  }, [_c('p', {
    staticClass: "context-question"
  }, [_vm._v(_vm._s(_vm.thoughtsEntry.questionText))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.thoughtsEntry.freeText.text),
      expression: "thoughtsEntry.freeText.text"
    }],
    staticClass: "form-control input",
    attrs: {
      "placeholder": "thoughts..."
    },
    domProps: {
      "value": (_vm.thoughtsEntry.freeText.text)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.thoughtsEntry.freeText.text = $event.target.value
      }
    }
  })]) : _vm._e(), _vm._v(" "), (_vm.peopleEntry) ? _c('div', {
    staticClass: "context-container",
    attrs: {
      "id": "people-entry"
    }
  }, [_c('p', {
    staticClass: "context-question"
  }, [_vm._v(_vm._s(_vm.peopleEntry.questionText))]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.peopleEntry.freeText.text),
      expression: "peopleEntry.freeText.text"
    }],
    staticClass: "form-control input",
    attrs: {
      "placeholder": "people..."
    },
    domProps: {
      "value": (_vm.peopleEntry.freeText.text)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.peopleEntry.freeText.text = $event.target.value
      }
    }
  })]) : _vm._e()]) : _vm._e(), _vm._v(" "), (_vm.mode === 'text') ? _c('div', {
    staticClass: "container"
  }, _vm._l((_vm.getCurrentStudy.verses), function(verse) {
    return _c('div', {
      staticClass: "verse-container"
    }, [_c('span', {
      staticClass: "verse-number"
    }, [(verse.number === 1) ? _c('span', [_vm._v(_vm._s(verse.chapter) + ":")]) : _vm._e(), _vm._v(_vm._s(verse.number))]), _vm._v(" "), _c('span', {
      staticClass: "verse-text"
    }, [_vm._v(_vm._s(verse.text))])])
  })) : _vm._e()]), _vm._v(" "), _c('div', {
    staticClass: "flex-zero bottombar clearfix"
  }, [(_vm.mode === 'context') ? _c('div', [_c('button', {
    staticClass: "btn callout-light btn-block",
    on: {
      "click": function($event) {
        _vm.contextQuestionsFinished()
      }
    }
  }, [_vm._v("NEXT")])]) : _vm._e(), _vm._v(" "), (_vm.mode === 'text') ? _c('div', [(_vm.currentStep !== 'done') ? _c('div', [_c('div', {
    staticClass: "proposition muted"
  }, [_vm._v("In the next 3 days, how should this passage affect")]), _vm._v(" "), _c('div', {
    staticClass: "condition"
  }, [_vm._v(_vm._s(_vm.stepCondition) + " "), _c('span', {
    staticClass: "condition-context muted"
  }, [_vm._v(_vm._s(_vm.stepConditionContext))])]), _vm._v(" "), _c('div', {
    staticClass: "user-input input",
    attrs: {
      "contenteditable": "true"
    }
  })]) : _vm._e(), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade"
    }
  }, [(_vm.currentStep !== 'time') ? _c('button', {
    staticClass: "btn btn-xs callout-light pull-left",
    on: {
      "click": function($event) {
        _vm.previousStep()
      }
    }
  }, [_vm._v("PREVIOUS")]) : _vm._e()]), _vm._v(" "), _c('button', {
    staticClass: "btn btn-xs callout-light pull-right",
    on: {
      "click": function($event) {
        _vm.nextPressed()
      }
    }
  }, [_vm._v(_vm._s(_vm.nextButtonText))])], 1) : _vm._e()])])
},staticRenderFns: []}

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(182)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(183),
  /* template */
  __webpack_require__(187),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-40c14606",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 182 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _vuex = __webpack_require__(1);

var _activity = __webpack_require__(4);

var _activity2 = _interopRequireDefault(_activity);

var _Drawer = __webpack_require__(21);

var _Drawer2 = _interopRequireDefault(_Drawer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {};
  },

  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)({
    words: 'getCurrentWords',
    getCurrentActivity: 'getCurrentActivity'
  }), {
    title: function title() {
      return _activity2.default.manager.titleForType(this.getCurrentActivity);
    }
  }),
  props: ['data'],
  components: { Drawer: _Drawer2.default },
  methods: {
    container: function container(index) {
      return this.data.containers[index];
    },

    wordClass: function wordClass(word) {
      if (this.data !== undefined) {
        return {
          orange: this.container(0).search(word),
          purple: this.container(1).search(word),
          red: this.container(2).search(word)
        };
      } else {
        return {};
      }
    },
    donePressed: function donePressed() {
      this.$router.replace('/activities');
    }
  }
};

/***/ }),
/* 184 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  data: function data() {
    return {
      collapsed: false
    };
  },

  props: ['expanded'],
  watch: {
    expanded: function expanded(val) {
      this.collapsed = this.expanded === undefined ? false : this.expanded;
    }
  },
  methods: {
    toggleDrawer: function toggleDrawer() {
      this.collapsed = !this.collapsed;
    }
  }
};

/***/ }),
/* 186 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "drawer"
  }, [_c('div', {
    staticClass: "drawer-header flex-row hi-bottom",
    on: {
      "click": _vm.toggleDrawer
    }
  }, [_c('div', {
    staticClass: "flex-one"
  }, [_vm._t("title")], 2), _vm._v(" "), _c('i', {
    staticClass: "fa fa-chevron-right muted",
    class: {
      'fa-rotate-90': !_vm.collapsed
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "drawer-content",
    class: {
      collapsed: _vm.collapsed
    }
  }, [_vm._t("content")], 2)])
},staticRenderFns: []}

/***/ }),
/* 187 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.data !== undefined) ? _c('div', {
    staticClass: "flex-column vfull"
  }, [_c('div', {
    staticClass: "flex-row shadow"
  }, [_c('div', {
    staticClass: "flex-one bucket-label back-orange"
  }, [_c('i', {
    staticClass: "fa fa-user-circle-o"
  }), _vm._v(" " + _vm._s(_vm.container(0).name))]), _vm._v(" "), _c('div', {
    staticClass: "flex-one bucket-label back-purple"
  }, [_c('i', {
    staticClass: "fa fa-institution"
  }), _vm._v(" " + _vm._s(_vm.container(1).name))]), _vm._v(" "), _c('div', {
    staticClass: "flex-one bucket-label back-red"
  }, [_c('i', {
    staticClass: "fa fa-tree"
  }), _vm._v(" " + _vm._s(_vm.container(2).name))])]), _vm._v(" "), _c('div', {
    staticClass: "flex-one substance"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('drawer', {
    attrs: {
      "expanded": true
    }
  }, [_c('div', {
    slot: "title"
  }, [_vm._v("\n          " + _vm._s(_vm.container(0).items.length) + " " + _vm._s(_vm.container(0).name) + ",\n          " + _vm._s(_vm.container(1).items.length) + " " + _vm._s(_vm.container(1).name) + ",\n          " + _vm._s(_vm.container(2).items.length) + " " + _vm._s(_vm.container(2).name))]), _vm._v(" "), _c('div', {
    staticClass: "row",
    slot: "content"
  }, [_c('div', {
    staticClass: "col-sm-4"
  }, [_c('ul', {
    staticClass: "word-list"
  }, _vm._l((_vm.container(0).items), function(selection) {
    return _c('li', {
      staticClass: "orange list-item"
    }, [_vm._v(_vm._s(selection.toString()))])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "col-sm-4"
  }, [_c('ul', {
    staticClass: "word-list"
  }, _vm._l((_vm.container(1).items), function(selection) {
    return _c('li', {
      staticClass: "purple list-item"
    }, [_vm._v(_vm._s(selection.toString()))])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "col-sm-4"
  }, [_c('ul', {
    staticClass: "word-list"
  }, _vm._l((_vm.container(2).items), function(selection) {
    return _c('li', {
      staticClass: "red list-item"
    }, [_vm._v(_vm._s(selection.toString()))])
  }))])])])], 1), _vm._v(" "), _c('br'), _vm._v(" "), _c('div', {
    staticClass: "container",
    attrs: {
      "id": "buckets-reviewer-words"
    }
  }, _vm._l((_vm.words), function(word, index) {
    return _c('span', {
      key: index,
      class: _vm.wordClass(word)
    }, [_vm._v(_vm._s(word.text) + " ")])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "flex-zero"
  }, [_c('div', {
    staticClass: "bottombar"
  }, [_c('button', {
    staticClass: "btn btn-lg callout-light btn-block",
    on: {
      "click": function($event) {
        _vm.donePressed()
      }
    }
  }, [_vm._v("DONE")])])])]) : _vm._e()
},staticRenderFns: []}

/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(189)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(190),
  /* template */
  __webpack_require__(191),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-70586d3a",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 189 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _vuex = __webpack_require__(1);

var _activity = __webpack_require__(4);

var _activity2 = _interopRequireDefault(_activity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {};
  },

  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)({
    words: 'getCurrentWords',
    getCurrentActivity: 'getCurrentActivity'
  }), {
    title: function title() {
      return _activity2.default.manager.titleForType(this.getCurrentActivity);
    }
  }),
  props: ['data'],
  methods: {
    donePressed: function donePressed() {
      this.$router.replace('/activities');
    }
  }
};

/***/ }),
/* 191 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.data !== undefined) ? _c('div', {
    staticClass: "flex-column vfull"
  }, [_c('div', {
    staticClass: "flex-one substance"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "actions"
  }, _vm._l((_vm.data.collection.items), function(action) {
    return _c('div', {
      staticClass: "action clearfix"
    }, [(action.actor) ? _c('div', {
      staticClass: "action-item list-item theme-mid"
    }, [_c('p', {
      staticClass: "action-label muted"
    }, [_vm._v("ACTOR")]), _vm._v(" "), _c('div', [_vm._v(_vm._s(action.actor ? action.actor.toString() : '?'))])]) : _vm._e(), _vm._v(" "), _c('div', {
      staticClass: "action-item list-item theme-mid"
    }, [_c('p', {
      staticClass: "action-label muted"
    }, [_vm._v("ACTION")]), _vm._v(" "), _c('div', {
      staticClass: "blue"
    }, [_vm._v(_vm._s(action.action ? action.action.toString() : '?'))])]), _vm._v(" "), (action.target) ? _c('div', {
      staticClass: "action-item list-item theme-mid"
    }, [_c('p', {
      staticClass: "action-label muted"
    }, [_vm._v("TARGET")]), _vm._v(" "), _c('div', [_vm._v(_vm._s(action.target ? action.target.toString() : '?'))])]) : _vm._e(), _vm._v(" "), (action.result) ? _c('div', {
      staticClass: "action-item list-item theme-mid"
    }, [_c('p', {
      staticClass: "action-label muted"
    }, [_vm._v("RESULT")]), _vm._v(" "), _c('div', [_vm._v(_vm._s(action.result ? action.result.toString() : '?'))])]) : _vm._e()])
  }))])]), _vm._v(" "), _c('div', {
    staticClass: "bottombar flex-zero"
  }, [_c('button', {
    staticClass: "btn btn-lg callout-light btn-block",
    on: {
      "click": function($event) {
        _vm.donePressed()
      }
    }
  }, [_vm._v("DONE")])])]) : _vm._e()
},staticRenderFns: []}

/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(193)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(194),
  /* template */
  __webpack_require__(195),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-c3144b32",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 193 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _vuex = __webpack_require__(1);

var _activity = __webpack_require__(4);

var _activity2 = _interopRequireDefault(_activity);

var _Drawer = __webpack_require__(21);

var _Drawer2 = _interopRequireDefault(_Drawer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      adjectiveWords: [],
      hidePairings: false
    };
  },

  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)({
    words: 'getCurrentWords',
    getCurrentActivity: 'getCurrentActivity'
  }), {
    title: function title() {
      return _activity2.default.manager.titleForType(this.getCurrentActivity);
    }
  }),
  props: ['data'],
  components: { Drawer: _Drawer2.default },
  methods: {
    adjectiveText: function adjectiveText(wordSelection) {
      return wordSelection ? wordSelection.toString() : '';
    },
    targetText: function targetText(wordSelection) {
      return wordSelection ? wordSelection.toString() : '';
    },
    wordClass: function wordClass(word) {
      var found = this.adjectiveWords.find(function (w) {
        return word.verse === w.verse && word.index === w.index;
      });
      return found ? ['red'] : [];
    },

    donePressed: function donePressed() {
      this.$router.replace('/activities');
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.adjectiveWords = [];
    this.data.collection.items.forEach(function (adj) {
      return adj.wordSelection.words.forEach(function (w) {
        return _this.adjectiveWords.push(w);
      });
    });
  }
};

/***/ }),
/* 195 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.data !== undefined) ? _c('div', {
    staticClass: "flex-column vfull"
  }, [_c('div', {
    staticClass: "flex-one substance"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('drawer', {
    attrs: {
      "expanded": true
    }
  }, [_c('div', {
    slot: "title"
  }, [_vm._v(_vm._s(_vm.data.collection.items.length) + " ADJECTIVES")]), _vm._v(" "), _vm._l((_vm.data.collection.items), function(adjective) {
    return _c('div', {
      staticClass: "adjective-item",
      slot: "content"
    }, [_c('span', {
      staticClass: "adjective back-red"
    }, [_vm._v(_vm._s(_vm.adjectiveText(adjective.wordSelection)))]), (adjective.target) ? _c('span', [_vm._v("-")]) : _vm._e(), (adjective.target) ? _c('span', {
      staticClass: "target back-purple"
    }, [_vm._v(_vm._s(_vm.targetText(adjective.target)))]) : _vm._e()])
  })], 2)], 1), _vm._v(" "), _c('div', {
    staticClass: "adjective-words"
  }, _vm._l((_vm.words), function(word, index) {
    return _c('span', {
      key: index,
      class: _vm.wordClass(word)
    }, [_vm._v(_vm._s(word.text) + " ")])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "bottombar flex-zero"
  }, [_c('button', {
    staticClass: "btn btn-lg btn-clear btn-block",
    on: {
      "click": function($event) {
        _vm.donePressed()
      }
    }
  }, [_vm._v("DONE")])])]) : _vm._e()
},staticRenderFns: []}

/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(197)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(198),
  /* template */
  __webpack_require__(199),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-4a40203e",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 197 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _vuex = __webpack_require__(1);

var _Drawer = __webpack_require__(21);

var _Drawer2 = _interopRequireDefault(_Drawer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {};
  },

  props: ['data'],
  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)(['getCurrentStudy']), {
    topics: function topics() {
      return this.data.collection.items;
    }
  }),
  components: { Drawer: _Drawer2.default },
  methods: {
    donePressed: function donePressed() {
      this.$router.replace('/activities');
    }
  }
};

/***/ }),
/* 199 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "flex-column vfull"
  }, [_c('div', {
    staticClass: "flex-one substance"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('drawer', {
    attrs: {
      "expanded": true
    }
  }, [_c('div', {
    slot: "title"
  }, [_vm._v(_vm._s(_vm.topics.length) + " TOPICS")]), _vm._v(" "), _vm._l((_vm.topics), function(topic) {
    return _c('div', {
      staticClass: "theme-mid shadow-light topic",
      slot: "content"
    }, [_c('span', {
      staticClass: "muted hi-right topic-order"
    }, [_vm._v(_vm._s(topic.order + 1))]), _c('i', {
      staticClass: "fa fa-tag callout-light alt"
    }), _vm._v(" " + _vm._s(topic.text) + "\n        ")])
  })], 2)], 1), _vm._v(" "), _c('div', {
    staticClass: "container"
  }, _vm._l((_vm.getCurrentStudy.verses), function(verse) {
    return _c('div', {
      staticClass: "verse"
    }, [_c('span', {
      staticClass: "verse-number"
    }, [(verse.number === 1) ? _c('span', [_vm._v(_vm._s(verse.chapter) + ":")]) : _vm._e(), _vm._v(_vm._s(verse.number))]), _vm._v(" "), _c('span', {
      staticClass: "verse-text"
    }, [_vm._v(_vm._s(verse.text))])])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "bottombar flex-zero"
  }, [_c('button', {
    staticClass: "btn btn-lg btn-clear btn-block",
    on: {
      "click": function($event) {
        _vm.donePressed()
      }
    }
  }, [_vm._v("DONE")])])])
},staticRenderFns: []}

/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(201)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(202),
  /* template */
  __webpack_require__(203),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-00526cff",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 201 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Section = __webpack_require__(31);

var _Section2 = _interopRequireDefault(_Section);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {};
  },

  computed: {},
  components: { SectionVue: _Section2.default },
  props: ['data'],
  methods: {
    donePressed: function donePressed() {
      this.$router.replace('/activities');
    }
  }
};

/***/ }),
/* 203 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.data !== undefined) ? _c('div', {
    staticClass: "flex-column vfull"
  }, [_c('div', {
    staticClass: "flex-one substance"
  }, [_c('div', {
    staticClass: "container"
  }, _vm._l((_vm.data.collection.items), function(section, sectionIndex) {
    return _c('div', {
      key: sectionIndex,
      staticClass: "row section-container"
    }, [_c('section-vue', {
      staticClass: "section-content col-xs-12 readonly",
      attrs: {
        "section": section,
        "index": sectionIndex,
        "allows-sub-sections": true
      }
    })], 1)
  }))]), _vm._v(" "), _c('div', {
    staticClass: "flex-zero bottombar"
  }, [_c('button', {
    staticClass: "btn btn-lg callout-light btn-block",
    on: {
      "click": function($event) {
        _vm.donePressed()
      }
    }
  }, [_vm._v("DONE")])])]) : _vm._e()
},staticRenderFns: []}

/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(205)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(206),
  /* template */
  __webpack_require__(207),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-726fe9d6",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 205 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _vuex = __webpack_require__(1);

var _activity = __webpack_require__(4);

var _activity2 = _interopRequireDefault(_activity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {};
  },

  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)({
    words: 'getCurrentWords',
    getCurrentActivity: 'getCurrentActivity'
  }), {
    title: function title() {
      return _activity2.default.manager.titleForType(this.getCurrentActivity);
    }
  }),
  props: ['data'],
  methods: {
    donePressed: function donePressed() {
      this.$router.replace('/activities');
    }
  }
};

/***/ }),
/* 207 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.data !== undefined) ? _c('div', {
    staticClass: "flex-column vfull"
  }, [_c('div', {
    staticClass: "flex-one"
  }, [_c('div', {
    staticClass: "container substance"
  }, _vm._l((_vm.data.collection.items), function(freeText) {
    return _c('span', [_vm._v(_vm._s(freeText.text) + " ")])
  }))]), _vm._v(" "), _c('div', {
    staticClass: "flex-zero bottombar"
  }, [_c('button', {
    staticClass: "btn btn-lg callout-light btn-block",
    on: {
      "click": function($event) {
        _vm.donePressed()
      }
    }
  }, [_vm._v("DONE")])])]) : _vm._e()
},staticRenderFns: []}

/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(209)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(210),
  /* template */
  __webpack_require__(211),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-0864a07a",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 209 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _vuex = __webpack_require__(1);

var _activity = __webpack_require__(4);

var _activity2 = _interopRequireDefault(_activity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {};
  },

  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)(['getCurrentActivity']), {
    title: function title() {
      return _activity2.default.manager.titleForType(this.getCurrentActivity);
    }
  }),
  props: ['data'],
  methods: {
    donePressed: function donePressed() {
      this.$router.replace('/activities');
    }
  }
};

/***/ }),
/* 211 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.data !== undefined) ? _c('div', {
    staticClass: "flex-column vfull"
  }, [_c('div', {
    staticClass: "flex-one substance"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('div', {
    staticClass: "space-container"
  }, [_vm._m(0), _vm._v(" "), _vm._l((this.data.findContainer('S').items), function(freeText) {
    return _c('p', {
      staticClass: "space-item list-item"
    }, [_vm._v(_vm._s(freeText.text))])
  }), _vm._v(" "), (this.data.findContainer('S').items.length === 0) ? _c('p', {
    staticClass: "space-item-empty muted"
  }, [_vm._v("none identified")]) : _vm._e()], 2), _vm._v(" "), _c('div', {
    staticClass: "space-container"
  }, [_vm._m(1), _vm._v(" "), _vm._l((this.data.findContainer('P').items), function(freeText) {
    return _c('p', {
      staticClass: "space-item list-item"
    }, [_vm._v(_vm._s(freeText.text))])
  }), _vm._v(" "), (this.data.findContainer('P').items.length === 0) ? _c('p', {
    staticClass: "space-item-empty muted"
  }, [_vm._v("none identified")]) : _vm._e()], 2), _vm._v(" "), _c('div', {
    staticClass: "space-container"
  }, [_vm._m(2), _vm._v(" "), _vm._l((this.data.findContainer('A').items), function(freeText) {
    return _c('p', {
      staticClass: "space-item list-item"
    }, [_vm._v(_vm._s(freeText.text))])
  }), _vm._v(" "), (this.data.findContainer('A').items.length === 0) ? _c('p', {
    staticClass: "space-item-empty muted"
  }, [_vm._v("none identified")]) : _vm._e()], 2), _vm._v(" "), _c('div', {
    staticClass: "space-container"
  }, [_vm._m(3), _vm._v(" "), _vm._l((this.data.findContainer('C').items), function(freeText) {
    return _c('p', {
      staticClass: "space-item list-item"
    }, [_vm._v(_vm._s(freeText.text))])
  }), _vm._v(" "), (this.data.findContainer('C').items.length === 0) ? _c('p', {
    staticClass: "space-item-empty muted"
  }, [_vm._v("none identified")]) : _vm._e()], 2), _vm._v(" "), _c('div', {
    staticClass: "space-container"
  }, [_vm._m(4), _vm._v(" "), _vm._l((this.data.findContainer('E').items), function(freeText) {
    return _c('p', {
      staticClass: "space-item list-item"
    }, [_vm._v(_vm._s(freeText.text))])
  }), _vm._v(" "), (this.data.findContainer('E').items.length === 0) ? _c('p', {
    staticClass: "space-item-empty muted"
  }, [_vm._v("none identified")]) : _vm._e()], 2)])]), _vm._v(" "), _c('div', {
    staticClass: "flex-zero bottombar"
  }, [_c('button', {
    staticClass: "btn btn-lg callout-light btn-block",
    on: {
      "click": function($event) {
        _vm.donePressed()
      }
    }
  }, [_vm._v("DONE")])])]) : _vm._e()
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', {
    staticClass: "space-title muted"
  }, [_c('span', {
    staticClass: "acronym"
  }, [_vm._v("S")]), _vm._v("INS TO CONFESS")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', {
    staticClass: "space-title muted"
  }, [_c('span', {
    staticClass: "acronym"
  }, [_vm._v("P")]), _vm._v("ROMISES TO CLAIM")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', {
    staticClass: "space-title muted"
  }, [_c('span', {
    staticClass: "acronym"
  }, [_vm._v("A")]), _vm._v("CTIONS TO TAKE")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', {
    staticClass: "space-title muted"
  }, [_c('span', {
    staticClass: "acronym"
  }, [_vm._v("C")]), _vm._v("OMMANDS TO OBEY")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', {
    staticClass: "space-title muted"
  }, [_c('span', {
    staticClass: "acronym"
  }, [_vm._v("E")]), _vm._v("XAMPLES TO FOLLOW")])
}]}

/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(213)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(214),
  /* template */
  __webpack_require__(215),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-477cb699",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 213 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _vuex = __webpack_require__(1);

var _activity = __webpack_require__(4);

var _activity2 = _interopRequireDefault(_activity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      timeEntry: { freeText: {} },
      moneyEntry: { freeText: {} },
      thoughtsEntry: { freeText: {} },
      peopleEntry: { freeText: {} },
      affectTimeEntry: { freeText: {} },
      affectMoneyEntry: { freeText: {} },
      affectThoughtsEntry: { freeText: {} },
      affectPeopleEntry: { freeText: {} }
    };
  },

  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)(['getCurrentStudy']), {
    title: function title() {
      return _activity2.default.manager.titleForType(this.getCurrentActivity);
    }
  }),
  props: ['data'],
  methods: {
    findQuestionEntry: function findQuestionEntry(type) {
      var items = this.data.collection.items;
      for (var item in items) {
        if (items[item].questionId === type) {
          return items[item];
        }
      }
      return undefined;
    },

    donePressed: function donePressed() {
      this.$router.replace('/activities');
    }
  },
  mounted: function mounted() {
    this.timeEntry = this.findQuestionEntry('time');
    this.moneyEntry = this.findQuestionEntry('money');
    this.thoughtsEntry = this.findQuestionEntry('thoughts');
    this.peopleEntry = this.findQuestionEntry('people');
    this.affectTimeEntry = this.findQuestionEntry('affect-time');
    this.affectMoneyEntry = this.findQuestionEntry('affect-money');
    this.affectThoughtsEntry = this.findQuestionEntry('affect-thoughts');
    this.affectPeopleEntry = this.findQuestionEntry('affect-people');
  }
};

/***/ }),
/* 215 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.data !== undefined) ? _c('div', {
    staticClass: "flex-column vfull"
  }, [_c('div', {
    staticClass: "flex-one substance"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('p', {
    staticClass: "title-label callout brand-font shadow-light"
  }, [_vm._v("Life Context - "), _c('span', {
    staticClass: "muted"
  }, [_vm._v("3 days following " + _vm._s(_vm.getCurrentStudy.lastEditLabel()))])]), _vm._v(" "), (_vm.timeEntry.freeText.text) ? _c('p', {
    staticClass: "question"
  }, [_vm._v(_vm._s(_vm.timeEntry.questionText))]) : _vm._e(), _vm._v(" "), (_vm.timeEntry.freeText.text) ? _c('p', {
    staticClass: "list-item"
  }, [_vm._v(_vm._s(_vm.timeEntry.freeText.text))]) : _vm._e(), _vm._v(" "), (_vm.moneyEntry.freeText.text) ? _c('p', {
    staticClass: "question"
  }, [_vm._v(_vm._s(_vm.moneyEntry.questionText))]) : _vm._e(), _vm._v(" "), (_vm.moneyEntry.freeText.text) ? _c('p', {
    staticClass: "list-item"
  }, [_vm._v(_vm._s(_vm.moneyEntry.freeText.text))]) : _vm._e(), _vm._v(" "), (_vm.thoughtsEntry.freeText.text) ? _c('p', {
    staticClass: "question"
  }, [_vm._v(_vm._s(_vm.thoughtsEntry.questionText))]) : _vm._e(), _vm._v(" "), (_vm.thoughtsEntry.freeText.text) ? _c('p', {
    staticClass: "list-item"
  }, [_vm._v(_vm._s(_vm.thoughtsEntry.freeText.text))]) : _vm._e(), _vm._v(" "), (_vm.peopleEntry.freeText.text) ? _c('p', {
    staticClass: "question"
  }, [_vm._v(_vm._s(_vm.peopleEntry.questionText))]) : _vm._e(), _vm._v(" "), (_vm.peopleEntry.freeText.text) ? _c('p', {
    staticClass: "list-item"
  }, [_vm._v(_vm._s(_vm.peopleEntry.freeText.text))]) : _vm._e(), _vm._v(" "), _c('p', {
    staticClass: "title-label callout brand-font shadow-light"
  }, [_vm._v("How this passage should affect...")]), _vm._v(" "), _c('p', {
    staticClass: "question"
  }, [_vm._v("..." + _vm._s(_vm.affectTimeEntry.questionText))]), _vm._v(" "), _c('p', {
    staticClass: "list-item"
  }, [_vm._v(_vm._s(_vm.affectTimeEntry.freeText.text))]), _vm._v(" "), _c('p', {
    staticClass: "question"
  }, [_vm._v("..." + _vm._s(_vm.affectMoneyEntry.questionText))]), _vm._v(" "), _c('p', {
    staticClass: "list-item"
  }, [_vm._v(_vm._s(_vm.affectMoneyEntry.freeText.text))]), _vm._v(" "), _c('p', {
    staticClass: "question"
  }, [_vm._v("..." + _vm._s(_vm.affectThoughtsEntry.questionText))]), _vm._v(" "), _c('p', {
    staticClass: "list-item"
  }, [_vm._v(_vm._s(_vm.affectThoughtsEntry.freeText.text))]), _vm._v(" "), _c('p', {
    staticClass: "question"
  }, [_vm._v("..." + _vm._s(_vm.affectPeopleEntry.questionText))]), _vm._v(" "), _c('p', {
    staticClass: "list-item"
  }, [_vm._v(_vm._s(_vm.affectPeopleEntry.freeText.text))])])]), _vm._v(" "), _c('div', {
    staticClass: "flex-zero bottombar"
  }, [_c('button', {
    staticClass: "btn btn-lg callout-light btn-block",
    on: {
      "click": function($event) {
        _vm.donePressed()
      }
    }
  }, [_vm._v("DONE")])])]) : _vm._e()
},staticRenderFns: []}

/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(217)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(218),
  /* template */
  __webpack_require__(219),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-f560d3da",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 217 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  data: function data() {
    return {};
  },

  components: {},
  props: [],
  computed: {},
  methods: {}
};

/***/ }),
/* 219 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _vm._m(0)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "help-content"
  }, [_c('div', {
    staticClass: "clearfix"
  }, [_c('div', {
    staticClass: "video-help embed-responsive embed-responsive-16by9"
  }, [_c('iframe', {
    attrs: {
      "src": "https://www.youtube.com/embed/KNV93v4ey20?rel=0",
      "frameborder": "0",
      "allowfullscreen": ""
    }
  })]), _vm._v(" "), _c('p', [_vm._v("Place words from the passage in 1 of 3 buckets/categories: People, Places, or Things.")]), _vm._v(" "), _c('div', {
    staticClass: "help-buckets"
  }, [_c('div', {
    staticClass: "third back-orange"
  }, [_vm._v("PEOPLE")]), _vm._v(" "), _c('div', {
    staticClass: "third back-purple"
  }, [_vm._v("PLACES")]), _vm._v(" "), _c('div', {
    staticClass: "third back-red"
  }, [_vm._v("THINGS")])]), _vm._v(" "), _c('br'), _vm._v(" "), _c('br'), _vm._v(" "), _c('p', [_vm._v("Scroll the text left or right to "), _c('span', {
    staticClass: "selected"
  }, [_vm._v("select")]), _vm._v(" a different word.")]), _vm._v(" "), _c('p', [_vm._v("• Tap a bucket to place the selected word in the corresponding category, and the word will change to the matching color.")]), _vm._v(" "), _c('p', [_vm._v("• To clear a word from a category, select the "), _c('img', {
    staticClass: "svg close-button",
    attrs: {
      "id": "buckets-help-clear",
      "src": "/static/images/close.svg"
    }
  }), _vm._v(" button that appears beneath the selected word.")]), _vm._v(" "), _c('p', [_vm._v("• Once you are finished categorizing words in the passage, select the 'DONE' button at the bottom of the screen.")])])])
}]}

/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(221)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(222),
  /* template */
  __webpack_require__(223),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-28627747",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 221 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  data: function data() {
    return {};
  },

  components: {},
  props: [],
  computed: {},
  methods: {}
};

/***/ }),
/* 223 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _vm._m(0)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "container"
  }, [_c('div', [_c('strong', [_vm._v("What is "), _c('i', [_vm._v("happening")]), _vm._v(" in this passage?")])]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('p', [_c('strong', [_c('span', {
    staticClass: "step-label"
  }, [_vm._v("Step 1")]), _vm._v(" Select actions")])]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('div', [_c('p', [_vm._v("Tap a word to "), _c('span', {
    staticClass: "word-highlight"
  }, [_vm._v("highlight")]), _vm._v(" it.")]), _vm._v(" "), _c('p', [_c('strong', [_vm._v("Swipe "), _c('i', {
    staticClass: "fa fa-arrow-circle-right"
  }), _vm._v(" right")]), _vm._v(" or "), _c('strong', [_c('i', {
    staticClass: "fa fa-arrow-circle-up"
  }), _vm._v(" up")]), _vm._v(" to extend your highlight")]), _vm._v(" "), _c('p', [_c('strong', [_vm._v("Swipe "), _c('i', {
    staticClass: "fa fa-arrow-circle-left"
  }), _vm._v(" left")]), _vm._v(" or "), _c('strong', [_c('i', {
    staticClass: "fa fa-arrow-circle-down"
  }), _vm._v(" down")]), _vm._v(" to lessen your highlight")]), _vm._v(" "), _c('br'), _vm._v(" "), _c('p', [_c('strong', [_c('i', {
    staticClass: "fa fa-hand-o-down"
  }), _vm._v(" Tap once")]), _vm._v(" to complete your selection.")]), _vm._v(" "), _c('p', [_c('strong', [_c('i', {
    staticClass: "fa fa-hand-o-down"
  }), _vm._v(" "), _c('i', {
    staticClass: "fa fa-hand-o-down"
  }), _vm._v(" Tap twice")]), _vm._v(" to delete your selection.")]), _vm._v(" "), _c('br'), _vm._v(" "), _c('p', [_vm._v("Click "), _c('span', {
    staticClass: "btn callout-light help-action"
  }, [_vm._v("NEXT")]), _vm._v(" to move on to Step 2")])]), _vm._v(" "), _c('br'), _vm._v(" "), _c('hr'), _vm._v(" "), _c('p', [_c('strong', [_c('span', {
    staticClass: "step-label"
  }, [_vm._v("Step 2")]), _vm._v(" Add detail to actions (optional)")])]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('div', [_vm._v("\n     Select details about an action (who or what is doing it, the result or purpose of the action, etc). Use the "), _c('span', {
    staticClass: "btn help-action-tab theme-back"
  }, [_vm._v("buttons")]), _vm._v(" at the bottom of the screen to select these things. Press "), _c('span', {
    staticClass: "btn callout-light help-action"
  }, [_vm._v("DONE")]), _vm._v(" when you are finished selecting targets, or to skip this step.\n  ")]), _vm._v(" "), _c('br')])
}]}

/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(225)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(226),
  /* template */
  __webpack_require__(227),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-47acf4b2",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 225 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  data: function data() {
    return {};
  },

  computed: {},
  methods: {}
};

/***/ }),
/* 227 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _vm._m(0)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "container"
  }, [_c('div', [_c('strong', [_vm._v("What is "), _c('i', [_vm._v("described")]), _vm._v(" in this passage?")]), _vm._v(" "), _c('br'), _vm._v("\n    Select adjectives or descriptive phrases to better understand the details of the text.\n  ")]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('p', [_c('strong', [_c('span', {
    staticClass: "step-label"
  }, [_vm._v("Step 1")]), _vm._v(" Select adjectives")])]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('div', [_c('p', [_vm._v("Tap a word to "), _c('span', {
    staticClass: "word-highlight"
  }, [_vm._v("highlight")]), _vm._v(" it.")]), _vm._v(" "), _c('p', [_c('strong', [_vm._v("Swipe "), _c('i', {
    staticClass: "fa fa-arrow-circle-right"
  }), _vm._v(" right")]), _vm._v(" or "), _c('strong', [_c('i', {
    staticClass: "fa fa-arrow-circle-up"
  }), _vm._v(" up")]), _vm._v(" to extend your highlight")]), _vm._v(" "), _c('p', [_c('strong', [_vm._v("Swipe "), _c('i', {
    staticClass: "fa fa-arrow-circle-left"
  }), _vm._v(" left")]), _vm._v(" or "), _c('strong', [_c('i', {
    staticClass: "fa fa-arrow-circle-down"
  }), _vm._v(" down")]), _vm._v(" to lessen your highlight")]), _vm._v(" "), _c('p', [_c('strong', [_c('i', {
    staticClass: "fa fa-hand-o-down"
  }), _vm._v(" Tap once")]), _vm._v(" to complete your selection.")]), _vm._v(" "), _c('p', [_c('strong', [_c('i', {
    staticClass: "fa fa-hand-o-down"
  }), _vm._v(" "), _c('i', {
    staticClass: "fa fa-hand-o-down"
  }), _vm._v(" Tap twice")]), _vm._v(" to delete your selection.")]), _vm._v(" "), _c('br'), _vm._v(" "), _c('p', [_vm._v("Click "), _c('span', {
    staticClass: "btn callout-light help-action"
  }, [_vm._v("NEXT")]), _vm._v(" to move on to Step 2")])]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('p', [_c('strong', [_c('span', {
    staticClass: "step-label"
  }, [_vm._v("Step 2")]), _vm._v(" Add detail to adjectives (optional)")])]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('div', [_vm._v("\n     In the same way as you selected each adjective, optionally select the target of each adjective (who or what the word is describing). Press "), _c('span', {
    staticClass: "btn callout-light help-action"
  }, [_vm._v("DONE")]), _vm._v(" when you are finished selecting targets, or to skip this step.\n  ")])])
}]}

/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(229)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(230),
  /* template */
  __webpack_require__(231),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-2fea36ac",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 229 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  data: function data() {
    return {};
  },

  components: {}
};

/***/ }),
/* 231 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _vm._m(0)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('p', [_vm._v("What are the topics and themes in this passage?")]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('p', [_vm._v("What is important in the passage? What recurring ideas do you see?")]), _vm._v(" "), _c('p', [_vm._v("Enter all topics you notice. Once you press the button at the bottom of the screen you will be able to drag the topics you entered into order of importance. Topics at the top of the list should be those that best summarize the content of the passage.")])])
}]}

/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(233)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(234),
  /* template */
  __webpack_require__(235),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-71f5218c",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 233 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  data: function data() {
    return {
      words: ['Tap', 'a', 'word', 'to', 'Select', 'the', 'beginning', 'of', 'a', 'section,', 'tap', 'another', 'word', 'to', 'Select', 'the', 'end', 'of', 'the', 'section.']
    };
  },

  components: {},
  props: [],
  computed: {
    selectWord: function selectWord() {
      return typeof window.orientation !== 'undefined' ? 'Tap' : 'Select';
    },
    selectWordActive: function selectWordActive() {
      return typeof window.orientation !== 'undefined' ? 'Tapping' : 'Selecting';
    }
  },
  methods: {
    isSelected: function isSelected(index) {
      return [4, 10, 11, 12].indexOf(index) !== -1;
    },
    isStart: function isStart(index) {
      return index === 10;
    },
    isEnd: function isEnd(index) {
      return index === 12;
    }
  }
};

/***/ }),
/* 235 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "container"
  }, [_c('p', {
    staticClass: "subtitle"
  }, [_vm._v("Divide the passage into sections.")]), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.selectWord) + " a word to make it the beginning of a new section. Sections reflect the main points in the passage, or represent a change in what the passage is saying.")]), _vm._v(" "), _vm._m(0), _vm._v(" "), _c('p', [_vm._v("Subpoints capture the main details that support your section title.")])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', {
    staticClass: "subtitle"
  }, [_c('i', [_vm._v("Optionally")]), _vm._v(" add subpoints beneath each section title.")])
}]}

/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(237)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(238),
  /* template */
  __webpack_require__(239),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-183e13a1",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 237 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  data: function data() {
    return {};
  },

  components: {},
  props: [],
  computed: {
    selectWord: function selectWord() {
      return typeof window.orientation !== 'undefined' ? 'Tap' : 'Select';
    },
    selectWordActive: function selectWordActive() {
      return typeof window.orientation !== 'undefined' ? 'Tapping' : 'Selecting';
    }
  },
  methods: {}
};

/***/ }),
/* 239 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "container help-content"
  }, [_c('div', {
    staticClass: "clearfix"
  }, [_vm._m(0), _vm._v(" "), _c('hr'), _vm._v(" "), _c('p', [_vm._v("• " + _vm._s(_vm.selectWord) + " a verse to begin paraphrasing. Paraphrase multiple verses at once by " + _vm._s(_vm.selectWordActive.toLowerCase()) + " the last verse in the range you want to paraphrase.")]), _vm._v(" "), _c('p', [_vm._v("• This activity requires that you paraphrase the entire passage you are studying.")])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', [_c('i', [_vm._v("Paraphrase a passage by summarizing the text in your own words, capturing the author's main ideas.")])])
}]}

/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(241)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(242),
  /* template */
  __webpack_require__(243),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-7b6b72e0",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 241 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  data: function data() {
    return {};
  },

  components: {},
  props: [],
  computed: {
    selectWord: function selectWord() {
      return typeof window.orientation !== 'undefined' ? 'Tap' : 'Select';
    },
    selectWordActive: function selectWordActive() {
      return typeof window.orientation !== 'undefined' ? 'Tapping' : 'Selecting';
    }
  },
  methods: {}
};

/***/ }),
/* 243 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "container help-content"
  }, [_c('div', {
    staticClass: "clearfix"
  }, [_vm._m(0), _vm._v(" "), _c('hr'), _vm._v(" "), _c('p', [_vm._v("SPACE is an acronym which stands for:")]), _vm._v(" "), _vm._m(1), _vm._v(" "), _vm._m(2), _vm._v(" "), _vm._m(3), _vm._v(" "), _vm._m(4), _vm._v(" "), _vm._m(5), _vm._v(" "), _c('p', [_vm._v("• Read and examine the text, relying on the Spirit to reveal each of these things to you. As you identify opportunity for application in one of these 5 areas, " + _vm._s(_vm.selectWord.toLowerCase()) + " the corresponding letter button in the action bar to record your thoughts.")]), _vm._v(" "), _c('p', [_vm._v("• Record as many applications for each area as you are able. " + _vm._s(_vm.selectWord) + " 'DONE' when you are finished.")])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', [_c('i', [_vm._v("When applying the Scripture, be specific and be personal.")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', [_c('strong', [_vm._v("S")]), _vm._v(" - Sin to confess")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', [_c('strong', [_vm._v("P")]), _vm._v(" - Promise to claim")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', [_c('strong', [_vm._v("A")]), _vm._v(" - Action to take")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', [_c('strong', [_vm._v("C")]), _vm._v(" - Command to obey")])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('p', [_c('strong', [_vm._v("E")]), _vm._v(" - Example to follow")])
}]}

/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(245)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(246),
  /* template */
  __webpack_require__(247),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-b97490b4",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 245 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  data: function data() {
    return {};
  },

  components: {},
  props: [],
  computed: {
    selectWord: function selectWord() {
      return typeof window.orientation !== 'undefined' ? 'Tap' : 'Select';
    },
    selectWordActive: function selectWordActive() {
      return typeof window.orientation !== 'undefined' ? 'Tapping' : 'Selecting';
    }
  },
  methods: {}
};

/***/ }),
/* 247 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _vm._m(0)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "container help-content"
  }, [_c('div', {
    staticClass: "clearfix"
  }, [_c('p', [_c('i', [_vm._v("When applying the Scripture, be specific and be personal.")])]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('p', [_vm._v("To complete this activity, answer the questions as they appear. This activity focuses on four main \"resources\" in our life: "), _c('strong', [_vm._v("time, money, thoughts, and relationships.")])]), _vm._v(" "), _c('br'), _vm._v(" "), _c('p', [_vm._v("The first set of questions will help you think about your life context right now. These things should be on your mind as you apply the scripture passage to your life.")]), _vm._v(" "), _c('br'), _vm._v(" "), _c('p', [_vm._v("The second set of questions will help you examine these areas of your life. You must make decisions as to how you prioritize and spend these resources. You will answer how the passage does or does not affect each of these areas of your life.")])])])
}]}

/***/ }),
/* 248 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    attrs: {
      "id": "activity-wrapper"
    }
  }, [_c('titlebar', {
    attrs: {
      "id": "activity-titlebar",
      "title": _vm.title.toUpperCase(),
      "left-items": _vm.leftMenuItems,
      "right-items": _vm.rightMenuItems,
      "on-close": _vm.closePressed,
      "on-help": _vm.helpPressed,
      "on-select": _vm.titlebarSelect
    }
  }), _vm._v(" "), _c('menubar'), _vm._v(" "), (!_vm.isReviewing) ? _c('div', {
    staticClass: "blur",
    attrs: {
      "id": "activity"
    }
  }, [(_vm.getCurrentActivity && _vm.activityData) ? _c(_vm.currentActivity, {
    ref: "activity",
    tag: "component",
    attrs: {
      "finish": _vm.onFinish,
      "data": _vm.activityData
    }
  }) : _vm._e()], 1) : _vm._e(), _vm._v(" "), (_vm.isReviewing) ? _c('div', {
    staticClass: "blur",
    attrs: {
      "id": "review"
    }
  }, [(_vm.currentReviewer && _vm.activityData) ? _c(_vm.currentReviewer, {
    tag: "component",
    attrs: {
      "data": _vm.activityData
    }
  }) : _vm._e()], 1) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "visible",
    attrs: {
      "id": "help"
    }
  }, [_c('div', {
    staticClass: "help-container"
  }, [_c('div', {
    staticClass: "help-box shadow-long"
  }, [_c('div', {
    staticClass: "help-title"
  }, [_vm._v(_vm._s(_vm.title.toUpperCase()) + ": HOW TO "), _c('span', {
    staticClass: "glyphicon glyphicon-remove",
    on: {
      "click": function($event) {
        _vm.helpDismiss()
      }
    }
  })]), _vm._v(" "), (_vm.getCurrentActivity) ? _c(_vm.currentHelpView, {
    tag: "component"
  }) : _vm._e(), _vm._v(" "), _c('button', {
    staticClass: "btn btn-block btn-help",
    on: {
      "click": function($event) {
        _vm.helpDismiss()
      }
    }
  }, [_vm._v("START")])], 1)])])], 1)
},staticRenderFns: []}

/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(250)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(251),
  /* template */
  __webpack_require__(252),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-15bf9882",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 250 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(2);

var _extends3 = _interopRequireDefault(_extends2);

var _vuex = __webpack_require__(1);

var _Titlebar = __webpack_require__(5);

var _Titlebar2 = _interopRequireDefault(_Titlebar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      readingMode: 'list'
    };
  },

  components: {
    Titlebar: _Titlebar2.default
  },
  computed: (0, _extends3.default)({}, (0, _vuex.mapGetters)(['getCurrentStudy']), {
    readingModeButtonClass: function readingModeButtonClass() {
      return this.readingMode === 'list' ? ['glyphicon-align-center'] : ['glyphicon-list'];
    }
  }),
  methods: {
    goBack: function goBack() {
      this.$router.back();
    },
    toggleTextStyle: function toggleTextStyle() {
      this.readingMode = this.readingMode === 'list' ? 'inline' : 'list';
    }
  }
};

/***/ }),
/* 252 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('titlebar', {
    attrs: {
      "title": _vm.getCurrentStudy.passage.description(),
      "left-items": ['back'],
      "on-back": _vm.goBack
    }
  }, [_c('div', {
    slot: "right"
  }, [_c('span', {
    staticClass: "verses-style glyphicon",
    class: _vm.readingModeButtonClass,
    on: {
      "click": function($event) {
        _vm.toggleTextStyle()
      }
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "flex-column vfull"
  }, [_c('div', {
    staticClass: "flex-one substance"
  }, [_c('div', {
    staticClass: "container verses",
    class: {
      inline: _vm.readingMode === 'inline'
    }
  }, _vm._l((_vm.getCurrentStudy.verses), function(verse) {
    return _c('div', {
      staticClass: "verse theme-mid hover",
      attrs: {
        "data-verse": verse.number
      }
    }, [_c('span', {
      staticClass: "verse-number"
    }, [(verse.number === 1) ? _c('span', [_vm._v(_vm._s(verse.chapter) + ":")]) : _vm._e(), _vm._v(_vm._s(verse.number))]), _c('span', {
      staticClass: "verse-text"
    }, [_vm._v(_vm._s(verse.text))])])
  }))])])], 1)
},staticRenderFns: []}

/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(254)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(255),
  /* template */
  __webpack_require__(263),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-4b7c46d2",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 254 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Titlebar = __webpack_require__(5);

var _Titlebar2 = _interopRequireDefault(_Titlebar);

var _Hymn = __webpack_require__(32);

var _Hymn2 = _interopRequireDefault(_Hymn);

var _jquery = __webpack_require__(3);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      isLoading: true,
      passage: '',
      hymns: {},
      text: '',
      error: undefined
    };
  },

  components: {
    Titlebar: _Titlebar2.default, Hymn: _Hymn2.default
  },
  methods: {
    goBack: function goBack() {
      this.$router.back();
    },
    hymnSelected: function hymnSelected(hymn) {
      this.$router.push({ name: 'Hymn', query: { title: hymn.title, author: hymn.author, textLink: hymn['text link'] } });
    }
  },
  mounted: function mounted() {
    this.passage = this.$route.query.passage;
    var self = this;
    _jquery2.default.get('https://hymnary.org/api/scripture?reference=' + this.passage).done(function (data) {
      self.hymns = data;
    }).fail(function (err) {
      self.error = err;
    }).always(function () {
      self.isLoading = false;
    });
  }
};

/***/ }),
/* 256 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Titlebar = __webpack_require__(5);

var _Titlebar2 = _interopRequireDefault(_Titlebar);

var _YoutubePlayer = __webpack_require__(258);

var _YoutubePlayer2 = _interopRequireDefault(_YoutubePlayer);

var _jquery = __webpack_require__(3);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {
      text: '',
      isLoadingText: false,
      isLoadingVideos: false,
      error: undefined,
      videos: undefined,
      videoId: undefined
    };
  },

  computed: {
    title: function title() {
      return this.$route.query.title;
    },
    author: function author() {
      return this.$route.query.author;
    },
    textLink: function textLink() {
      return this.$route.query.textLink;
    }
  },
  components: {
    Titlebar: _Titlebar2.default, YoutubePlayer: _YoutubePlayer2.default
  },
  methods: {
    goBack: function goBack() {
      this.$router.back();
    },
    loadHymn: function loadHymn() {
      this.text = '';
      var textLink = this.textLink.replace('/text/', '/api/fulltext/');
      var self = this;
      this.isLoadingText = true;
      _jquery2.default.get(textLink).done(function (data) {
        if (data.length > 0) {
          for (var entry in data) {
            if (data[entry].text.indexOf('To view this media') !== 0) {
              self.text = data[entry].text.replace(/\r/g, '').replace(/\n\n/g, '\n');
              return;
            }
          }
        }
        self.text = undefined;
      }).always(function () {
        self.isLoadingText = false;
      });
    },
    fetchVideos: function fetchVideos(hymnTitle) {
      var self = this;
      this.isLoadingVideos = true;
      _jquery2.default.get('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + hymnTitle + '&safeSearch=strict&type=video&key=AIzaSyCTgUetspdVufPqikWDBuhR6j9zvPeYdTg').done(function (data) {
        self.videos = data.items.map(function (v) {
          return {
            id: v.id.videoId,
            thumbnail: v.snippet.thumbnails.default.url,
            title: v.snippet.title,
            description: v.snippet.description
          };
        });
      }).fail(function (err) {
        self.vids = err;
      }).always(function () {
        self.isLoadingVideos = false;
      });
    }
  },
  mounted: function mounted() {
    this.loadHymn();
    this.fetchVideos(this.title);
  }
};

/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(259)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(260),
  /* template */
  __webpack_require__(261),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-8da08006",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 259 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  data: function data() {
    return {};
  },

  computed: {
    url: function url() {
      return 'https://www.youtube.com/embed/' + this.videoId + '?rel=0';
    }
  },
  props: ['videoId']
};

/***/ }),
/* 261 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "embed-responsive embed-responsive-16by9"
  }, [(_vm.videoId) ? _c('iframe', {
    staticClass: "embed-responsive-item",
    attrs: {
      "src": _vm.url,
      "frameborder": "0",
      "allowfullscreen": ""
    }
  }) : _vm._e()])
},staticRenderFns: []}

/***/ }),
/* 262 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('titlebar', {
    attrs: {
      "title": 'HYMN',
      "left-items": ['back'],
      "on-back": _vm.goBack
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "container substance",
    class: {
      blur: _vm.videoId
    }
  }, [_c('div', {
    staticClass: "hymn-text"
  }, [_c('div', {
    staticClass: "hymn-header theme-mid shadow-light"
  }, [_c('p', {
    staticClass: "title"
  }, [_vm._v(_vm._s(_vm.title))]), _vm._v(" "), _c('p', {
    staticClass: "author"
  }, [_vm._v(_vm._s(_vm.author))])]), _vm._v(" "), (_vm.isLoadingText) ? _c('div', {
    staticClass: "text-center"
  }, [_c('i', {
    staticClass: "fa fa-circle-o-notch fa-spin fa-2x"
  })]) : _vm._e(), _vm._v(" "), (_vm.text === undefined) ? _c('div', {
    staticClass: "text-center muted"
  }, [_vm._v("\n        no lyrics for this hymn\n      ")]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "text"
  }, [_vm._v("\n        " + _vm._s(_vm.text) + "\n      ")])]), _vm._v(" "), _c('hr'), _vm._v(" "), _c('div', {
    staticClass: "video-results"
  }, _vm._l((_vm.videos), function(video) {
    return _c('div', {
      staticClass: "list-item theme-mid video-result clearfix",
      on: {
        "click": function($event) {
          _vm.videoId = video.id
        }
      }
    }, [_c('img', {
      attrs: {
        "src": video.thumbnail
      }
    }), _vm._v(" "), _c('p', {
      staticClass: "video-title"
    }, [_vm._v(_vm._s(video.title))]), _vm._v(" "), _c('p', {
      staticClass: "video-description muted"
    }, [_vm._v(_vm._s(video.description))]), _vm._v(" "), (!video.description) ? _c('p', {
      staticClass: "muted"
    }, [_vm._v("No description")]) : _vm._e()])
  }))]), _vm._v(" "), (_vm.videoId) ? _c('div', {
    staticClass: "video-embed"
  }, [_c('div', {
    staticClass: "video-close red",
    on: {
      "click": function($event) {
        _vm.videoId = undefined
      }
    }
  }, [_c('i', {
    staticClass: "fa fa-close"
  }), _vm._v(" CLOSE\n    ")]), _vm._v(" "), _c('youtube-player', {
    staticClass: "shadow",
    attrs: {
      "video-id": _vm.videoId
    }
  })], 1) : _vm._e()], 1)
},staticRenderFns: []}

/***/ }),
/* 263 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('titlebar', {
    attrs: {
      "title": 'HYMNS',
      "left-items": ['back'],
      "on-back": _vm.goBack
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "container substance"
  }, [_c('p', {
    staticClass: "inspired-by muted"
  }, [_vm._v("Inspired by " + _vm._s(_vm.passage))]), _vm._v(" "), (_vm.isLoading) ? _c('p', {
    staticClass: "hymns-loading blue"
  }, [_c('i', {
    staticClass: "fa fa-circle-o-notch fa-spin"
  }), _vm._v(" Loading")]) : _vm._e(), _vm._v(" "), (_vm.error) ? _c('div', [_vm._v("\n      Error loading hymns...\n    ")]) : _vm._e(), _vm._v(" "), (_vm.hymns.length === 0) ? _c('p', {
    staticClass: "text-center"
  }, [_vm._v("no hymns found for this passage")]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "hymns"
  }, _vm._l((_vm.hymns), function(hymn) {
    return _c('div', {
      staticClass: "list-item shadow-light theme-mid",
      on: {
        "click": function($event) {
          _vm.hymnSelected(hymn)
        }
      }
    }, [_c('span', {
      staticClass: "badge pull-right"
    }, [_vm._v(_vm._s(hymn["scripture references"]))]), _vm._v(" "), _c('p', {
      staticClass: "title"
    }, [_vm._v(_vm._s(hymn.title))]), _vm._v(" "), _c('p', {
      staticClass: "muted"
    }, [_vm._v(_vm._s(hymn.author))])])
  }))])], 1)
},staticRenderFns: []}

/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(265)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(266),
  /* template */
  __webpack_require__(267),
  /* styles */
  injectStyle,
  /* scopeId */
  "data-v-55efda17",
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ }),
/* 265 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Titlebar = __webpack_require__(5);

var _Titlebar2 = _interopRequireDefault(_Titlebar);

var _Card = __webpack_require__(19);

var _Card2 = _interopRequireDefault(_Card);

var _jquery = __webpack_require__(3);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  data: function data() {
    return {};
  },

  components: { Titlebar: _Titlebar2.default, Card: _Card2.default },
  computed: {},
  methods: {
    setTheme: function setTheme(theme) {
      (0, _jquery2.default)('html').removeClass('light-theme dark-theme');
      (0, _jquery2.default)('html').addClass(theme);
    }
  }
};

/***/ }),
/* 267 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('titlebar', {
    attrs: {
      "title": "SETTINGS",
      "left-items": ['home']
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "container substance"
  }, [_c('card', {
    attrs: {
      "title": "THEME",
      "subtitle": "Choose a theme"
    }
  }, [_c('div', {
    staticClass: "theme-container"
  }, [_c('p', [_vm._v("Light")]), _vm._v(" "), _c('div', {
    staticClass: "theme-light flex-row shadow-long",
    on: {
      "click": function($event) {
        _vm.setTheme('light-theme')
      }
    }
  }, [_c('div', {
    staticClass: "t-back"
  }), _vm._v(" "), _c('div', {
    staticClass: "t-mid"
  }), _vm._v(" "), _c('div', {
    staticClass: "t-hi"
  }), _vm._v(" "), _c('div', {
    staticClass: "t-callout"
  }), _vm._v(" "), _c('div', {
    staticClass: "t-callout-light"
  })]), _vm._v(" "), _c('hr', {
    staticClass: "hi-bottom"
  }), _vm._v(" "), _c('p', [_vm._v("Dark")]), _vm._v(" "), _c('div', {
    staticClass: "theme-dark flex-row shadow-long",
    on: {
      "click": function($event) {
        _vm.setTheme('dark-theme')
      }
    }
  }, [_c('div', {
    staticClass: "t-back"
  }), _vm._v(" "), _c('div', {
    staticClass: "t-mid"
  }), _vm._v(" "), _c('div', {
    staticClass: "t-hi"
  }), _vm._v(" "), _c('div', {
    staticClass: "t-callout"
  }), _vm._v(" "), _c('div', {
    staticClass: "t-callout-light"
  })])])]), _vm._v(" "), _c('a', {
    staticClass: "btn callout-light btn-block",
    attrs: {
      "href": "mailto:help.truewords@gmail.com?subject=Feedback"
    }
  }, [_vm._v("Provide Feedback")])], 1)], 1)
},staticRenderFns: []}

/***/ })
],[33]);
//# sourceMappingURL=app.737e41eec075d97b783a.js.map