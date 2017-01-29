<template>
  <div class="home">
    <titlebar title="TRUE WORDS"></titlebar>

    <div id="home-content" class="container">
      <card title="BEGIN" subtitle="Choose a Bible text to study" class="nopad">
        <div class="clearfix">
          <router-link class="text-center testament-button" to="/choosepassage?t=ot">OLD TESTAMENT</router-link>
          <router-link class="text-center testament-button" to="/choosepassage?t=nt">NEW TESTAMENT</router-link>
        </div>
      </card>

      <card title="CONTINUE" subtitle="Choose a study">
        <div v-if="loaded" v-for="study in getStudies" class="row study" @click="continueStudy(study.id)">
          <div class="study-label col-xs-12">
            <p class="col-sm-6 hidden-xs">{{ study.passage.description() }}</p>
            <p class="col-sm-6 hidden-xs text-right muted">{{ study.lastEditLabel() }} <span class="bible">{{ study.bible }}</span></p>
            <div class="col-sm-12 visible-xs nopad-left nopad-right">
              <p >{{ study.passage.description() }},&nbsp;&nbsp;<span class="muted">{{ study.lastEditLabel() }} ({{ study.bible }})</span></p>
            </div>
          </div>
        </div>
        <div v-if="!loaded">
          <p class="text-center">Loading studies...</p>
        </div>
        <div v-if="shouldShowStudiesEmptyState" class="muted"><i>You have not begun any studies</i></div>
        <div v-if="!getPersistor.isLoggedIn()" class="row">
          <div class="col-md-6">
            <google-auth class="col-xs-12"></google-auth>
          </div>
        </div>
      </card>
    </div>

    <div class="actionbar">
      <div class="pull-left feedback">
        <a class="muted" @click="feedback()">Feedback</a>
      </div>
      <div class="pull-right muted user">
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
      loaded: false
    }
  },
  computed: {
    ...mapGetters(['getStudies', 'getPersistor', 'getUser', 'getCurrentStudy']),
    shouldShowStudiesEmptyState: function () {
      return this.getPersistor.isLoggedIn() && this.getStudies.length === 0
    },
    username: function () {
      return this.getUser ? this.getUser.name : undefined
    },
    userimage: function () {
      return this.getUser ? this.getUser.imageUrl : undefined
    }
  },
  components: {
    Card, Titlebar, GoogleAuth
  },
  watch: {
    getPersistor: function (newValue, oldVal) {
      this.refresh()
    }
  },
  methods: {
    continueStudy (studyId) {
      var self = this
      this.alert('LOADING...')
      this.openStudy(studyId).done(function (x) {
        self.$router.push('/activities')
        self.analytics.trackEvent('ContinueStudy', 'click', self.getCurrentStudy.passage.description())
      })
      .always(self.dismissAlert)
    },
    feedback () {
      this.$router.push('feedback')
    },
    refresh () {
      this.loaded = false
      var self = this
      this.getPersistor.refreshData(function (studies) {
        self.setStudies(studies)
        self.loaded = true
      })
    },
    ...mapActions(['setCurrentStudy', 'setStudies', 'openStudy'])
  },
  store,
  mounted () {
    if (this.getPersistor) {
      this.refresh()
    } else {
      console.log('no persistor')
    }
  }
}
</script>

<style lang="less">
@import '../../static/less/colors.less';

html {
  height: 100%;
}
body {
  background-image: url('/static/bible-midnight-fade.png');
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%
}
#home-content {
  padding-bottom: 50px;
}
.testament-button {
  padding: 23px 5px 20px 5px;
  border-bottom: solid 2px transparent;
  float: left;
  width: 50%;
  letter-spacing: 1px;
  &:hover {
    color: @color-button-hover-text;
    text-decoration: none;
    border-bottom: solid 2px @color-selection1;
  }
  &:first-child {
    border-right: solid 1px @color-back;
  }
  &:last-child {
    border-left: solid 1px @color-back;
  }
}
.user-img {
  height: 20px;
  width: 20px;
  margin-right: 8px;
  border-radius: 5px;
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
    border-left: solid 1px @color-back-raised;
  }
}
.study-label {
  background-color: @color-back-raised2;
  box-shadow: @shadow;
  border: solid 1px transparent;
  border-left: solid 3px transparent;
  padding: 10px;
  padding-left: 5px;
  &:hover {
    border-left: solid 3px @color-selection1;
    cursor: pointer;
  }
  p {
    margin: 0px;
  }
}
.feedback {
  padding-left: 10px;
}
.user {
  padding-right: 10px;
}
</style>
