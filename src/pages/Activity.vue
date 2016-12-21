<template>
  <div>
    <titlebar :title="title.toUpperCase()" :left-items="['close']" :right-items="['help']" :on-close="closePressed" :on-help="helpPressed"></titlebar>
    <menubar></menubar>

    <div id="activity">
      <component v-if="getCurrentActivity" :is="currentActivity" :finish="onFinish" :data="activityData"></component>
    </div>

    <div id="review">
      <component v-if="currentReviewer" :is="currentReviewer" :data="reviewerData"></component>
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
import BucketsReviewer from '../components/reviewers/BucketsReviewer'
import ActionsReviewer from '../components/reviewers/ActionsReviewer'

export default {
  data () {
    return {
      reviewerData: undefined
    }
  },
  computed: {
    ...mapGetters(['getCurrentActivity', 'getCurrentStudy']),
    title: function () {
      return activities.manager.subtitleForType(this.getCurrentActivity)
    },
    activityData: function () {
      return ActivityDataFactory.createForType(this.getCurrentActivity)
    },
    currentActivity: function () { return this.activityForType(this.getCurrentActivity) },
    currentReviewer: function () { return this.reviewerForType(this.getCurrentActivity) }
  },
  components: {
    Titlebar, Menubar, Actions, Buckets, BucketsReviewer, ActionsReviewer
  },
  methods: {
    ...mapActions(['saveActivity']),
    closePressed () {
      this.$router.back()
    },
    helpPressed () {
      window.alert('help from the activity')
    },
    onFinish (activityType, activityData) {
      var self = this
      var achievement = new ActivityAchievement(activityType, activityData, new Date(), activities.manager.version(activityType))
      this.saveActivity(achievement)
      .done(function () {
        self.currentReviewer = self.reviewerForType(activityType)
        self.reviewerData = activityData
        $('#activity').hide()
        $('#review').show()
      })
      .fail(function () {
        window.alert('Failed to save your activity. Check your connection and try again.')
      })
    },
    activityForType (activityType) {
      switch (activityType) {
        case activities.types.PeoplePlacesThings: return 'buckets'
        case activities.types.Actions: return 'actions'
        default: return undefined
      }
    },
    reviewerForType (activityType) {
      switch (activityType) {
        case activities.types.PeoplePlacesThings: return 'buckets-reviewer'
        case activities.types.Actions: return 'actions-reviewer'
        default: return undefined
      }
    }
  },
  store,
  mounted () {
    $('#activity, #review').css('padding-top', parseInt($('.titlebar').css('height')) + 5 + 'px')
    var completedActivity = this.getCurrentStudy.findActivity(this.getCurrentActivity)
    if (completedActivity !== undefined) {
      this.reviewerData = completedActivity.data
      $('#activity').hide()
      $('#review').show()
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
