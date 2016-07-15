<template>
  <div class="bucket-label hthird back-orange">{{ data[0].name }}</div>
  <div class="bucket-label hthird back-purple">{{ data[1].name }}</div>
  <div class="bucket-label hthird back-red">{{ data[2].name }}</div>

  <div class="container">
    <span track-by="$index" v-for="word in words" v-bind:class="wordClass($index)">{{ word }} </span>
  </div>

  <div class="actionbar">
    <button @click="donePressed()" class="btn btn-lg btn-primary btn-block">DONE</button>
  </div>
</template>

<script>
import { getCurrentActivity, getCurrentWords } from '../../../vuex/getters'
import activity from '../../js/activity'

export default {
  data () {
    return {
      title: activity.titleForType(this.getCurrentActivity)
    }
  },
  components: {
  },
  props: ['data'],
  methods: {
    wordClass: function (index) {
      if (this.data !== undefined) {
        return {
          'orange': this.data[0].hasWordIndex(index),
          'purple': this.data[1].hasWordIndex(index),
          'red': this.data[2].hasWordIndex(index)
        }
      } else {
        return {}
      }
    },
    donePressed: function () {
      this.$router.go('/')
    }
  },
  ready () {
  },
  vuex: {
    getters: {
      getCurrentActivity,
      words: getCurrentWords
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors.less';
.bucket-label {
  text-align: center;
  float: left;
  letter-spacing: 2px;
  border: solid 1px @color-border;
  padding: 5px;
  margin-bottom: 10px;
}
</style>
