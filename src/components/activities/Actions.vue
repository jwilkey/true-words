<template>
  <div class="flex-column vfull">
    <div class="flex-one scrolly actions-content">
      <selectable-text ref="selectableText" :delegate="selectionDelegate"></selectable-text>
    </div>

    <div class="flex-zero bottombar">
      <p v-if="isMode('start')" class="instruction">Select an action</p>

      <div class="text-center">
        <button v-if="isMode('selecting') && !isMode('detailing')" @click="helpSelectingPressed" class="btn callout-light"><i class="fa fa-question-circle-o"></i> How to select...</button>
      </div>

      <button v-if="isMode('selected')" @click="beginDetailing" class="btn callout-light btn-block">NEXT</button>

      <div v-if="isMode('detailing')" class="actions-detail">

        <div v-if="this.currentActionIndex !== undefined" class="action-header">
          <i class="delete-action red hi-right fa fa-trash-o" @click="deleteAction()"></i>
          <p class="action-title hi-right">{{ action.toString() }}</p>
          <p class="step-value">{{ stepValue }}</p>
        </div>

        <div v-if="this.action" class="action-components hi-top hi-bottom flex-row">
          <button @click="currentStep = 'actor'" class="btn theme-hi hover" :class="buttonClasses('actor')">Actor</button>
          <button @click="currentStep = 'tense'" class="btn theme-hi hover" :class="buttonClasses('tense')">Tense</button>
          <button @click="currentStep = 'target'" class="btn theme-hi hover" :class="buttonClasses('target')">Target</button>
          <button @click="currentStep = 'result'" class="btn theme-hi hover" :class="buttonClasses('result')">Result</button>
        </div>

        <div class="action-instruction text-center">{{ instructionText }}</div>

        <div class="step-actions">
          <div v-if="currentStep === 'tense'" id="tense-selector" class="flex-row">
            <button class="btn callout-light" :class="{alt: this.tense !== 'past'}" @click="tenseSelected('past')">PAST</button>
            <button class="btn callout-light" :class="{alt: this.tense !== 'present'}" @click="tenseSelected('present')">PRESENT</button>
            <button class="btn callout-light" :class="{alt: this.tense !== 'future'}" @click="tenseSelected('future')">FUTURE</button>
          </div>
        </div>

        <selector-bar :next="nextAction" :previous="previousAction" click-title="DONE" :click="finishedPressed"></selector-bar>
      </div>
    </div>
  </div>
</template>

<script>
import SelectableText from '../SelectableText'
import SelectorBar from '../common/SelectorBar'
import { mapGetters } from 'vuex'
import { Action } from '../../js/models/ActivityData'
import activities from '../../js/activity'
import { ConditionalArray } from '../../js/polyfill'

export default {
  data () {
    return {
      currentActionIndex: 0,
      currentStep: 'action',
      isSelecting: false,
      finishedSelecting: false,
      selectionDelegate: {
        onFocus: undefined,
        onChange: undefined
      }
    }
  },
  props: ['finish', 'data'],
  computed: {
    ...mapGetters({words: 'getCurrentWords'}),
    actions () { return this.data.collection.items },
    currentAction () { return this.actions[this.currentActionIndex] },
    action () { return this.currentAction ? this.currentAction.action : undefined },
    tense () { return this.currentAction ? this.currentAction.tense : undefined },
    actor () { return this.currentAction ? this.currentAction.actor : undefined },
    target () { return this.currentAction ? this.currentAction.target : undefined },
    result () { return this.currentAction ? this.currentAction.result : undefined },
    isCompletedSelectableStep () {
      const selectableSteps = ['actor', 'target', 'result']
      return selectableSteps.includes(this.currentStep) && this[this.currentStep] !== undefined
    },
    stepValue () {
      return this[this.currentStep] ? this[this.currentStep].toString() : ''
    },
    instructionText () {
      if (this.currentStep === 'actor' && !this.actor) {
        var tensified = this.tense === 'past' ? 'did'
        : ((this.tense) === 'future' ? 'will do' : 'does')
        return 'Select who or what ' + tensified + ' this?'
      } else if (this.currentStep === 'target' && !this.target) {
        var targetTense = this.tense === 'past' ? 'this was'
        : ((this.tense) === 'future' ? 'will this be' : 'is this')
        return 'Select who or what ' + targetTense + ' done to?'
      } else if (this.currentStep === 'result' && !this.result) {
        return 'Select the result or purpose of this action?'
      } else if (this.currentStep === undefined) {
        if (this.currentActionIndex !== undefined && (this.actor || this.tense || this.target || this.result)) {
          return 'Edit the actor, tense, target or result'
        }
        return 'Optionally, find the actor, tense, target or result'
      }
      return ''
    }
  },
  watch: {
    currentActionIndex: function (newValue, oldVal) {
      if (this.$refs.selectableText) {
        this.highlighCurrentAction()
      }
      this.currentStep = 'actor'
    }
  },
  components: {
    SelectableText, SelectorBar
  },
  methods: {
    isMode (mode) {
      switch (mode) {
        case 'detailing': return this.finishedSelecting
        case 'selecting': return this.isSelecting
        case 'start': return !this.isSelecting && this.actions.length === 0
        case 'selected': return !this.isSelecting && !this.finishedSelecting && this.actions.length > 0
        default: return false
      }
    },
    buttonClasses (step) {
      return new ConditionalArray(this[step] !== undefined, 'completed')
      .and(step !== this.currentStep, 'alt')
      .toArray()
    },
    deleteAction () {
      this.setAlertCallback(this.confirmDeleteAction)
      this.alert(`Are you sure you want to delete this Action, "${this.currentAction.action.toString()}", and all of its values (actor, target, etc.)?`, 'confirm')
    },
    confirmDeleteAction (response) {
      if (response === 'yes') {
        this.$refs.selectableText.clearFill(this.currentAction.action.words)
        this.data.collection.items.splice(this.currentActionIndex, 1)
        this.currentActionIndex = 0
        this.currentStep = 'action'
        if (this.actions.length === 0) { this.finishedSelecting = false }
        this.highlighCurrentAction()
      }
      this.dismissAlert()
    },
    onSelectionFocus (isFocused) {
      this.isSelecting = isFocused
    },
    onSelectionChange (wordSelection, operation) {
      if (this.isMode('detailing')) {
        this.$refs.selectableText.clearFill(wordSelection.words)
        switch (this.currentStep) {
          case 'actor': this.currentAction.actor = wordSelection
            break
          case 'target': this.currentAction.target = wordSelection
            break
          case 'result': this.currentAction.result = wordSelection
            break
          default: return
        }
        this.highlighCurrentAction()
      } else if (operation === 'SELECT') {
        this.data.collection.add(new Action(wordSelection))
      } else if (operation === 'DESELECT') {
        this.actions.every((action, i) => {
          if (action.action.equals(wordSelection)) {
            this.data.collection.items.splice(i, 1)
            return false
          }
          return true
        })
      }
    },
    clear (step) {
      switch (step) {
        case 'actor': this.currentAction.actor = undefined
          break
        case 'target': this.currentAction.target = undefined
          break
        case 'result': this.currentAction.result = undefined
          break
        default:
      }
      this.$refs.selectableText.clearSelection()
    },
    tenseSelected (tense) {
      this.currentAction.tense = tense
    },
    helpSelectingPressed () {
      this.alert('Swipe right to extend the end of your selection\nSwipe left to decrease the end of your selection.\nSwipe up to extend the beginning of your selection\nSwipe down to decrease the beginning. \nTap once to finish selecting. \nTap twice to remove selection.', 'ok')
    },
    beginDetailing () {
      this.currentStep = 'actor'
      this.finishedSelecting = true
      this.highlighCurrentAction()
    },
    highlighCurrentAction () {
      var words = []
      if (this.action) { words = words.concat(this.action.words) }
      if (this.actor) { words = words.concat(this.actor.words) }
      if (this.target) { words = words.concat(this.target.words) }
      if (this.result) { words = words.concat(this.result.words) }
      this.$refs.selectableText.muteSelectedWords()
      this.$refs.selectableText.clearHighlight()
      this.$refs.selectableText.highlightWords(words)
      this.$refs.selectableText.unmuteWords(this.action.words)
      this.$refs.selectableText.scrollTo(this.currentAction.action.words)
    },
    nextAction () {
      if (this.currentActionIndex === this.actions.length - 1) {
        this.currentActionIndex = 0
      } else {
        this.currentActionIndex += 1
      }
    },
    previousAction () {
      if (this.currentActionIndex === 0) {
        this.currentActionIndex = this.actions.length - 1
      } else {
        this.currentActionIndex -= 1
      }
    },
    setupData () {
      if (this.data && this.$refs.selectableText) {
        var self = this
        this.data.collection.items.forEach(function (actionEntry) {
          self.$refs.selectableText.setSelected(actionEntry.action.words)
        })
      }
    },
    willAppear () {
      this.setupData()
    },
    finishedPressed () {
      this.finish(activities.types.Actions, this.data)
    }
  },
  mounted () {
    this.selectionDelegate.onChange = this.onSelectionChange
    this.selectionDelegate.onFocus = this.onSelectionFocus
    this.setupData()
  }
}
</script>

<style lang="less">
@import '../../../static/less/colors.less';
@import '../../../static/less/flex.less';

.actions-content {
  padding-bottom: 30px;
}
.action-header {
  display: table;
  width: 100%;
  .delete-action {
    display: table-cell;
    vertical-align: middle;
    width: 40px;
    padding: 0 12px;
    margin-bottom: 0px;
    font-size: 20px;
    cursor: pointer;
  }
  .action-title {
    display: table-cell;
    vertical-align: middle;
    font-size: 18px;
    font-family: 'Sinkin';
    padding: 8px;
    margin-bottom: 0px;
    white-space: nowrap;
  }
  .step-value {
    width: 100%;
    display: table-cell;
    vertical-align: middle;
    padding: 8px;
    font-size: 18px;
    min-width: 30px;
    text-align: right;
  }
}
.action-instruction {
  font-size: 19px;
  .flow {
    color: @color-highlight-orange;
    top: 4px;
  }
}
.step-actions {
  padding-bottom: 8px;
  p {
    margin-bottom: 0;
  }
}
.btn.theme-hi.current {
  background-color: #999;
}
.action-components {
  padding-top: 8px;
  padding-bottom: 8px;
  margin-bottom: 8px;
  width: 100%;
  overflow: hidden;
  .btn {
    flex: 1;
    margin-left: 2px;
    margin-right: 2px;
    &:focus, &:hover {
      box-shadow: none;
    }
    &.completed {
      border-bottom-color: @color-highlight-green !important;
      border-bottom-width: 2px;
    }
  }
}
.action-add-button {
  margin-top: 8px;
}
.finished-button {
  margin-top: 8px;
}

.step-selection {
  padding: 10px;
  p {
    font-size: 18px;
  }
}
#tense-selector {
  padding-bottom: 11px;
  button {
    .flex-one;
    letter-spacing: 2px;
    margin: 0 5px;
  }
}
</style>
