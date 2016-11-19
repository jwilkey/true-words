<template>
  <div>
    <selectable-text ref="selectableText" :delegate="selectionDelegate"></selectable-text>

    <br />
    <div class="container action-items">
      <p v-for="action in actions" v-html="actionText(action)"></p>
    </div>

    <div class="actionbar">
      <div class="action-instruction">
        <div class="text-center" v-html="instructionText()"> </div>
        <div v-if="currentStep === 'review'" id="review-instruction" class="text-center">
        </div>
      </div>

      <div v-if="currentStep === 'action'">
        <button class="btn btn-primary btn-block" :class="{disabled: actionNextButtonDisabled}" @click="actionSelected()">Next</button>
      </div>

      <div v-if="currentStep === 'tense'" id="tense-selector" class="container-fluid">
        <div class="row">
          <div class="tense-button col-xs-4">
            <button class="btn btn-primary btn-block" @click="tenseSelected('past')">
              <strong>PAST</strong><span v-if="pastTenseHint"> - {{ pastTenseHint }} {{ action }}</span>
            </button>
          </div>
          <div class="tense-button col-xs-4">
            <button class="btn btn-primary btn-block" @click="tenseSelected('present')">
              <strong>PRESENT</strong><span v-if="presentTenseHint"> - {{ presentTenseHint }} {{ action }}</span>
            </button>
          </div>
          <div class="tense-button col-xs-4">
            <button class="btn btn-primary btn-block" @click="tenseSelected('future')">
              <strong>FUTURE</strong><span v-if="futureTenseHint"> - {{ futureTenseHint }} {{ action }}</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="currentStep === 'actor'">
        <button class="btn btn-primary btn-block" :class="{disabled: actorNextButtonDisabled}" @click="actorSelected()">Next</button>
      </div>

      <div v-if="currentStep === 'target'" class="text-center">
        <div class="col-xs-7">
          <button class="btn btn-primary btn-block" :class="{disabled: targetNextButtonDisabled}" @click="targetSelected()">Next</button>
        </div>
        <div class="col-xs-5">
          <button class="btn btn-primary btn-block" @click="noTargetClicked()">No target</button>
        </div>
      </div>

      <div v-if="currentStep === 'result'" class="text-center">
        <div class="col-xs-7">
          <button class="btn btn-primary btn-block" :class="{disabled: resultNextButtonDisabled}" @click="resultSelected()">Next</button>
        </div>
        <div class="col-xs-5">
          <button class="btn btn-primary btn-block" @click="noResultClicked()">No Result</button>
        </div>
      </div>

      <div v-if="currentStep === 'review'" id="review-instruction" class="text-center">
        <button class="btn btn-primary btn-block" @click="nextClicked()">NEXT</button>
      </div>
    </div>
  </div>
</template>

<script>
import SelectableText from '../SelectableText'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      actions: [],
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
  computed: {
    ...mapGetters({words: 'getCurrentWords'})
  },
  components: {
    SelectableText
  },
  props: ['finish', 'data'],
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
      this.action = this.$refs.selectableText.selectedText()
      this.$refs.selectableText.highlightSelection()
      // this.processTense(this.action, index)
      this.currentStep = 'tense'
    },
    tenseSelected (tense) {
      this.tense = tense
      this.currentStep = 'actor'
    },
    actorSelected () {
      this.actor = this.$refs.selectableText.selectedText()
      this.$refs.selectableText.highlightSelection()
      this.currentStep = 'target'
    },
    targetSelected () {
      this.target = this.$refs.selectableText.selectedText()
      this.$refs.selectableText.highlightSelection()
      this.currentStep = 'result'
    },
    noTargetClicked () {
      this.currentStep = 'result'
    },
    resultSelected () {
      this.result = this.$refs.selectableText.selectedText()
      this.$refs.selectableText.highlightSelection()
      this.actions.push(new Action(this.action, this.actor, this.target, this.result))
      this.currentStep = 'review'
    },
    noResultClicked () {
      this.actions.push(new Action(this.action, this.actor, this.target, this.result))
      this.currentStep = 'review'
    },
    instructionText () {
      if (this.currentStep === 'action') {
        return 'Select an action word'
      } else if (this.currentStep === 'tense') {
        return 'What is the tense of this word?'
      } else if (this.currentStep === 'actor') {
        var tensified = this.tense === 'past' ? 'did'
        : ((this.tense) === 'present' ? 'does' : 'will do')
        return 'Who or what ' + tensified + ' this?'
      } else if (this.currentStep === 'target') {
        var targetTense = this.tense === 'past' ? 'Was this'
        : ((this.tense) === 'present' ? 'Is this' : 'Will this be')
        return targetTense + ' done to something or someone? (select)'
      } else if (this.currentStep === 'result') {
        return 'What is the result/purpose of this action?'
      } else if (this.currentStep === 'review') {
        return this.actionText(new Action(this.action, this.actor, this.target, this.result))
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
      this.action = undefined
      this.actor = undefined
      this.tense = undefined
      this.result = undefined
      this.actionNextButtonDisabled = true
      this.actorNextButtonDisabled = true
      this.targetNextButtonDisabled = true
      this.resultNextButtonDisabled = true
      this.currentStep = 'action'
      this.$refs.selectableText.reset()
    },
    actionText (action) {
      var arrow = ' <span class="glyphicon glyphicon-menu-right flow"></span> '
      return action.actor + arrow + action.action + arrow + action.target + arrow + action.result
    }
  },
  mounted () {
    this.selectionDelegate.onSelect = this.onSelect
    this.selectionDelegate.onMultiSelect = this.onMultiSelect
  }
}

function Action (action, actor, target, result) {
  this.action = action
  this.actor = actor
  this.target = target
  this.result = result
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
.actionbar {
  position: fixed;
  bottom: 0;
  z-index: 100;
  width: 100%;
  padding: 5px;
  padding-bottom: 15px;
  box-shadow: 0px -3px 15px rgba(0, 0, 0, 0.9);
  background-color: @color-back-raised;
  button {
    letter-spacing: 1px;
  }
}
.action-instruction {
  font-size: 19px;
  margin-bottom: 10px;
  .flow {
    color: @color-highlight-orange;
    top: 4px;
  }
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
