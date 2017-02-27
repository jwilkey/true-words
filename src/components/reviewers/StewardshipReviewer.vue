<template>
  <div v-if="data !== undefined" class="flex-column vfull">
    <div class="flex-one scrolly bottompad">
      <div class="container">
        <p class="title-label brand-font">Life Context - <span class="subtitle-label">3 days following {{ getCurrentStudy.lastEditLabel() }}</span></p>

        <p v-if="timeEntry.freeText.text" class="question">{{ timeEntry.questionText }}</p>
        <p v-if="timeEntry.freeText.text" class="answer">{{ timeEntry.freeText.text }}</p>

        <p v-if="moneyEntry.freeText.text" class="question">{{ moneyEntry.questionText }}</p>
        <p v-if="moneyEntry.freeText.text" class="answer">{{ moneyEntry.freeText.text }}</p>

        <p v-if="thoughtsEntry.freeText.text" class="question">{{ thoughtsEntry.questionText }}</p>
        <p v-if="thoughtsEntry.freeText.text" class="answer">{{ thoughtsEntry.freeText.text }}</p>

        <p v-if="peopleEntry.freeText.text" class="question">{{ peopleEntry.questionText }}</p>
        <p v-if="peopleEntry.freeText.text" class="answer">{{ peopleEntry.freeText.text }}</p>

        <p class="title-label brand-font">How this passage should affect:</p>

        <p class="question">...{{ affectTimeEntry.questionText }}</p>
        <p class="answer">{{ affectTimeEntry.freeText.text }}</p>

        <p class="question">...{{ affectMoneyEntry.questionText }}</p>
        <p class="answer">{{ affectMoneyEntry.freeText.text }}</p>

        <p class="question">...{{ affectThoughtsEntry.questionText }}</p>
        <p class="answer">{{ affectThoughtsEntry.freeText.text }}</p>

        <p class="question">...{{ affectPeopleEntry.questionText }}</p>
        <p class="answer">{{ affectPeopleEntry.freeText.text }}</p>
      </div>
    </div>

    <div class="flex-zero bottombar">
      <div class="col-xs-12">
        <button @click="donePressed()" class="btn btn-lg btn-primary btn-block">DONE</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import activities from '../../js/activity'

export default {
  data () {
    return {
      timeEntry: {freeText: {}},
      moneyEntry: {freeText: {}},
      thoughtsEntry: {freeText: {}},
      peopleEntry: {freeText: {}},
      affectTimeEntry: {freeText: {}},
      affectMoneyEntry: {freeText: {}},
      affectThoughtsEntry: {freeText: {}},
      affectPeopleEntry: {freeText: {}}
    }
  },
  computed: {
    ...mapGetters(['getCurrentStudy']),
    title: function () {
      return activities.manager.titleForType(this.getCurrentActivity)
    }
  },
  props: ['data'],
  methods: {
    findQuestionEntry (type) {
      var items = this.data.collection.items
      for (var item in items) {
        if (items[item].questionId === type) {
          return items[item]
        }
      }
      return undefined
    },
    donePressed: function () {
      this.$router.replace('/activities')
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

.title-label {
  margin-top: 10px;
  padding: 5px;
  border-top: solid 1px @color-back-raised;
  border-bottom: solid 1px @color-back-raised;
  background-color: @color-back-raised;
  .subtitle-label {
    color: @color-deemphasize;
  }
}
.question {
  color: @color-highlight-blue;
  margin-bottom: 0px;
}
.answer {
  padding-left: 10px;
}
</style>
