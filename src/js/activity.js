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
}

function Activity (id, category, title, subtitle, enabled) {
  this.id = id
  this.category = category
  this.title = title
  this.subtitle = subtitle
  this.enabled = enabled
}

function ActivityManager () {
  this.observationActivities = [ActivityType.PeoplePlacesThings, ActivityType.Actions, ActivityType.Adjectives] // , ActivityType.CauseEffect
  this.interpretationActivities = [ActivityType.Topics, ActivityType.Outline, ActivityType.Paraphrase] // [ActivityType.Keywords, ActivityType.Idioms]
  this.applicationActivities = [ActivityType.Space, ActivityType.Stewardship]
  this.activities = [
    new Activity('PPT', 'observation', 'People, Places, Things', 'People-Places-Things', true),
    new Activity('ACTIONS', 'observation', 'Actions', 'Actions', true),
    new Activity('ADJECTIVES', 'observation', 'Adjectives', 'Adjectives', true),
    new Activity('CAUSEEFFECT', 'observation', 'Cause & Effect', 'Cause & Effect', false),

    new Activity('KEYWORDS', 'interpretation', 'Key Words', 'Key Words', false),
    new Activity('TOPICS', 'interpretation', 'Topics', 'Topics', true),
    new Activity('IDIOMS', 'interpretation', 'Idioms', 'Words not used in everyday talk', false),
    new Activity('OUTLINE', 'interpretation', 'Outline', 'Outline', true),
    new Activity('PARAPHRASE', 'interpretation', 'Paraphrase', 'Paraphrase', true),

    new Activity('SPACE', 'application', 'SPACE', 'SPACE', true),
    new Activity('STEWARDSHIP', 'application', 'Stewardship', 'Stewardship', true)
  ]
}

ActivityManager.prototype.find = function (id) {
  var filteredActivities = this.activities.filter(function (activity) {
    return activity.id === id
  })
  return filteredActivities.length > 0 ? filteredActivities[0] : null
}

ActivityManager.prototype.titleForType = function (type) {
  return this.find(type).title
}
ActivityManager.prototype.subtitleForType = function (type) {
  var activity = this.find(type)
  return activity ? activity.subtitle : null
}

ActivityManager.prototype.version = function (type) {
  return '0.5'
}

export default {
  manager: new ActivityManager(),
  types: ActivityType
}
