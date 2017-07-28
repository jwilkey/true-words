<template>
  <div v-if="data !== undefined" class="flex-column vfull">
    <div class="flex-row shadow">
      <div class="flex-one bucket-label back-orange"><i class="fa fa-user-circle-o"></i> {{ container(0).name }}</div>
      <div class="flex-one bucket-label back-purple"><i class="fa fa-institution"></i> {{ container(1).name }}</div>
      <div class="flex-one bucket-label back-red"><i class="fa fa-tree"></i> {{ container(2).name }}</div>
    </div>

    <div class="flex-one substance">
      <div class="container">
        <drawer :expanded="true">
          <div slot="title">
            {{container(0).items.length}} {{container(0).name}},
            {{container(1).items.length}} {{container(1).name}},
            {{container(2).items.length}} {{container(2).name}}</div>
          <div slot="content" class="row">
            <div class="col-sm-4">
              <ul class="word-list">
                <li class="orange list-item" v-for="selection in container(0).items">{{ selection.toString() }}</li>
              </ul>
            </div>
            <div class="col-sm-4">
              <ul class="word-list">
                <li class="purple list-item" v-for="selection in container(1).items">{{ selection.toString() }}</li>
              </ul>
            </div>
            <div class="col-sm-4">
              <ul class="word-list">
                <li class="red list-item" v-for="selection in container(2).items">{{ selection.toString() }}</li>
              </ul>
            </div>
          </div>
        </drawer>
      </div>
      <br />

      <div id="buckets-reviewer-words" class="container">
        <span :key="index" v-for="(word, index) in words" :class="wordClass(word)">{{ word.text }} </span>
      </div>
    </div>

    <div class="flex-zero">
      <div class="bottombar">
        <button @click="donePressed()" class="btn btn-lg callout-light btn-block">DONE</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import activities from '../../js/activity'
import Drawer from '../common/Drawer'

export default {
  data () { return { } },
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
    container (index) {
      return this.data.containers[index]
    },
    wordClass: function (word) {
      if (this.data !== undefined) {
        return {
          orange: this.container(0).search(word),
          purple: this.container(1).search(word),
          red: this.container(2).search(word)
        }
      } else {
        return {}
      }
    },
    donePressed: function () {
      this.$router.replace('/activities')
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors.less';
@import '../../../static/less/flex.less';

#buckets-reviewer-words {
  font-size: 18px;
  padding-bottom: 20px;
}
.bucket-label {
  text-align: center;
  float: left;
  letter-spacing: 2px;
  padding: 5px;
}
.word-list {
  padding-left: 0px;
  margin-bottom: 0px;
  li {
    display: inline-block;
    padding-left: 3px;
    padding-right: 5px;
  }
  li:last-child {
    border-right: none;
  }
}
</style>
