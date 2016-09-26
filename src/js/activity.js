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

export default {
  TYPE: {
    PeoplePlacesThings: ActivityType.PeoplePlacesThings,
    Actions: 'ACTIONS',
    CauseEffect: 'CAUSEEFFECT',

    Keywords: 'KEYWORDS',
    TopicTagging: 'TOPICS',
    Christianese: 'CHRISTIANESE',
    Paraphrase: 'PARAPHRASE',

    SPACE: 'SPACE'
  },
  types: {
    'PPT': { id: 'PPT', category: 'observation', title: 'People, Places & Things', subtitle: 'Nouns' },
    'ACTIONS': { id: 'ACTIONS', category: 'observation', title: 'Actions', subtitle: 'Actions' },
    'CAUSEEFFECT': { id: 'CAUSEEFFECT', category: 'observation', title: 'Cause & Effect', subtitle: 'Cause & Effect' },

    'KEYWORDS': { id: 'KEYWORDS', category: 'interpretation', title: 'Key Words', subtitle: 'Key Words' },
    'TOPICS': { id: 'TOPICS', category: 'interpretation', title: 'Topics', subtitle: 'Topics' },
    'CHRISTIANESE': { id: 'CHRISTIANESE', category: 'interpretation', title: 'Christianese', subtitle: 'Christianese' },
    'PARAPHRASE': { id: 'PARAPHRASE', category: 'interpretation', title: 'Paraphrase', subtitle: 'Paraphrase' },

    'SPACE': { id: 'SPACE', category: 'application', title: 'SPACE', subtitle: 'SPACE' }
  },
  observationActivities () {
    return [this.TYPE.PeoplePlacesThings, this.TYPE.Actions, this.TYPE.CauseEffect]
  },
  interpretationActivities () {
    return [this.TYPE.Keywords, this.TYPE.TopicTagging, this.TYPE.Christianese, this.TYPE.Paraphrase]
  },
  applicationActivities () {
    return [this.TYPE.SPACE]
  },
  titleForType (type) {
    return this.types[type].title
  },
  subtitleForType (type) {
    return this.types[type].subtitle
  }
}
