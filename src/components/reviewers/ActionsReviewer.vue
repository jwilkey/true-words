<template>
  <div v-if="data !== undefined" class="flex-column vfull">
    <div class="flex-one substance">
      <div class="container">
        <drawer :expanded="true">
          <div slot="title">{{ data.collection.items.length }} ACTIONS</div>
          <div slot="content">
            <div class="actions">
              <div v-for="action in data.collection.items" class="action clearfix">
                <div v-if="action.actor" class="action-item list-item theme-mid">
                  <p class="action-label font-smaller muted">ACTOR</p>
                  <div>{{action.actor ? action.actor.toString() : '?'}}</div>
                </div>
                <div class="action-item list-item theme-mid">
                  <p class="action-label font-smaller muted">ACTION</p>
                  <div class="blue">{{action.action ? action.action.toString() : '?'}}</div>
                </div>
                <div v-if="action.target" class="action-item list-item theme-mid">
                  <p class="action-label font-smaller muted">TARGET</p>
                  <div>{{action.target ? action.target.toString() : '?'}}</div>
                </div>
                <div v-if="action.result" class="action-item list-item theme-mid">
                  <p class="action-label font-smaller muted">RESULT</p>
                  <div>{{action.result ? action.result.toString() : '?'}}</div>
                </div>
              </div>
            </div>
          </div>
        </drawer>

        <div class="action-words">
          <span :key="index" v-for="(word, index) in words" :class="wordClass(word)">{{ word.text }} </span>
        </div>
      </div>
    </div>

    <div class="bottombar flex-zero">
      <button @click="donePressed()" class="btn btn-lg btn-clear btn-block">DONE</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import activities from '../../js/activity'
import Drawer from '../common/Drawer'

export default {
  data () {
    return {
      actionWords: []
    }
  },
  computed: {
    ...mapGetters({
      words: 'getCurrentWords',
      getCurrentActivity: 'getCurrentActivity'
    }),
    title: function () {
      return activities.manager.titleForType(this.getCurrentActivity)
    }
  },
  props: ['data'],
  components: { Drawer },
  methods: {
    wordClass (word) {
      var found = this.actionWords.find(w => word.verse === w.verse && word.index === w.index)
      return found ? ['red'] : []
    },
    donePressed: function () {
      this.$router.replace('/activities')
    }
  },
  mounted () {
    this.actionWords = []
    this.data.collection.items.forEach(action => action.action.words.forEach(w => this.actionWords.push(w)))
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors';
@import '../../../static/less/flex';

.actions {
  display: table;
  margin-left: auto;
  margin-right: auto;
  padding: 0px 10px;
  .action {
    padding-bottom: 12px;
    .action-item:first-child {
      padding-left: 15px;
    }
  }
  .action-item {
    padding: 5px 8px 5px 8px;
    float: left;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }
}
.action-label {
  margin-bottom: 0px;
}
</style>
