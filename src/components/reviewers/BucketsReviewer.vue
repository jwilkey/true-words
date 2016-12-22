<template>
  <div v-if="data !== undefined">
    <div class="bucket-label hthird back-orange">{{ container(0).name }}</div>
    <div class="bucket-label hthird back-purple">{{ container(1).name }}</div>
    <div class="bucket-label hthird back-red">{{ container(2).name }}</div>

    <div class="container">
      <span :key="word.index" v-for="(word, index) in words" :class="wordClass(word)">{{ word.text }} </span>
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
    container (index) {
      return this.data.containers[index]
    },
    wordClass: function (word) {
      if (this.data !== undefined) {
        return {
          'orange': this.container(0).contains(word),
          'purple': this.container(1).contains(word),
          'red': this.container(2).contains(word)
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
