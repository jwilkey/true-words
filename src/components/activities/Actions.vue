<template>
  <div class="action-instruction">
    <div class="text-center">
      {{{ instructionText() }}}
    </div>

    <div v-if="currentStep === 'review'" id="review-instruction" class="text-center">
    </div>
  </div>

  <selectable-text :delegate="selectionDelegate"></selectable-text>

  <div class="actionbar">
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

    <div v-if="currentStep === 'target'" class="text-center">
      <button class="btn btn-primary btn-block" @click="noTargetClicked()">No Target / I'm not sure</button>
    </div>

    <div v-if="currentStep === 'result'" class="text-center">
      <button class="btn btn-primary btn-block" @click="noResultClicked()">No Result / I'm not sure</button>
    </div>

    <div v-if="currentStep === 'review'" id="review-instruction" class="text-center">
      <button class="btn btn-primary btn-block" @click="nextClicked()">NEXT</button>
    </div>
  </div>
</template>

<script>
import SelectableText from '../SelectableText'
import { getCurrentWords } from '../../../vuex/getters'

export default {
  data () {
    return {
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
        onSelect: this.onSelect,
        onMultiSelect: this.onMultiSelect
      }
    }
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
        this.action = word
        this.processTense(word, index)
        this.currentStep = 'tense'
      } else if (this.currentStep === 'actor') {
        this.actor = word
        this.currentStep = 'target'
      } else if (this.currentStep === 'target') {
        this.target = word
        this.currentStep = 'result'
      } else if (this.currentStep === 'result') {
        this.result = word
        this.currentStep = 'review'
      }
    },
    onMultiSelect (words, range) {
      this.onSelect(words.join(' '), range[0])
    },
    tenseSelected (tense) {
      this.tense = tense
      this.currentStep = 'actor'
    },
    noTargetClicked () {
      this.currentStep = 'result'
    },
    noResultClicked () {
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
        return 'What is the result of this action?'
      } else if (this.currentStep === 'review') {
        var arrow = ' <span class="glyphicon glyphicon-menu-right flow"></span> '
        return this.actor + arrow + this.action + arrow + this.target + arrow + this.result
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
      this.currentStep = 'action'
    }
  },
  ready () {
  },
  vuex: {
    getters: {
      words: getCurrentWords
    }
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
.actionbar {
  position: fixed;
  bottom: 0;
  z-index: 100;
  width: 100%;
  padding: 5px;
  box-shadow: 0px -1px 2px rgba(0, 0, 0, 0.9);
  background-color: @color-back-raised;
  button {
    letter-spacing: 1px;
  }
}
.action-instruction {
  color: @color-text-accent;
  font-size: 19px;
  margin-bottom: 10px;
  .flow {
    color: @color-highlight-orange;
    top: 4px;
  }
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
