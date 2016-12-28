<template>
  <div>
    <titlebar :title="title.toUpperCase()" :left-items="leftMenuItems" :right-items="rightMenuItems" :on-close="closePressed" :on-help="helpPressed" :on-select="titlebarSelect"></titlebar>
    <menubar></menubar>

    <div id="activity">
      <component v-if="getCurrentActivity && activityData" :is="currentActivity" :finish="onFinish" :data="activityData"></component>
    </div>

    <div id="review">
      <component v-if="currentReviewer && activityData" :is="currentReviewer" :data="activityData"></component>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import store from '../../vuex/store'
import { mapGetters, mapActions } from 'vuex'
import activities from '../js/activity'
import ActivityDataFactory from '../js/helpers/ActivityDataFactory'
import ActivityAchievement from '../js/models/ActivityAchievement'
import Titlebar from '../components/Titlebar'
import Menubar from '../components/Menubar'
import Buckets from '../components/activities/Buckets'
import Actions from '../components/activities/Actions'
import Paraphrase from '../components/activities/Paraphrase'
import BucketsReviewer from '../components/reviewers/BucketsReviewer'
import ActionsReviewer from '../components/reviewers/ActionsReviewer'
import ParaphraseReviewer from '../components/reviewers/ParaphraseReviewer'

export default {
  data () {
    return {
      leftMenuItems: ['close'],
      rightMenuItems: ['help'],
      activityData: undefined
    }
  },
  computed: {
    ...mapGetters(['getCurrentActivity', 'getCurrentStudy']),
    title: function () {
      return activities.manager.subtitleForType(this.getCurrentActivity)
    },
    currentActivity: function () { return this.activityForType(this.getCurrentActivity) },
    currentReviewer: function () { return this.reviewerForType(this.getCurrentActivity) }
  },
  components: {
    Titlebar, Menubar, Actions, Buckets, Paraphrase, BucketsReviewer, ActionsReviewer, ParaphraseReviewer
  },
  methods: {
    ...mapActions(['saveActivity']),
    closePressed () {
      this.$router.back()
    },
    helpPressed () {
      window.alert('help not available at this time')
    },
    titlebarSelect (buttonTitle) {
      if (buttonTitle === 'RETRY') {
        this.activityData = ActivityDataFactory.createForType(this.getCurrentActivity)
        $('#activity').show()
        $('#review').hide()
        this.rightMenuItems = ['help']
      }
    },
    onFinish (activityType, activityData) {
      var self = this
      var achievement = new ActivityAchievement(activityType, activityData, new Date(), activities.manager.version(activityType))
      this.saveActivity(achievement)
      .done(function () {
        self.currentReviewer = self.reviewerForType(activityType)
        $('#activity').hide()
        $('#review').show()
        this.rightMenuItems = ['RETRY']
      })
      .fail(function () {
        window.alert('Failed to save your activity. Check your connection and try again.')
      })
    },
    activityForType (activityType) {
      switch (activityType) {
        case activities.types.PeoplePlacesThings: return 'buckets'
        case activities.types.Actions: return 'actions'
        case activities.types.Paraphrase: return 'paraphrase'
        default: return undefined
      }
    },
    reviewerForType (activityType) {
      switch (activityType) {
        case activities.types.PeoplePlacesThings: return 'buckets-reviewer'
        case activities.types.Actions: return 'actions-reviewer'
        case activities.types.Paraphrase: return 'paraphrase-reviewer'
        default: return undefined
      }
    }
  },
  store,
  mounted () {
    $('#activity, #review').css('padding-top', parseInt($('.titlebar').css('height')) + 5 + 'px')
    var completedActivity = this.getCurrentStudy.findActivity(this.getCurrentActivity)
    if (completedActivity !== undefined) {
      this.activityData = completedActivity.data
      $('#activity').hide()
      $('#review').show()
      this.rightMenuItems = ['RETRY']
    } else {
      this.activityData = ActivityDataFactory.createForType(this.getCurrentActivity)
      this.rightMenuItems = ['help']
    }
  }
}
</script>

<style lang="less">
@import '../../static/less/colors.less';
body {
  padding-top: 55px;
}
#activity {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
#review {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: none;
}
.vthird {
  height: 33.33%;
}
.hthird {
  width: 33.33%;
}
</style>
