<template>
  <titlebar :title="title.toUpperCase()" :left-items="['close']" :right-items="['help']" :on-close="closePressed" :on-help="helpPressed"></titlebar>
  <menubar></menubar>

  <div id="activity">
    <component :is="currentActivity" :finish="onFinish" :data="['PEOPLE', 'PLACES', 'THINGS']"></component>
  </div>

  <div id="review">
    <component v-if="currentReviewer" :is="currentReviewer" :data="reviewerData"></component>
  </div>
</template>

<script>
import $ from 'jquery'
import store from '../../vuex/store'
import { getCurrentActivity } from '../../vuex/getters'
import activities from '../js/activity'
import Titlebar from '../components/Titlebar'
import Menubar from '../components/Menubar'
import Buckets from '../components/activities/Buckets'
import Actions from '../components/activities/Actions'
import BucketsReviewer from '../components/reviewers/BucketsReviewer'

export default {
  data () {
    return {
      title: activities.manager.subtitleForType(this.getCurrentActivity),
      currentActivity: this.activityForType(this.getCurrentActivity),
      currentReviewer: this.reviewerForType(this.getCurrentActivity),
      reviewerData: undefined
    }
  },
  components: {
    Titlebar, Menubar, Actions, Buckets, BucketsReviewer
  },
  methods: {
    closePressed () {
      this.$router.go('activities')
    },
    helpPressed () {
      window.alert('help from the activity')
    },
    onFinish (activityType, activityData) {
      this.currentReviewer = this.reviewerForType(activityType)
      this.reviewerData = activityData
      $('#activity').hide()
      $('#review').show()
    },
    activityForType (activityType) {
      switch (activityType) {
        case activities.types.PeoplePlacesThings: return 'buckets'
        case activities.types.Actions: return 'actions'
        default: return 'buckets'
      }
    },
    reviewerForType (activityType) {
      switch (activityType) {
        case activities.types.PeoplePlacesThings: return 'buckets-reviewer'
        default: return undefined
      }
    }
  },
  store,
  ready () {
    $('#activity,#review').css('padding-top', $('.titlebar').css('height'))
    $('#activity,#review').css('padding-bottom', $('.actionbar').css('height'))
  },
  vuex: {
    getters: {
      getCurrentActivity
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
