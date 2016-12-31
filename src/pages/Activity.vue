<template>
  <div id="activity-wrapper">
    <titlebar :title="title.toUpperCase()" :left-items="leftMenuItems" :right-items="rightMenuItems" :on-close="closePressed" :on-help="helpPressed" :on-select="titlebarSelect"></titlebar>
    <menubar></menubar>

    <div id="activity" class="blur">
      <component v-if="getCurrentActivity && activityData" :is="currentActivity" :finish="onFinish" :data="activityData"></component>
    </div>

    <div id="review" class="blur">
      <component v-if="currentReviewer && activityData" :is="currentReviewer" :data="activityData"></component>
    </div>

    <div id="help" class="visible">
      <div class="help-container">
        <div class="help-box">
          <div class="help-title">{{ title.toUpperCase() }}: HOW TO <span @click="helpDismiss()" class="glyphicon glyphicon-remove"></span></div>
          <component v-if="getCurrentActivity" :is="currentHelpView"></component>
          <button class="btn btn-block btn-help" @click="helpDismiss()">OK</button>
        </div>
      </div>
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
import Space from '../components/activities/Space'

import BucketsReviewer from '../components/reviewers/BucketsReviewer'
import ActionsReviewer from '../components/reviewers/ActionsReviewer'
import ParaphraseReviewer from '../components/reviewers/ParaphraseReviewer'
import SpaceReviewer from '../components/reviewers/SpaceReviewer'

import ActionsHelp from '../components/help/ActionsHelp'
import BucketsHelp from '../components/help/BucketsHelp'
import ParaphraseHelp from '../components/help/ParaphraseHelp'
import SpaceHelp from '../components/help/SpaceHelp'

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
    currentReviewer: function () { return this.reviewerForType(this.getCurrentActivity) },
    currentHelpView: function () { return this.helpViewForType(this.getCurrentActivity) }
  },
  components: {
    Titlebar, Menubar, Actions, Buckets, Paraphrase, Space, BucketsReviewer, ActionsReviewer, ParaphraseReviewer, SpaceReviewer, ActionsHelp, BucketsHelp, ParaphraseHelp, SpaceHelp
  },
  methods: {
    ...mapActions(['saveActivity']),
    closePressed () {
      this.$router.back()
    },
    helpPressed () {
      $('#help').addClass('visible')
      $('#activity').addClass('blur')
      $('#review').addClass('blur')
    },
    helpDismiss () {
      $('#help').removeClass('visible')
      $('#activity').removeClass('blur')
      $('#review').removeClass('blur')
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
        case activities.types.Space: return 'space'
        default: return undefined
      }
    },
    reviewerForType (activityType) {
      switch (activityType) {
        case activities.types.PeoplePlacesThings: return 'buckets-reviewer'
        case activities.types.Actions: return 'actions-reviewer'
        case activities.types.Paraphrase: return 'paraphrase-reviewer'
        case activities.types.Space: return 'space-reviewer'
        default: return undefined
      }
    },
    helpViewForType (activityType) {
      switch (activityType) {
        case activities.types.PeoplePlacesThings: return 'buckets-help'
        case activities.types.Actions: return 'actions-help'
        case activities.types.Paraphrase: return 'paraphrase-help'
        case activities.types.Space: return 'space-help'
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
@import '../../static/less/common.less';

body {
  padding-top: 55px;
}
#activity {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  &.blur {
    -webkit-filter: blur(5px);
    filter: blur(5px);
  }
}
#review {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: none;
  &.blur {
    -webkit-filter: blur(5px);
    filter: blur(5px);
  }
}
#help {
  display: table;
  animation: HIDE 0.5s;
  animation-fill-mode: both;
  position: absolute;
  top: -100%;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: @help-zindex;
  &.visible {
    top: 0;
    background-color: rgba(0, 0, 0, 0.3);
    animation: SHOW 0.5s;
    animation-fill-mode: both;
  }
  @keyframes SHOW {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes HIDE {
    from { opacity: 1; top: 0; }
    to { opacity: 0; top: -100%; }
  }
  p {
    margin-bottom: 3px;
  }
  hr {
    border-color: @color-help;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .help-container {
    height: 100%;
    display: table-cell;
    vertical-align: middle;
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    padding: 15px;
    padding-top: 25px;
    .help-box {
      max-width: 420px;
      max-height: 100%;
      overflow-y: scroll;
      margin: auto;
      padding: 10px;
      border-radius: 5px;
      background-color: @color-help-back;
      color: @color-help;
      box-shadow: @shadow-long;
      & > * {
        width: 100%;
      }
      .help-secondary {
        color: @color-help-secondary;
      }
      .help-title {
        font-family: serif;
        border-bottom: solid 1px @color-help;
        padding-bottom: 5px;
        margin-bottom: 10px;
        .glyphicon {
          float: right;
          cursor: pointer;
          padding: 1px;
        }
      }
      .help-content {
        width: 100%;
      }
      .btn-help {
        background-color: @color-help;
        border-color: @color-help;
        color: @color-help-back;
        margin-top: 10px;
      }
    }
  }
}
.vthird {
  height: 33.33%;
}
.hthird {
  width: 33.33%;
}
</style>
