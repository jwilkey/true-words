<template>
  <div class="flex-column vfull">
    <div class="flex-one scrolly bottompad">
      <div v-if="mode === 'context'" class="container context-mode">
        <h3>In the next 3 days...</h3>
        <div class="context-container" id="time-entry" v-if="timeEntry">
          <p class="context-question">{{ timeEntry.questionText }}</p>
          <input class="form-control" placeholder="time..." v-model="timeEntry.freeText.text" />
        </div>
        <div class="context-container" id="money-entry" v-if="moneyEntry">
          <p class="context-question">{{ moneyEntry.questionText }}</p>
          <input class="form-control" placeholder="money..." v-model="moneyEntry.freeText.text" />
        </div>
        <div class="context-container" id="thoughts-entry" v-if="thoughtsEntry">
          <p class="context-question">{{ thoughtsEntry.questionText }}</p>
          <input class="form-control" placeholder="thoughts..." v-model="thoughtsEntry.freeText.text" />
        </div>
        <div class="context-container" id="people-entry" v-if="peopleEntry">
          <p class="context-question">{{ peopleEntry.questionText }}</p>
          <input class="form-control" placeholder="people..." v-model="peopleEntry.freeText.text" />
        </div>
      </div>

      <div v-if="mode === 'text'" class="container">
        <div v-for="verse in getCurrentStudy.verses" class="verse-container">
          <span class="verse-number">{{ verse.number }}</span> <span class="verse-text">{{ verse.text }}</span>
        </div>
      </div>
    </div>

    <div class="flex-zero bottombar clearfix">
      <div v-if="mode === 'context'">
        <button class="btn btn-actionable btn-block" @click="contextQuestionsFinished()">NEXT</button>
      </div>

      <div v-if="mode === 'text'">
        <div v-if="currentStep !== 'done'">
          <div class="proposition">In the next 3 days, how should this passage affect</div>
          <div class="condition">{{ stepCondition }} <span class="condition-context">{{ stepConditionContext }}</span></div>
          <div class="user-input" contenteditable="true"></div>
        </div>
        <transition name="fade">
          <button v-if="currentStep !== 'time'" class="btn btn-xs btn-actionable alt pull-left" @click="previousStep()">PREVIOUS</button>
        </transition>
        <button class="btn btn-xs btn-actionable alt pull-right" @click="nextPressed()">{{ nextButtonText }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { mapGetters } from 'vuex'
import activities from '../../js/activity'

export default {
  data () {
    return {
      activityType: activities.types.Stewardship,
      mode: 'context',
      currentStep: 'time',
      timeEntry: undefined,
      moneyEntry: undefined,
      thoughtsEntry: undefined,
      peopleEntry: undefined,
      affectTimeEntry: undefined,
      affectMoneyEntry: undefined,
      affectThoughtsEntry: undefined,
      affectPeopleEntry: undefined
    }
  },
  computed: {
    ...mapGetters(['getCurrentStudy']),
    stepCondition () {
      switch (this.currentStep) {
        case 'time': return this.affectTimeEntry.questionText
        case 'money': return this.affectMoneyEntry.questionText
        case 'thoughts': return this.affectThoughtsEntry.questionText
        case 'people': return this.affectPeopleEntry.questionText
        default: return ''
      }
    },
    stepConditionContext () {
      switch (this.currentStep) {
        case 'time': return this.timeEntry.freeText.text
        case 'money': return this.moneyEntry.freeText.text
        case 'thoughts': return this.thoughtsEntry.freeText.text
        case 'people': return this.peopleEntry.freeText.text
        default:
      }
    },
    nextButtonText () {
      return this.currentStep === 'people' ? 'FINISHED' : 'NEXT'
    }
  },
  components: { },
  props: ['finish', 'data'],
  watch: {
    currentStep (newVal, oldVal) {
      switch (newVal) {
        case 'time': $('.user-input').text(this.affectTimeEntry.freeText.text)
          break
        case 'money': $('.user-input').text(this.affectMoneyEntry.freeText.text)
          break
        case 'thoughts': $('.user-input').text(this.affectThoughtsEntry.freeText.text)
          break
        case 'people': $('.user-input').text(this.affectPeopleEntry.freeText.text)
          break
        default:
      }
    }
  },
  methods: {
    contextQuestionsFinished () {
      this.mode = 'text'
      this.$nextTick(() => {
        $('.user-input').focus()
        $('.user-input').text(this.affectTimeEntry.freeText.text)
      })
    },
    nextPressed () {
      var input = $('.user-input').text()
      if (this.currentStep !== 'done' && input.length < 1) {
        this.alert('You must provide an answer (even to say "The passage has no implications for this part of my life")', 'ok')
      } else {
        this.assignUserInput($('.user-input').text())
        $('.user-input').text('')
        this.nextStep()
        $('.user-input').focus()
      }
    },
    assignUserInput (text) {
      switch (this.currentStep) {
        case 'time': this.affectTimeEntry.freeText.text = text
          break
        case 'money': this.affectMoneyEntry.freeText.text = text
          break
        case 'thoughts': this.affectThoughtsEntry.freeText.text = text
          break
        case 'people':
          this.affectPeopleEntry.freeText.text = text
          this.finished()
          break
        case 'done': this.finished()
          break
        default:
      }
    },
    nextStep () {
      switch (this.currentStep) {
        case 'time': this.currentStep = 'money'
          break
        case 'money': this.currentStep = 'thoughts'
          break
        case 'thoughts': this.currentStep = 'people'
          break
        case 'people': this.currentStep = 'done'
          break
        case 'done': this.finished()
          break
        default:
      }
    },
    previousStep () {
      switch (this.currentStep) {
        case 'time': this.currentStep = 'time'
          break
        case 'money': this.currentStep = 'time'
          break
        case 'thoughts': this.currentStep = 'money'
          break
        case 'people': this.currentStep = 'thoughts'
          break
        case 'done': this.currentStep = 'people'
          break
        default:
      }
    },
    findQuestionEntry (type) {
      var items = this.data.collection.items
      for (var item in items) {
        if (items[item].questionId === type) {
          return items[item]
        }
      }
      return undefined
    },
    finished () {
      this.finish(this.activityType, this.data)
    }
  },
  mounted () {
    this.timeEntry = this.findQuestionEntry('time')
    this.moneyEntry = this.findQuestionEntry('money')
    this.thoughtsEntry = this.findQuestionEntry('thoughts')
    this.peopleEntry = this.findQuestionEntry('people')
    this.affectTimeEntry = this.findQuestionEntry('affect-time')
    this.affectMoneyEntry = this.findQuestionEntry('affect-money')
    this.affectThoughtsEntry = this.findQuestionEntry('affect-thoughts')
    this.affectPeopleEntry = this.findQuestionEntry('affect-people')
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors.less';
@import '../../../static/less/flex.less';

.context-mode {
  h3 {
    text-shadow: 1px 1px 1px @color-highlight-blue;
  }
  .context-container {
    margin-bottom: 10px;
    input {
      background-color: transparent;
      color: @color-text;
      border-color: @color-back-raised2;
    }
  }
}
.verse-container {
  display: inline;
  padding: 0px;
  margin-left: 3px;
  font-size: 18px;
}
.verse-number {
  color: #999;
  vertical-align: super;
  font-size: 14px;
}
.proposition {
  padding-left: 5px;
  color: @color-highlight-blue;
}
.condition {
  font-size: 20px;
  border-bottom: solid 1px @color-back-raised;
  margin-bottom: 8px;
  padding: 0px 10px 5px 10px;
  text-shadow: 1px 0px 1px @color-highlight-blue;
  line-height: 1;
}
.condition-context {
  color: @color-deemphasize;
  text-shadow: none;
  font-size: 16px;
  margin-left: 5px;
  &:not(:empty):before {
    content: '( '
  }
  &:not(:empty):after {
    content: ' )'
  }
}
.user-input{
  padding: 5px;
  font-size: 18px;
  color: @color-text;
  border: solid 1px @color-back-raised2;
  border-radius: 3px;
  margin-bottom: 8px;
  &:focus {
    box-shadow: 0px 0px 2px @color-highlight-blue;
    outline: none;
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
</style>
