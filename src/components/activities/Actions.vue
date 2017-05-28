<template>
  <div class="flex-column vfull">
    <div class="flex-one scrolly actions-content">
      <selectable-text ref="selectableText" :delegate="selectionDelegate"></selectable-text>
    </div>

    <div class="flex-zero bottombar">
      <p v-if="isMode('start')" class="instruction">Select an action</p>

      <button v-if="isMode('selecting') && !isMode('detailing')" @click="helpSelectingPressed" class="btn btn-primary"><i class="fa fa-question-circle-o"></i> How to select...</button>

      <button v-if="isMode('selected')" @click="beginDetailing" class="btn btn-actionable btn-block">NEXT</button>

      <div v-if="isMode('detailing')" class="actions-detail">

        <div v-if="this.currentActionIndex !== undefined" class="action-header">
          <p class="action-title">{{ action.toString() }}</p>
          <a class="delete-action" @click="deleteAction()">DELETE</a>
        </div>

        <div v-if="this.action" class="action-components flex-row">
          <button @click="currentStep = 'actor'" class="btn btn-raised2 alt" :class="buttonClasses('actor')"><i class="fa fa-check-circle-o" />Actor</button>
          <button @click="currentStep = 'tense'" class="btn btn-raised2 alt" :class="buttonClasses('tense')"><i class="fa fa-check-circle-o" />Tense</button>
          <button @click="currentStep = 'target'" class="btn btn-raised2 alt" :class="buttonClasses('target')"><i class="fa fa-check-circle-o" />Target</button>
          <button @click="currentStep = 'result'" class="btn btn-raised2 alt" :class="buttonClasses('result')"><i class="fa fa-check-circle-o" />Result</button>
        </div>

        <div class="action-instruction text-center">{{ instructionText }}</div>
        <div class="action-instruction-sublabel text-center">{{ sublabelText }}</div>

        <div class="step-actions">
          <div v-if="isCompletedSelectableStep" class="flex-row step-selection">
            <p class="flex-one">{{ stepValue }}</p>
            <a class="clear-step flex-zero" @click="clear(currentStep)">Clear selection</a>
          </div>

          <div v-if="currentStep === 'tense'" id="tense-selector" class="flex-row">
            <button class="btn btn-actionable" :class="{alt: this.tense !== 'past'}" @click="tenseSelected('past')">PAST</button>
            <button class="btn btn-actionable" :class="{alt: this.tense !== 'present'}" @click="tenseSelected('present')">PRESENT</button>
            <button class="btn btn-actionable" :class="{alt: this.tense !== 'future'}" @click="tenseSelected('future')">FUTURE</button>
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
      return this[this.currentStep].toString()
    },
    instructionText () {
      if (this.currentStep === 'actor' && !this.actor) {
        var tensified = this.tense === 'past' ? 'did'
        : ((this.tense) === 'future' ? 'will do' : 'does')
        return 'Who or what ' + tensified + ' this?'
      } else if (this.currentStep === 'target' && !this.target) {
        var targetTense = this.tense === 'past' ? 'Was this'
        : ((this.tense) === 'future' ? 'will this be' : 'is this')
        return 'Who or what ' + targetTense + ' done to?'
      } else if (this.currentStep === 'result' && !this.result) {
        return 'What is the result or purpose of this action?'
      } else if (this.currentStep === undefined) {
        if (this.currentActionIndex !== undefined && (this.actor || this.tense || this.target || this.result)) {
          return 'Edit the actor, tense, target or result'
        }
        return 'Optionally, find the actor, tense, target or result'
      }
      return ''
    },
    sublabelText () {
      if (this.currentStep === 'actor' && !this.actor) {
        return 'If present, select the actor from the text'
      } else if (this.currentStep === 'target' && !this.target) {
        return 'If present, select the target from the text'
      } else if (this.currentStep === 'result' && !this.result) {
        return 'If present, select the result from the text'
      } else if (this.currentStep === undefined) {
        return 'Press one of the above buttons'
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
      .and(step === this.currentStep, 'current')
      .toArray()
    },
    deleteAction () {
      this.$refs.selectableText.clearFill(this.currentAction.action.words)
      this.data.collection.items.splice(this.currentActionIndex, 1)
      this.currentActionIndex = 0
      this.currentStep = 'action'
      if (this.actions.length === 0) { this.finishedSelecting = false }
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
      this.$refs.selectableText.clearHighlight()
      this.$refs.selectableText.highlightWords(words)
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
  .delete-action {
    color: @color-highlight-red;
    display: table-cell;
    vertical-align: middle;
    padding-left: 8px;
    padding-right: 8px;
    margin-bottom: 0px;
    border-left: solid 1px @color-back-raised2;
    text-shadow: 1px 0px 3px @color-callout-light;
  }
  .action-title {
    display: table-cell;
    vertical-align: middle;
    width: 100%;
    font-size: 18px;
    font-family: 'Sinkin';
    padding: 8px;
    margin-bottom: 0px;
  }
}
.action-instruction {
  font-size: 19px;
  .flow {
    color: @color-highlight-orange;
    top: 4px;
  }
}
.instruction-label {
  color: @color-actionable;
  border-right: solid 1px @color-actionable;
  padding-right: 10px;
  margin-right: 10px;
}
.action-instruction-sublabel {
  text-align: center;
  color: @color-deemphasize;
  font-size: 14px;
  margin: 0px;
}
.step-actions {
  padding-bottom: 8px;
  p {
    margin-bottom: 0;
  }
  .clear-step {
    color: @color-callout-light;
    text-decoration: underline;
    white-space: nowrap;
  }
}
.action-components {
  border-bottom: solid 1px @color-back-raised2;
  border-top: solid 1px @color-back-raised2;
  padding-top: 8px;
  padding-bottom: 8px;
  margin-bottom: 8px;
  .btn {
    flex: 1;
    margin-left: 2px;
    margin-right: 2px;
    i {
      margin-right: 2px;
      color: @color-highlight-green;
      display: none;
    }
    &:focus, &:hover {
      background-color: transparent;
      box-shadow: none;
    }
    &.completed {
      i {
        display: inline;
      }
    }
    &.current {
      background-color: @color-back-raised;
      border-color: @color-highlight-blue;
    }
  }
  .cancel-button {
    border-left: solid 1px @color-back-raised;
    padding-top: 2px;
    padding-right: 4px;
    padding-left: 8px;
    margin-left: 8px;
    img {
      width: 30px;
      height: 30px;
    }
  }
}
.action-add-button {
  margin-top: 8px;
}
.finished-button {
  margin-top: 8px;
}

.action-items {
  color: @color-deemphasize;
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
