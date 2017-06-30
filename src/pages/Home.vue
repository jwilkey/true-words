<template>
  <div>
    <titlebar title="TRUE WORDS"></titlebar>

    <div class="flex-column vfull home-root theme-back">
      <div class="flex-one scrolly">
        <div id="home-content" class="container">
          <card title="BEGIN" subtitle="Choose a Bible text to study" class="nopad">
            <div class="flex-row clearfix theme-back">
              <router-link class="flex-one text-center testament-button theme-mid hover" to="/choosepassage?t=ot">OLD TESTAMENT</router-link>
              <router-link class="flex-one text-center testament-button theme-mid hover" to="/choosepassage?t=nt">NEW TESTAMENT</router-link>
            </div>
          </card>

          <card title="CONTINUE" subtitle="Choose a study">
            <div v-if="isAuthenticated && isLoadingData" class="callout-light alt">
              <p class="text-center"><i class="fa fa-circle-o-notch fa-2x fa-spin"></i></p>
            </div>
            <div v-if="isAuthenticated === true && !isLoadingData">
              <p v-if="manyStudies" class="muted">RECENT STUDIES <span class="callout-light alt">| {{ getStudies.length }} TOTAL</span></p>
              <div v-for="study in recentStudies" :key="study.id" class="row study" @click="continueStudy(study.id)">
                <div class="list-item col-xs-12">
                  <p class="col-sm-6 hidden-xs">{{ study.passage.description() }}</p>
                  <p class="col-sm-6 hidden-xs text-right muted">{{ study.lastEditLabel() }} <span class="bible">{{ study.bible }}</span></p>
                  <div class="col-sm-12 visible-xs nopad-left nopad-right">
                    <p >{{ study.passage.description() }},&nbsp;&nbsp;<span class="muted">{{ study.lastEditLabel() }} ({{ study.bible }})</span></p>
                  </div>
                </div>
              </div>
              <router-link to="Studies" v-if="manyStudies" class="btn callout-light btn-block">ALL STUDIES</router-link>
              <div v-if="getStudies.length <= 0" class="muted flex-row">
                <div class="flex-one">
                  <i>No studies found</i>
                </div>
                <div class="flex-zero">
                  <a class="refresh-studies" @click="refreshData()">reload</a>
                </div>
              </div>
            </div>
            <div v-if="isAuthenticated === false" class="sign-in-view">
              <p class="muted">You are not signed in.</p>
              <p class="muted">Sign in to save your studies.</p>
              <router-link to="Login?referrer=Home" class="btn theme-hi btn-lg">SIGN IN</router-link>
            </div>
          </card>
        </div>
      </div>

      <div class="bottombar clearfix flex-zero">
        <div class="pull-left">
          <router-link class="settings" to="Settings"><i class="fa fa-gear muted"></i></router-link>
        </div>
        <div class="pull-right muted user" @click="userPressed">
          <img v-if="userimage" class="user-img" :src="userimage" />
          {{ username }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Titlebar from '../components/Titlebar'
import Card from '../components/Card'
import { mapGetters, mapActions } from 'vuex'
import container from '../js/container'

export default {
  data () {
    return {
      loaded: false
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'getStudies', 'getPersistor', 'getUser', 'getCurrentStudy']),
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
    },
    container () {
      return container
    }
  },
  components: {
    Card, Titlebar
  },
  methods: {
    ...mapActions(['getPersistor', 'setCurrentStudy', 'setStudies', 'openStudy']),
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
    }
  },
  mounted () {
    this.refreshData()
  }
}
</script>

<style lang="less">
@import '../../static/less/common';
@import '../../static/less/colors';
@import '../../static/less/flex';

html {
  height: 100%;
}
body {
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%
}
.home-root {
  padding-top: 15px;
}
#home-content {
  padding-bottom: 50px;
}
.testament-button {
  padding: 23px 5px 20px 5px;
  letter-spacing: 1px;
  &:first-child {
    margin-right: 1px;
  }
  &:last-child {
    margin-left: 1px;
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
  }
}
.refresh-studies {
  color: @color-highlight-blue;
  cursor: pointer;
}
.user {
  cursor: pointer;
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
  }
}
.settings {
  font-size: 18px;
  padding: 0 10px;
}
</style>
