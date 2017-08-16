<template>
  <div id="activity-wrapper">
    <titlebar id="activity-titlebar" :title="title.toUpperCase()" :left-items="leftMenuItems" :right-items="rightMenuItems" :on-close="closePressed" :on-help="helpPressed" :on-select="titlebarSelect"></titlebar>
    <menubar></menubar>

    <div v-if="!isReviewing" id="activity" class="blur">
      <component ref="activity" v-if="getCurrentActivity && activityData" :is="currentActivity" :finish="onFinish" :data="activityData"></component>
    </div>

    <div v-if="isReviewing" id="review" class="blur">
      <component v-if="currentReviewer && activityData" :is="currentReviewer" :data="activityData"></component>
    </div>

    <help id="help" v-if="getCurrentActivity" :title="title.toUpperCase()" :close="helpDismiss" :activity-type="getCurrentActivity"></help>
  </div>
</template>

<script>
import $ from 'jquery'
import { mapGetters, mapActions } from 'vuex'
import activities from '../js/activity'
import ActivityDataFactory from '../js/helpers/ActivityDataFactory'
import ActivityAchievement from '../js/models/ActivityAchievement'
import Titlebar from '../components/Titlebar'
import Menubar from '../components/Menubar'
import ActivityComponents from '../components/ActivityComponents'
import Help from '../components/help/Help'

export default {
  data () {
    return {
      leftMenuItems: ['close'],
      rightMenuItems: ['help'],
      activityData: undefined,
      isReviewing: false,
      lastSavedData: undefined,
      autosaveTimer: undefined
    }
  },
  computed: {
    ...mapGetters(['getCurrentActivity', 'getCurrentStudy']),
    title () {
      return activities.manager.subtitleForType(this.getCurrentActivity)
    },
    currentActivity () {
      return this.activityForType(this.getCurrentActivity)
    },
    currentReviewer () {
      return this.reviewerForType(this.getCurrentActivity)
    }
  },
  watch: {
    isReviewing (isReviewing) {
      if (isReviewing) {
        clearInterval(this.autosaveTimer)
        this.rightMenuItems = ['EDIT']
        this.helpDismiss(true)
        this.analytics.trackScreen(this.title + 'Reviewer')
      } else {
        this.rightMenuItems = ['help']
        this.startAutosaving()
        this.$nextTick(() => {
          if (this.$refs.activity.willAppear) {
            this.$refs.activity.willAppear()
          }
          this.analytics.trackScreen(this.title)
        })
      }
    }
  },
  components: {
    Titlebar, Menubar, Help, ...ActivityComponents
  },
  methods: {
    ...mapActions(['saveActivity']),
    startAutosaving () {
      clearInterval(this.autosaveTimer)
      const self = this
      this.autosaveTimer = setInterval(() => {
        if (JSON.stringify(self.activityData) !== self.lastSavedData) {
          var achievement = new ActivityAchievement(self.currentActivity, self.activityData, new Date(), activities.manager.version(self.currentActivity))
          self.saveActivity(achievement)
          .then(d => {
            self.lastSavedData = JSON.stringify(self.activityData)
            this.log('Progress saved')
          })
          .fail(e => this.log('Failed to save progress: ' + e))
        }
      }, 20 * 1000)
    },
    closePressed () {
      this.$router.back()
    },
    helpPressed () {
      $('#help').addClass('visible')
      $('#activity').addClass('blur')
      $('#review').addClass('blur')
    },
    helpDismiss (immediately) {
      $('#help').removeClass('visible')
      if (immediately === undefined || !immediately) {
        $('#help').addClass('not-visible')
      }
      $('#activity').removeClass('blur')
      $('#review').removeClass('blur')
    },
    titlebarSelect (buttonTitle) {
      if (buttonTitle === 'EDIT') {
        this.isReviewing = false
      }
    },
    onFinish (activityType, activityData) {
      var self = this
      var achievement = new ActivityAchievement(activityType, activityData, new Date(), activities.manager.version(activityType))
      this.alert('SAVING...')
      this.saveActivity(achievement)
      .done(function () {
        self.isReviewing = true
        self.dismissAlert()
      })
      .fail(function (resp) {
        console.log(resp)
        self.alert('Failed to save your activity. Check your connection and try again.', 'ok')
        self.analytics.trackEvent('Error', 'saveActivity', resp)
      })
    },
    activityForType (activityType) {
      switch (activityType) {
        case activities.types.PeoplePlacesThings: return 'buckets'
        case activities.types.Actions: return 'actions'
        case activities.types.Adjectives: return 'adjectives'
        case activities.types.Topics: return 'topics'
        case activities.types.Outline: return 'outline'
        case activities.types.Paraphrase: return 'paraphrase'
        case activities.types.Acta: return 'acta'
        case activities.types.Space: return 'space'
        case activities.types.Stewardship: return 'stewardship'
        default: return undefined
      }
    },
    reviewerForType (activityType) {
      switch (activityType) {
        case activities.types.PeoplePlacesThings: return 'buckets-reviewer'
        case activities.types.Actions: return 'actions-reviewer'
        case activities.types.Adjectives: return 'adjectives-reviewer'
        case activities.types.Topics: return 'topics-reviewer'
        case activities.types.Outline: return 'outline-reviewer'
        case activities.types.Paraphrase: return 'paraphrase-reviewer'
        case activities.types.Acta: return 'acta-reviewer'
        case activities.types.Space: return 'space-reviewer'
        case activities.types.Stewardship: return 'stewardship-reviewer'
        default: return undefined
      }
    }
  },
  mounted () {
    var completedActivity = this.getCurrentStudy.findActivity(this.getCurrentActivity)
    if (completedActivity !== undefined) {
      this.activityData = completedActivity.data
      this.isReviewing = true
    } else {
      this.analytics.trackScreen(this.title)
      this.activityData = ActivityDataFactory.createForType(this.getCurrentActivity, this.getCurrentStudy)
      this.isReviewing = false
      this.startAutosaving()
    }
    this.lastSavedData = JSON.stringify(this.activityData)
  },
  beforeDestroy () {
    clearInterval(this.autosaveTimer)
  }
}
</script>

<style lang="less">
@import '../../static/less/colors';
@import '../../static/less/common';

@media screen and (max-height: 380px) {
  #activity-titlebar {
    display: none;
  }
  #activity, #review {
    padding-top: 0px;
  }
}

#activity, #review {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding-top: @titlebar-height;
  &.blur {
    -webkit-filter: blur(5px);
    filter: blur(5px);
  }
}
</style>
