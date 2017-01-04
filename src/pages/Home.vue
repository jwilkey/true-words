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
        <div v-for="study in getStudies" class="row study" @click="openStudy(study.id)">
          <div class="study-label col-xs-12">
            <p class="col-xs-9">{{ study.passage.description() }}</p>
            <p class="col-xs-3 text-right muted">{{ study.bible }}</p>
          </div>
        </div>
        <div v-if="shouldShowStudiesEmptyState" class="muted"><i>You have not begun any studies</i></div>
        <div v-if="getPersistor === undefined" class="row">
          <div class="col-md-6">
            <google-auth class="col-xs-12"></google-auth>
          </div>
        </div>
      </card>

    </div>
    <div class="actionbar">
      <div class="pull-right muted">
        <img v-if="userimage" class="user-img" :src="userimage" />
        {{ username }}
      </div>
    </div>
  </div>
</template>

<script>
import Titlebar from '../components/Titlebar'
import GoogleAuth from '../components/GoogleAuth'
import store from '../../vuex/store'
import Card from '../components/Card'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['getStudies', 'getPersistor', 'getUser', 'getCurrentStudy']),
    shouldShowStudiesEmptyState: function () {
      return this.getPersistor !== undefined && this.getStudies.length === 0
    },
    username: function () {
      return this.getUser ? this.getUser.name : undefined
    },
    userimage: function () {
      return this.getUser ? this.getUser.imageUrl : undefined
    }
  },
  methods: {
    openStudy (studyId) {
      var self = this
      this.getPersistor.loadStudy(studyId)
      .done(function (studyObject) {
        self.setCurrentStudy(studyObject)
        self.$router.push('/activities')
        self.analytics.trackEvent('ContinueStudy', 'click', self.getCurrentStudy.passage.description())
      })
    },
    ...mapActions(['setCurrentStudy'])
  },
  components: {
    Card, Titlebar, GoogleAuth
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
  &:hover {
    color: @color-selection1;
    text-decoration: none;
  }
}
.user-img {
  height: 20px;
  width: 20px;
  margin-right: 8px;
  border-radius: 5px;
}
.study {
  padding-left: 15px;
  padding-right: 15px;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0px;
  }
}
.study-label {
  background-color: @color-back-raised2;
  box-shadow: @shadow;
    border: solid 1px transparent;
  padding: 10px;
  &:hover {
    color: @color-highlight-orange;
    border: solid 1px @color-highlight-orange;
    cursor: pointer;
  }
  p {
    margin: 0px;
  }
}
</style>
