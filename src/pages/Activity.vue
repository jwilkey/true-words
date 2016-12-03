<template>
  <div>
    <titlebar :title="title.toUpperCase()" :left-items="['close']" :right-items="['help']" :on-close="closePressed" :on-help="helpPressed"></titlebar>
    <menubar></menubar>

    <div id="activity">
      <component :is="currentActivity" :finish="onFinish" :data="['PEOPLE', 'PLACES', 'THINGS']"></component>
    </div>

    <div id="review">
      <component v-if="currentReviewer" :is="currentReviewer" :data="reviewerData"></component>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import store from '../../vuex/store'
import { mapGetters } from 'vuex'
import activities from '../js/activity'
import Titlebar from '../components/Titlebar'
import Menubar from '../components/Menubar'
import Buckets from '../components/activities/Buckets'
import Actions from '../components/activities/Actions'
import BucketsReviewer from '../components/reviewers/BucketsReviewer'

export default {
  data () {
    return {
      reviewerData: undefined
    }
  },
  computed: {
    ...mapGetters(['getCurrentActivity']),
    title: function () {
      return activities.manager.subtitleForType(this.getCurrentActivity)
    },
    currentActivity: function () { return this.activityForType(this.getCurrentActivity) },
    currentReviewer: function () {
      return this.reviewerForType(this.getCurrentActivity)
    }
  },
  components: {
    Titlebar, Menubar, Actions, Buckets, BucketsReviewer
  },
  methods: {
    closePressed () {
      this.$router.back()
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
  mounted () {
    $('#activity, #review').css('padding-top', $('.titlebar').css('height'))
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
