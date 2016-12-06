function ActivityAchievement (type, data, creationDate, version) {
  this.type = type
  this.data = data
  this.creationDate = creationDate
  this.version = version
}

export default {
  new: ActivityAchievement,
  fromJson (json) {
    return new ActivityAchievement(json.type, json.data, new Date(json.creationDate), json.version)
  }
}
