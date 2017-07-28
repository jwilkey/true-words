<template>
  <div v-if="data !== undefined" class="flex-column vfull">
    <div class="flex-one">
      <div class="container substance">
        <span v-for="freeText in data.collection.items">{{ freeText.text }} </span>
      </div>
    </div>

    <div class="flex-zero bottombar">
      <button @click="donePressed()" class="btn btn-lg callout-light btn-block">DONE</button>
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
    donePressed: function () {
      this.$router.replace('/activities')
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors';
@import '../../../static/less/flex';
</style>
