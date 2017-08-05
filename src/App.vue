<template>
  <div class="vfull theme-back">
    <router-view id="application"></router-view>
    <alert></alert>
    <reauthorize-modal v-if="isSessionExpired" :on-reauth="didReauthorize"></reauthorize-modal>
  </div>
</template>

<script>
import Alert from './components/Alert'
import ReauthorizeModal from './components/ReauthorizeModal'
import { mapGetters, mapActions } from 'vuex'
import { isTouchDevice } from './js/polyfill'
import container from './js/container'

export default {
  data () {
    return {
      alertCallback: undefined,
      isLoadingPersistedData: false,
      isSessionExpired: false,
      sessionTimer: undefined
    }
  },
  computed: {
    ...mapGetters(['getPersistor', 'platform', 'isAuthenticated'])
  },
  components: {
    Alert, ReauthorizeModal
  },
  methods: {
    ...mapActions(['setPersistenceStrategy', 'setPlatform', 'setStudies', 'setAuthenticated', 'setUser', 'clearData']),
    didReauthorize () {
      this.isSessionExpired = false
    },
    refreshPersistedData () {
      if (this.isAuthenticated) {
        console.log('Refreshing data')
        var self = this
        this.isLoadingPersistedData = true
        this.getPersistor.refreshData((studies) => {
          console.log(studies.length + ' studies loaded')
          self.setStudies(studies)
          self.isLoadingPersistedData = false
        })
      }
    },
    authorize (token, strategy, username, userImage) {
      if (token) {
        this.setPersistenceStrategy(strategy)
        container.authToken = token
        container.recentPersistentStrategy = strategy
        this.setUser({name: username, imageUrl: userImage})
        this.setAuthenticated(true)
        this.refreshPersistedData()
      }
    },
    deauthorize () {
      container.authToken = undefined
      this.clearData()
      this.$router.push('Home')
    },
    checkAuth () {
      container.authHandler.checkAuth()
    },
    showReauthView () {
      this.isSessionExpired = true
    }
  },
  mounted () {
    window.twauth = this.authorize
    window.twdeauth = this.deauthorize
    container.platform = this.$route.query.platform || 'web'
    container.appVersion = this.$route.query.app_version
    container.onAuthorizationExpired = this.showReauthView
    this.setPlatform(container.platform)

    if (!isTouchDevice()) {
      document.querySelector('html').classList.add('hover-on')
    }

    this.checkAuth()
  }
}
</script>

<style lang="less">
@import '../static/less/app.less';
@import '../static/less/colors.less';

html {
  height: 100%;
}
body {
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s ease;
}
.fade-enter, .fade-leave-active {
  opacity: 0;
}

#application {
  &.obscure {
    filter: blur(3px);
  }
}
</style>
