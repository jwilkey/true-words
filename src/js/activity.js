export default {
  TYPE: {
    PeoplePlacesThings: 'PPT',
    Actions: 'ACTIONS',
    CauseEffect: 'CAUSEEFFECT',

    Keywords: 'KEYWORDS',
    TopicTagging: 'TOPICS',
    Christianese: 'CHRISTIANESE',
    Paraphrase: 'PARAPHRASE',

    SPACE: 'SPACE'
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
    var titles = {}
    titles[this.TYPE.PeoplePlacesThings] = 'People, Places & Things'
    titles[this.TYPE.Actions] = 'Actions'
    titles[this.TYPE.CauseEffect] = 'Cause & Effect'

    titles[this.TYPE.Keywords] = 'Key Words'
    titles[this.TYPE.TopicTagging] = 'Topics'
    titles[this.TYPE.Christianese] = 'Christianese'
    titles[this.TYPE.Paraphrase] = 'Paraphrase'

    titles[this.TYPE.SPACE] = 'SPACE'

    return titles[type]
  },
  subtitleForType (type) {
    var subtitles = {}
    subtitles[this.TYPE.PeoplePlacesThings] = 'Nouns'
    subtitles[this.TYPE.Paraphrase] = 'Paraphrase'
    subtitles[this.TYPE.CauseEffect] = 'Cause & Effect'
    subtitles[this.TYPE.SPACE] = 'SPACE'

    return subtitles[type]
  }
}
