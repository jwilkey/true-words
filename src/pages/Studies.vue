<template>
  <div>
    <titlebar title="STUDIES" :left-items="['home']"></titlebar>

    <div class="container studies-root theme-back">
      <div v-for="study in getStudies" :key="study.id" class="row study" @click="continueStudy(study.id)">
        <div class="study-label theme-mid hover shadow col-xs-12">
          <p class="col-sm-6 hidden-xs">{{ study.passage.description() }}</p>
          <p class="col-sm-6 hidden-xs text-right muted">{{ study.lastEditLabel() }} <span class="bible">{{ study.bible }}</span></p>
          <div class="col-sm-12 visible-xs nopad-left nopad-right">
            <p >{{ study.passage.description() }},&nbsp;&nbsp;<span class="muted">{{ study.lastEditLabel() }} ({{ study.bible }})</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Titlebar from '../components/Titlebar'

export default {
  data () {
    return {
    }
  },
  components: { Titlebar },
  computed: {
    ...mapGetters(['getStudies', 'getCurrentStudy'])
  },
  methods: {
    ...mapActions(['openStudy']),
    continueStudy (studyId) {
      var self = this
      this.alert('LOADING...')
      this.openStudy(studyId).done(function (x) {
        self.$router.push('/activities')
        self.analytics.trackEvent('ContinueStudy', 'click', self.getCurrentStudy.passage.description())
      })
      .always(self.dismissAlert)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../static/less/colors.less';

.studies-root {
  padding-top: 15px;
  padding-bottom: 15px;
}
.study {
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0px;
  }
  .bible {
    display: inline-block;
    width: 54px;
    margin-left: 24px;
  }
}
.study-label {
  border: solid 1px transparent;
  border-left: solid 3px transparent;
  padding: 10px;
  padding-left: 5px;
  cursor: pointer;
  p {
    margin: 0px;
  }
}
</style>
