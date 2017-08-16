<template>
  <div class="help visible">
    <div class="help-container">
      <div class="help-box shadow-long">
        <div class="help-title brand-font">{{ title }}: HOW TO <span @click="close()" class="glyphicon glyphicon-remove"></span></div>
        <component :is="helpComponent"></component>
        <button class="btn btn-block btn-help" @click="close()">START</button>
      </div>
    </div>
  </div>
</template>

<script>
import activities from '../../js/activity'
import BucketsHelp from './BucketsHelp'
import ActionsHelp from './ActionsHelp'
import AdjectivesHelp from './AdjectivesHelp'
import TopicsHelp from './TopicsHelp'
import OutlineHelp from './OutlineHelp'
import ParaphraseHelp from './ParaphraseHelp'
import ActaHelp from './ActaHelp'
import SpaceHelp from './SpaceHelp'
import StewardshipHelp from './StewardshipHelp'

export default {
  data () {
    return {
    }
  },
  props: ['title', 'close', 'activityType'],
  components: { ActionsHelp, BucketsHelp, AdjectivesHelp, TopicsHelp, OutlineHelp, ParaphraseHelp, ActaHelp, SpaceHelp, StewardshipHelp },
  computed: {
    helpComponent () {
      switch (this.activityType) {
        case activities.types.PeoplePlacesThings: return 'buckets-help'
        case activities.types.Actions: return 'actions-help'
        case activities.types.Adjectives: return 'adjectives-help'
        case activities.types.Topics: return 'topics-help'
        case activities.types.Outline: return 'outline-help'
        case activities.types.Paraphrase: return 'paraphrase-help'
        case activities.types.Acta: return 'acta-help'
        case activities.types.Space: return 'space-help'
        case activities.types.Stewardship: return 'stewardship-help'
        default: return undefined
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors';
@import '../../../static/less/common';

.help {
  display: table;
  position: absolute;
  top: -100%;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: @help-zindex;
  &.not-visible {
    animation: HIDE 0.5s;
    animation-fill-mode: both;
  }
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
      & > * {
        width: 100%;
      }
      .help-secondary {
        color: @color-help-secondary;
      }
      .help-title {
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
</style>
