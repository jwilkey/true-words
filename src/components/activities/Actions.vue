<template>
  <div class="flex-column vfull">
    <div class="flex-one scrolly">
      <selectable-text ref="selectableText" :delegate="selectionDelegate"></selectable-text>
    </div>

    <div class="flex-zero bottombar">
      <div v-if="this.currentActionIndex !== undefined" class="action-header">
        <a class="delete-action" @click="deleteAction()">DELETE</a>
        <p class="action-title">{{ action.toString() }}</p>
        <a class="close-action" @click="closeAction()">DONE</a>
      </div>

      <div v-if="this.action" class="action-components flex-row">
        <button data-step="actor" @click="setStep($event.target)" class="btn alt" :class="actorButtonClass">Actor</button>
        <button data-step="tense" @click="setStep($event.target)" class="btn alt" :class="tenseButtonClass">Tense</button>
        <button data-step="target" @click="setStep($event.target)" class="btn alt" :class="targetButtonClass">Target</button>
        <button data-step="result" @click="setStep($event.target)" class="btn alt" :class="resultButtonClass">Result</button>
      </div>

      <div class="action-instruction text-center">{{ instructionText }}</div>
      <div class="action-instruction-sublabel text-center">{{ sublabelText }}</div>

      <button v-if="!currentActionIndex && !actionInstruction && !this.data.collection.isEmpty()" class="btn btn-actionable btn-block finished-button" @click="finishedClicked()">FINISHED</button>

      <div class="step-actions">
        <div v-if="currentStep === 'action' && actionInstruction">
          <button class="btn btn-actionable alt btn-block action-add-button" @click="actionSelected()">ADD</button>
        </div>

        <div v-if="currentStep === 'actor' && actor" class="flex-row">
          <p class="flex-one">{{ this.actor.toString() }}</p>
          <a class="clear-step flex-zero" @click="clear('actor')">Clear selection</a>
        </div>

        <div v-if="currentStep === 'tense'" id="tense-selector" class="container-fluid">
          <div class="row">
            <div class="tense-button col-xs-4">
              <button class="btn btn-actionable btn-block" :class="{alt: this.tense !== 'past'}" @click="tenseSelected('past', $event.target)">
                <strong>PAST</strong>
              </button>
            </div>
            <div class="tense-button col-xs-4">
              <button class="btn btn-actionable btn-block" :class="{alt: this.tense !== 'present'}" @click="tenseSelected('present', $event.target)">
                <strong>PRESENT</strong>
              </button>
            </div>
            <div class="tense-button col-xs-4">
              <button class="btn btn-actionable btn-block" :class="{alt: this.tense !== 'future'}" @click="tenseSelected('future', $event.target)">
                <strong>FUTURE</strong>
              </button>
            </div>
          </div>
        </div>

        <div v-if="currentStep === 'target' && target" class="flex-row">
          <p class="flex-one">{{ this.target.toString() }}</p>
          <a class="clear-step flex-zero" @click="clear('target')">Clear selection</a>
        </div>

        <div v-if="currentStep === 'result' && result" class="flex-row">
          <p class="flex-one">{{ this.result.toString() }}</p>
          <a class="clear-step flex-zero" @click="clear('result')">Clear selection</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SelectableText from '../SelectableText'
import { mapGetters } from 'vuex'
import $ from 'jquery'
import { WordSelection, Action } from '../../js/models/ActivityData'
import activities from '../../js/activity'

export default {
  data () {
    return {
      currentActionIndex: undefined,
      currentStep: 'action',
      pastTenseQualifiers: ['would have', 'had been', 'had', 'did', 'was', 'were'],
      presentTenseQualifiers: ['is', 'am', 'do', 'does', 'are'],
      futureTenseQualifiers: ['will have', 'will'],
      pastTenseHint: '',
      presentTenseHint: '',
      futureTenseHint: '',
      actionInstruction: undefined,
      selectionDelegate: {
        onSelect: undefined,
        onMultiSelect: undefined
      }
    }
  },
  props: ['finish', 'data'],
  computed: {
    ...mapGetters({words: 'getCurrentWords'}),
    currentActionEntry () { return this.data.collection.items[this.currentActionIndex] },
    action () { return this.currentActionEntry ? this.currentActionEntry.action : undefined },
    tense () { return this.currentActionEntry ? this.currentActionEntry.tense : undefined },
    actor () { return this.currentActionEntry ? this.currentActionEntry.actor : undefined },
    target () { return this.currentActionEntry ? this.currentActionEntry.target : undefined },
    result () { return this.currentActionEntry ? this.currentActionEntry.result : undefined },
    instructionText () {
      if (this.currentStep === 'action') {
        return this.actionInstruction || 'Select an action'
      } else if (this.currentStep === 'tense') {
        return ''
      } else if (this.currentStep === 'actor' && !this.actor) {
        var tensified = this.tense === 'past' ? 'did'
        : ((this.tense) === 'future' ? 'will do' : 'does')
        return 'Who or what ' + tensified + ' this?'
      } else if (this.currentStep === 'target' && !this.target) {
        var targetTense = this.tense === 'past' ? 'Was this'
        : ((this.tense) === 'future' ? 'will this be' : 'is this')
        return 'Who or what ' + targetTense + ' done to?'
      } else if (this.currentStep === 'result' && !this.result) {
        return 'What is the result or purpose of this action?'
      }
    },
    sublabelText () {
      if (this.currentStep === 'action') {
        return ''
      } else if (this.currentStep === 'tense') {
        return ''
      } else if (this.currentStep === 'actor' && !this.actor) {
        return 'If present, select the actor from the text'
      } else if (this.currentStep === 'target' && !this.target) {
        return 'If present, select the target from the text'
      } else if (this.currentStep === 'result' && !this.result) {
        return 'If present, select the result from the text'
      }
    },
    actorButtonClass () { return this.buttonClasses('actor') },
    tenseButtonClass () { return this.buttonClasses('tense') },
    targetButtonClass () { return this.buttonClasses('target') },
    resultButtonClass () { return this.buttonClasses('result') }
  },
  components: {
    SelectableText
  },
  methods: {
    buttonClasses (step) {
      var classes = step === this.currentStep ? ['current'] : []
      switch (step) {
        case 'actor': this.actor ? classes.push('btn-actionable') : classes.push('btn-raised2')
          break
        case 'tense': this.tense ? classes.push('btn-actionable') : classes.push('btn-raised2')
          break
        case 'target': this.target ? classes.push('btn-actionable') : classes.push('btn-raised2')
          break
        case 'result': this.result ? classes.push('btn-actionable') : classes.push('btn-raised2')
          break
        default:
      }
      return classes
    },
    deleteAction () {
      this.$refs.selectableText.clearFill(this.currentActionEntry.action.words)
      this.data.collection.items.splice(this.currentActionIndex, 1)
      this.closeAction()
    },
    closeAction () {
      this.currentActionIndex = undefined
      this.currentStep = 'action'
      this.$refs.selectableText.clearSelection()
      this.$refs.selectableText.clearHighlight()
    },
    setStep (target) {
      $('.action-components .current').removeClass('current')
      $(target).addClass('current')
      this.$refs.selectableText.clearSelection()
      this.currentStep = target.dataset.step
    },
    updateActionInstruction () {
      if (!this.$refs.selectableText) {
        return undefined
      }
      switch (this.selectedWords().length) {
        case 0: return undefined
        case 1: return 'Complete your selection or press ADD to continue'
        default: return 'Press ADD to continue'
      }
    },
    selectedWords () {
      return this.$refs.selectableText.selectedWords()
    },
    onSelect (word, index, attributes) {
      var words = this.selectedWords()
      if (this.currentStep === 'action') {
        if (attributes.filled) {
          this.findSelectedActionEntry(words[0])
        } else {
          this.actionInstruction = this.updateActionInstruction()
        }
      } else if (this.currentStep === 'actor') {
        this.currentActionEntry.actor = words.length > 0 ? new WordSelection(this.selectedWords()) : undefined
      } else if (this.currentStep === 'target') {
        this.currentActionEntry.target = words.length > 0 ? new WordSelection(this.selectedWords()) : undefined
      } else if (this.currentStep === 'result') {
        this.currentActionEntry.result = words.length > 0 ? new WordSelection(this.selectedWords()) : undefined
      }
    },
    onMultiSelect (words, range) {
      this.onSelect(words.join(' '), range[0])
    },
    findSelectedActionEntry (selectedWord) {
      var self = this
      this.data.collection.items.forEach(function (actionEntry, index) {
        if (actionEntry.action.matches(selectedWord)) {
          self.currentActionIndex = index
          return false
        }
        return true
      })
      this.$refs.selectableText.clearSelection()
    },
    clear (step) {
      switch (step) {
        case 'actor': this.currentActionEntry.actor = undefined
          break
        case 'target': this.currentActionEntry.target = undefined
          break
        case 'result': this.currentActionEntry.result = undefined
          break
        default:
      }
      this.$refs.selectableText.clearSelection()
    },
    actionSelected () {
      var actionEntry = new Action(new WordSelection(this.selectedWords()), this.tense, this.actor, this.target, this.result)

      this.$refs.selectableText.highlightSelection(true)
      this.$refs.selectableText.fillSelection()
      this.currentStep = 'actor'

      this.data.collection.add(actionEntry)
      this.currentActionIndex = this.data.collection.items.indexOf(actionEntry)
      this.actionInstruction = undefined
    },
    tenseSelected (tense) {
      this.currentActionEntry.tense = tense
    },
    setupData () {
      if (this.data && this.$refs.selectableText) {
        var self = this
        this.data.collection.items.forEach(function (actionEntry) {
          self.$refs.selectableText.setFilled(actionEntry.action.words)
        })
      }
    },
    willAppear () {
      this.setupData()
    },
    finishedClicked () {
      this.finish(activities.types.Actions, this.data)
    }
  },
  mounted () {
    this.selectionDelegate.onSelect = this.onSelect
    this.selectionDelegate.onMultiSelect = this.onMultiSelect
    this.setupData()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '../../../static/less/colors.less';
@import '../../../static/less/flex.less';

.action-header {
  display: table;
  .delete-action {
    display: table-cell;
    vertical-align: middle;
    padding-left: 8px;
    padding-right: 8px;
    margin-bottom: 0px;
    border-right: solid 1px @color-back-raised2;
  }
  .close-action {
    display: table-cell;
    vertical-align: middle;
    padding-left: 8px;
    padding-right: 8px;
    margin-bottom: 0px;
    border-left: solid 1px @color-back-raised2;
    &:hover {
      color: @color-actionable;
    }
  }
  .action-title {
    display: table-cell;
    vertical-align: middle;
    width: 100%;
    font-size: 18px;
    font-family: serif;
    text-shadow: 1px 1px 2px @color-deemphasize;
    padding: 8px;
    text-align: center;
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
    &:focus, &:hover {
      background-color: transparent;
      box-shadow: none;
    }
    &.current {
      background-color: @color-back-raised2;
    }
  }
  .cancel-button {
    border-left: solid 1px @color-back-raised2;
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
#tense-selector {
  button strong {
    color: @color-text-accent;
    letter-spacing: 2px;
  }
}
.tense-button {
  padding-left: 5px;
  padding-right: 5px;
}
</style>
