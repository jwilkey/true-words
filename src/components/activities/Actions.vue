<template>
  <div class="flex-v">
    <div class="flex-1">
      <selectable-text ref="selectableText" :delegate="selectionDelegate"></selectable-text>

      <br />
      <div class="container action-items">
        <p v-for="action in data.collection.items" v-html="actionText(action)"></p>
      </div>
    </div>

    <div class="actionbar-flex">
      <div class="action-instruction">
        <div class="text-center" v-html="instructionText()"> </div>
        <div v-if="currentStep === 'review'" id="review-instruction" class="text-center">
        </div>
      </div>

      <div v-if="currentStep === 'action'">
        <button class="btn btn-actionable btn-block" :class="{disabled: actionNextButtonDisabled}" @click="actionSelected()">NEXT</button>
      </div>

      <div v-if="currentStep === 'tense'" id="tense-selector" class="container-fluid">
        <div class="row">
          <div class="tense-button col-xs-4">
            <button class="btn btn-actionable btn-block" @click="tenseSelected('past')">
              <strong>PAST</strong><span v-if="pastTenseHint"> - {{ pastTenseHint }} {{ action }}</span>
            </button>
          </div>
          <div class="tense-button col-xs-4">
            <button class="btn btn-actionable btn-block" @click="tenseSelected('present')">
              <strong>PRESENT</strong><span v-if="presentTenseHint"> - {{ presentTenseHint }} {{ action }}</span>
            </button>
          </div>
          <div class="tense-button col-xs-4">
            <button class="btn btn-actionable btn-block" @click="tenseSelected('future')">
              <strong>FUTURE</strong><span v-if="futureTenseHint"> - {{ futureTenseHint }} {{ action }}</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="currentStep === 'actor'">
        <button class="btn btn-actionable btn-block" :class="{alt: actorNextButtonDisabled}" @click="actorSelected()">
          <span v-if="actorNextButtonDisabled">I do not see an <strong>actor</strong></span>
          <span v-else>NEXT</span>
        </button>
      </div>

      <div v-if="currentStep === 'target'" class="text-center">
        <button class="btn btn-actionable btn-block" :class="{alt: targetNextButtonDisabled}" @click="targetSelected()">
          <span v-if="targetNextButtonDisabled">I do not see a <strong>target</strong> of this action</span>
          <span v-else>NEXT</span>
        </button>
      </div>

      <div v-if="currentStep === 'result'" class="text-center">
        <button class="btn btn-actionable btn-block" :class="{alt: resultNextButtonDisabled}" @click="resultSelected()">
          <span v-if="resultNextButtonDisabled">I do not see a <strong>result</strong></span>
          <span v-else>NEXT</span>
        </button>
      </div>

      <div v-if="currentStep === 'review'" id="review-instruction" class="text-center">
        <div class="col-xs-9">
          <button class="btn btn-actionable btn-block" @click="nextClicked()">NEXT</button>
        </div>
        <div class="col-xs-3">
          <button class="btn btn-actionable alt btn-block" @click="finishedClicked()">DONE</button>
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
      actionNextButtonDisabled: true,
      actorNextButtonDisabled: true,
      targetNextButtonDisabled: true,
      resultNextButtonDisabled: true,
      pastTenseQualifiers: ['would have', 'had been', 'had', 'did', 'was', 'were'],
      presentTenseQualifiers: ['is', 'am', 'do', 'does', 'are'],
      futureTenseQualifiers: ['will have', 'will'],
      pastTenseHint: '',
      presentTenseHint: '',
      futureTenseHint: '',
      currentStep: 'action',
      action: undefined,
      tense: undefined,
      actor: undefined,
      target: undefined,
      result: undefined,
      selectionDelegate: {
        onSelect: undefined,
        onMultiSelect: undefined
      }
    }
  },
  props: ['finish', 'data'],
  computed: {
    ...mapGetters({words: 'getCurrentWords'}),
    paddingBottom () {
      return $('.actionbar').height() + 18
    }
  },
  components: {
    SelectableText
  },
  methods: {
    processTense (word, index) {
      var sub = this.words.slice(index - 2, index).join(' ')
      this.pastTenseHint = endsWithAny(sub, this.pastTenseQualifiers)
      this.presentTenseHint = endsWithAny(sub, this.presentTenseQualifiers)
      this.futureTenseHint = endsWithAny(sub, this.futureTenseQualifiers)
    },
    onSelect (word, index) {
      if (this.currentStep === 'action') {
        this.actionNextButtonDisabled = false
      } else if (this.currentStep === 'actor') {
        this.actorNextButtonDisabled = false
      } else if (this.currentStep === 'target') {
        this.targetNextButtonDisabled = false
      } else if (this.currentStep === 'result') {
        this.resultNextButtonDisabled = false
      }
    },
    onMultiSelect (words, range) {
      this.onSelect(words.join(' '), range[0])
    },
    shouldReset () {
      return this.currentStep === 'review'
    },
    actionSelected () {
      this.action = new WordSelection(this.$refs.selectableText.selectedWords())
      this.$refs.selectableText.highlightSelection(true)
      this.$refs.selectableText.fillSelection()
      // this.processTense(this.action, index)
      this.currentStep = 'tense'
    },
    tenseSelected (tense) {
      this.tense = tense
      this.currentStep = 'actor'
    },
    actorSelected () {
      if (!this.actorNextButtonDisabled) {
        this.actor = new WordSelection(this.$refs.selectableText.selectedWords())
        this.$refs.selectableText.highlightSelection()
      }
      this.currentStep = 'target'
    },
    targetSelected () {
      if (!this.targetNextButtonDisabled) {
        this.target = new WordSelection(this.$refs.selectableText.selectedWords())
        this.$refs.selectableText.highlightSelection()
      }
      this.currentStep = 'result'
    },
    resultSelected () {
      if (!this.resultNextButtonDisabled) {
        this.result = new WordSelection(this.$refs.selectableText.selectedWords())
        this.$refs.selectableText.highlightSelection()
      }
      this.data.collection.add(new Action(this.action, this.tense, this.actor, this.target, this.result))
      this.currentStep = 'review'
    },
    instructionText () {
      if (this.currentStep === 'action') {
        return '<span class="instruction-label">ACTION</span>Select an action word'
      } else if (this.currentStep === 'tense') {
        return '<span class="instruction-label">TENSE</span>What is the tense of this word?'
      } else if (this.currentStep === 'actor') {
        var tensified = this.tense === 'past' ? 'did'
        : ((this.tense) === 'present' ? 'does' : 'will do')
        return '<span class="instruction-label">ACTOR</span>Who or what ' + tensified + ' this?'
      } else if (this.currentStep === 'target') {
        var targetTense = this.tense === 'past' ? 'Was this'
        : ((this.tense) === 'present' ? 'Is this' : 'Will this be')
        return '<span class="instruction-label">TARGET</span>' + targetTense + ' done to something or someone? (select)'
      } else if (this.currentStep === 'result') {
        return '<span class="instruction-label">RESULT</span>What is the result / purpose of this action?'
      } else if (this.currentStep === 'review') {
        return this.actionText(this.data.collection.last())
      }
    },
    getCurrentTenseHint () {
      switch (this.tense) {
        case 'past': return this.pastTenseHint || 'was ' + this.action
        case 'present': return this.presentTenseHint || 'is ' + this.action
        case 'future': return this.futureTenseHint || 'will ' + this.action
        default: return this.action
      }
    },
    nextClicked () {
      this.actionNextButtonDisabled = true
      this.actorNextButtonDisabled = true
      this.targetNextButtonDisabled = true
      this.resultNextButtonDisabled = true

      this.$refs.selectableText.clearHighlight()
      this.$refs.selectableText.clearSelection()

      this.action = undefined
      this.actor = undefined
      this.tense = undefined
      this.result = undefined
      this.currentStep = 'action'
    },
    finishedClicked () {
      this.finish(activities.types.Actions, this.data)
    },
    actionText (action) {
      var arrow = ' <span class="glyphicon glyphicon-menu-right flow"></span> '
      return (action.actor || '?') + arrow + (action.action || '?') + arrow + (action.target || '?') + arrow + (action.result || '?')
    }
  },
  mounted () {
    this.selectionDelegate.onSelect = this.onSelect
    this.selectionDelegate.onMultiSelect = this.onMultiSelect
  }
}

function endsWithAny (text, suffixes) {
  for (var i in suffixes) {
    if (text.endsWith(suffixes[i])) {
      return suffixes[i]
    }
  }
  return undefined
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '../../../static/less/colors.less';
.action-instruction {
  font-size: 19px;
  margin-bottom: 10px;
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
