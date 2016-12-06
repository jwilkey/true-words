<template>
  <div v-if="data !== undefined">
    <div class="bucket-label hthird back-orange">{{ data[0].name }}</div>
    <div class="bucket-label hthird back-purple">{{ data[1].name }}</div>
    <div class="bucket-label hthird back-red">{{ data[2].name }}</div>

    <div class="container">
      <span :key="word.index" v-for="(word, index) in words" :class="wordClass(index)">{{ word }} </span>
    </div>

    <div class="actionbar">
      <button @click="donePressed()" class="btn btn-lg btn-primary btn-block">DONE</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import activities from '../../js/activity'

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
      this.$router.replace('/activities')
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
