<template>
  <div v-if="data !== undefined" class="flex-column vfull">
    <div class="flex-one substance">
      <div class="container">
        <div class="acta-container">
          <p class="acta-title muted"><span class="acronym font-larger">A</span>DORE - God, I adore you for...</p>
          <p v-for="freeText in adoreItems" class="acta-item list-item">{{ freeText.text }}</p>
          <p v-if="adoreItems.length === 0" class="acta-item-empty muted">&mdash;</p>
        </div>
        <div class="acta-container">
          <p class="acta-title muted"><span class="acronym font-larger">C</span>ONFESS - God, I have sinned by...</p>
          <p v-for="freeText in confessItems" class="acta-item list-item">{{ freeText.text }}</p>
          <p v-if="confessItems.length === 0" class="acta-item-empty muted">&mdash;</p>
        </div>
        <div class="acta-container">
          <p class="acta-title muted"><span class="acronym font-larger">T</span>HANK - God, thank you for...</p>
          <p v-for="freeText in thankItems" class="acta-item list-item">{{ freeText.text }}</p>
          <p v-if="thankItems.length === 0" class="acta-item-empty muted">&mdash;</p>
        </div>
        <div class="acta-container">
          <p class="acta-title muted"><span class="acronym font-larger">A</span>SK - God, would you please...</p>
          <p v-for="freeText in askItems" class="acta-item list-item">{{ freeText.text }}</p>
          <p v-if="askItems.length === 0" class="acta-item-empty muted">&mdash;</p>
        </div>
      </div>
    </div>

    <div class="flex-zero bottombar">
      <button @click="donePressed()" class="btn btn-lg btn-clear btn-block">DONE</button>
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
    },
    adoreItems () { return this.data.findContainer('Adore').items },
    confessItems () { return this.data.findContainer('Confess').items },
    thankItems () { return this.data.findContainer('Thank').items },
    askItems () { return this.data.findContainer('Ask').items }
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

.acta-container {
  margin-bottom: 20px;
}
.acta-title {
  margin-bottom: 0px;
  .acronym {
    font-weight: bold;
  }
}
.acta-item {
  padding: 5px;
  margin: 0px;
}
.acta-item-empty {
  font-style: italic;
  padding: 5px;
  margin: 0px;
}
</style>
