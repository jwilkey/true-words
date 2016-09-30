var ActivityType = {
  PeoplePlacesThings: 'PPT',
  Actions: 'ACTIONS',
  CauseEffect: 'CAUSEEFFECT',

  Keywords: 'KEYWORDS',
  TopicTagging: 'TOPICS',
  Christianese: 'CHRISTIANESE',
  Paraphrase: 'PARAPHRASE',

  SPACE: 'SPACE'
}

function Activity (id, category, title, subtitle, enabled) {
  this.id = id
  this.category = category
  this.title = title
  this.subtitle = subtitle
  this.enabled = enabled
}

function ActivityManager () {
  this.observationActivities = [ActivityType.PeoplePlacesThings, ActivityType.Actions, ActivityType.CauseEffect]
  this.interpretationActivities = [ActivityType.Keywords, ActivityType.TopicTagging, ActivityType.Christianese, ActivityType.Paraphrase]
  this.applicationActivities = [ActivityType.SPACE]
  this.activities = [
    new Activity('PPT', 'observation', 'People, Places & Things', 'Nouns', true),
    new Activity('ACTIONS', 'observation', 'Actions', 'Actions', true),
    new Activity('CAUSEEFFECT', 'observation', 'Cause & Effect', 'Cause & Effect', false),

    new Activity('KEYWORDS', 'interpretation', 'Key Words', 'Key Words', false),
    new Activity('TOPICS', 'interpretation', 'Topics', 'Topics', false),
    new Activity('CHRISTIANESE', 'interpretation', 'Christianese', 'Christianese', false),
    new Activity('PARAPHRASE', 'interpretation', 'Paraphrase', 'Paraphrase', false),

    new Activity('SPACE', 'application', 'SPACE', 'SPACE', false)
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
  return this.find(type).subtitle
}

export default {
  manager: new ActivityManager(),
  types: ActivityType
}
