<template>
  <div>
    <titlebar title="TRUE WORDS"></titlebar>
    <div class="container">
      <card title="BEGIN" subtitle="Choose a Bible text to study">
        <div class="row clearfix">
          <div class="col-xs-6">
            <router-link class="col-xs-12 text-center card-button" to="/choosepassage?t=ot">Old Testament</router-link>
          </div>
          <div class="col-xs-6">
            <router-link class="col-xs-12 text-center card-button" to="/choosepassage?t=nt">New Testament</router-link>
          </div>
        </div>
      </card>

      <card title="CONTINUE" subtitle="Choose a study">
        <p v-for="study in getStudies">{{ study.passage.description() }}</p>
        Ephesians 1:1-7
      </card>
    </div>
  </div>
</template>

<script>
import Titlebar from '../components/Titlebar'
import store from '../../vuex/store'
import Card from '../components/Card'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['getStudies'])
  },
  components: {
    Card, Titlebar
  },
  store
}
</script>

<style lang="less">
@import '../../static/less/colors.less';

.card-button {
  background-color: @color-back-raised2;
  box-shadow: @shadow;
  padding: 10px;
}
</style>
