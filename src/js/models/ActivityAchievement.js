import ActivityData from './ActivityData'

function ActivityAchievement (type, data, creationDate, version) {
  if (type === 'json') {
    this.type = data.type
    this.data = ActivityData.fromJson(data.data)
    this.creationDate = new Date(data.creationDate)
    this.version = data.version
  } else {
    this.type = type
    this.data = data
    this.creationDate = creationDate
    this.version = version
  }
}

export default ActivityAchievement
