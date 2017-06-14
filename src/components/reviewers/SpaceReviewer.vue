<template>
  <div v-if="data !== undefined" class="flex-v">
    <div class="flex-1">
      <div class="container">
        <div class="space-container">
          <p class="space-title muted"><span class="acronym">S</span>INS TO CONFESS</p>
          <p v-for="freeText in this.data.findContainer('S').items" class="space-item list-item">{{ freeText.text }}</p>
          <p v-if="this.data.findContainer('S').items.length === 0" class="space-item-empty muted">none identified</p>
        </div>
        <div class="space-container">
          <p class="space-title muted"><span class="acronym">P</span>ROMISES TO CLAIM</p>
          <p v-for="freeText in this.data.findContainer('P').items" class="space-item list-item">{{ freeText.text }}</p>
          <p v-if="this.data.findContainer('P').items.length === 0" class="space-item-empty muted">none identified</p>
        </div>
        <div class="space-container">
          <p class="space-title muted"><span class="acronym">A</span>CTIONS TO TAKE</p>
          <p v-for="freeText in this.data.findContainer('A').items" class="space-item list-item">{{ freeText.text }}</p>
          <p v-if="this.data.findContainer('A').items.length === 0" class="space-item-empty muted">none identified</p>
        </div>
        <div class="space-container">
          <p class="space-title muted"><span class="acronym">C</span>OMMANDS TO OBEY</p>
          <p v-for="freeText in this.data.findContainer('C').items" class="space-item list-item">{{ freeText.text }}</p>
          <p v-if="this.data.findContainer('C').items.length === 0" class="space-item-empty muted">none identified</p>
        </div>
        <div class="space-container">
          <p class="space-title muted"><span class="acronym">E</span>XAMPLES TO FOLLOW</p>
          <p v-for="freeText in this.data.findContainer('E').items" class="space-item list-item">{{ freeText.text }}</p>
          <p v-if="this.data.findContainer('E').items.length === 0" class="space-item-empty muted">none identified</p>
        </div>
      </div>
    </div>

    <div class="actionbar-flex">
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
    ...mapGetters(['getCurrentActivity']),
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
@import '../../../static/less/colors.less';
.space-container {
  margin-bottom: 20px;
}
.space-title {
  letter-spacing: 2px;
  padding-bottom: 5px;
  margin-bottom: 0px;
  .acronym {
    font-size: 20px;
    font-weight: bold;
  }
}
.space-item {
  padding: 5px;
  margin: 0px;
}
.space-item-empty {
  font-style: italic;
  padding: 5px;
  margin: 0px;
}
</style>
