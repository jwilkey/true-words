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
        <div v-if="isSignedIn && isLoadingData" class="loading-view">
          <p class="text-center"><i class="fa fa-circle-o-notch fa-2x fa-spin"></i></p>
        </div>
        <div v-if="isSignedIn === true && !isLoadingData">
          <p v-if="manyStudies" class="recent-studies-label">RECENT STUDIES <span class="studies-count">{{ getStudies.length }} TOTAL</span></p>
          <div v-for="study in recentStudies" :key="study.id" class="row study" @click="continueStudy(study.id)">
            <div class="study-label col-xs-12">
              <p class="col-sm-6 hidden-xs">{{ study.passage.description() }}</p>
              <p class="col-sm-6 hidden-xs text-right muted">{{ study.lastEditLabel() }} <span class="bible">{{ study.bible }}</span></p>
              <div class="col-sm-12 visible-xs nopad-left nopad-right">
                <p >{{ study.passage.description() }},&nbsp;&nbsp;<span class="muted">{{ study.lastEditLabel() }} ({{ study.bible }})</span></p>
              </div>
            </div>
          </div>
          <router-link to="Studies" v-if="manyStudies" class="btn btn-primary btn-block">ALL STUDIES</router-link>
          <div v-if="getStudies.length <= 0" class="muted flex-row">
            <div class="flex-one">
              <i>No studies found</i>
            </div>
            <div class="flex-zero">
              <a class="refresh-studies" @click="refreshData()">reload</a>
            </div>
          </div>
        </div>
        <div v-if="isSignedIn === false" class="sign-in-view">
            <p>You are not signed in.</p>
            <p>Sign in to save your studies.</p>
            <router-link to="Login?referrer=Home" class="btn btn-raised2 btn-lg">SIGN IN</router-link>
        </div>
      </card>
    </div>

    <div class="actionbar home-bottom">
      <div class="pull-left feedback">
        <a class="muted" href="mailto:help.truewords@gmail.com?subject=Feedback">Feedback</a>
      </div>
      <div class="pull-right muted user" @click="userPressed">
        <img v-if="userimage" class="user-img" :src="userimage" />
        {{ username }}
      </div>
    </div>
  </div>
</template>

<script>
import Titlebar from '../components/Titlebar'
import GoogleAuth from '../components/GoogleAuth'
import Card from '../components/Card'
import { mapGetters, mapActions } from 'vuex'
import driveAuth from '../js/helpers/drive-auth-helper'

export default {
  data () {
    return {
      loaded: false
    }
  },
  computed: {
    ...mapGetters(['getStudies', 'getPersistor', 'getUser', 'getCurrentStudy']),
    manyStudies () {
      return this.getStudies.length > 3
    },
    username () {
      return this.getUser ? this.getUser.name : undefined
    },
    userimage () {
      return this.getUser ? this.getUser.imageUrl : undefined
    },
    recentStudies () {
      return this.manyStudies ? this.getStudies.slice(0, 3) : this.getStudies
    }
  },
  components: {
    Card, Titlebar, GoogleAuth
  },
  methods: {
    ...mapActions(['setPersistenceStrategy', 'getPersistor', 'setCurrentStudy', 'setStudies', 'openStudy']),
    continueStudy (studyId) {
      var self = this
      this.alert('LOADING...')
      this.openStudy(studyId).done(function (x) {
        self.$router.push('/activities')
        self.analytics.trackEvent('ContinueStudy', 'click', self.getCurrentStudy.passage.description())
      })
      .always(self.dismissAlert)
    },
    userPressed () {
      const self = this
      this.setAlertCallback(confirmation => {
        if (confirmation === 'yes') {
          self.getPersistor.signOut()
        }
        self.dismissAlert()
      })
      this.alert('Sign out?', 'confirm')
    },
    feedback () {
      this.$router.push('feedback')
    },
    checkAuth () {
      const self = this
      var signinListener = this.$root.$children[0].signinCallback
      driveAuth.checkAuth(signinListener, () => {
        self.setPersistenceStrategy('GOOGLE_DRIVE')
      })
    }
  },
  mounted () {
    this.checkAuth()
    this.refreshData()
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
  color: @color-text;
  padding: 23px 5px 20px 5px;
  border-bottom: solid 2px transparent;
  float: left;
  width: 50%;
  letter-spacing: 1px;
  &:hover {
    color: @color-text;
    text-decoration: none;
    border-bottom: solid 2px @color-callout-light;
  }
  &:first-child {
    border-right: solid 1px @color-back;
  }
  &:last-child {
    border-left: solid 1px @color-back;
  }
}
.loading-view {
  color: @color-highlight-blue;
}
.user-img {
  height: 20px;
  width: 20px;
  margin-right: 8px;
  border-radius: 5px;
}

.recent-studies-label {
  color: @color-deemphasize;
  .studies-count {
    margin-left: 5px;
    padding-left: 5px;
    border-left: solid 2px @color-back-raised2;
  }
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
  border-bottom: solid 2px @color-back-raised2;
  border-left: solid 2px @color-back-raised2;
  padding: 10px;
  padding-left: 8px;
  transition: border-left 0.5s;
  &:hover {
    border-left: solid 3px @color-callout-light;
    cursor: pointer;
  }
  p {
    margin: 0px;
  }
}
.refresh-studies {
  color: @color-highlight-blue;
  cursor: pointer;
}
.home-bottom {
  padding: 10px;
  .user {
    cursor: pointer;
  }
}
.sign-in-view {
  text-align: center;
  a {
    min-width: 300px;
    max-width: 400px;
    margin-top: 10px;;
  }
  p {
    margin-bottom: 3px;
    text-align: center;
    color: @color-deemphasize;
  }
}
</style>
