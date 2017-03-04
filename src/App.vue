<template>
  <div>
    <router-view id="application"></router-view>
    <alert></alert>
    <reauthorize-modal v-if="isSessionExpired" :on-reauth="didReauthorize"></reauthorize-modal>
  </div>
</template>

<script>
import Alert from './components/Alert'
import ReauthorizeModal from './components/ReauthorizeModal'
import { mapGetters, mapActions } from 'vuex'

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
    ...mapGetters(['getPersistor', 'isAuthenticated'])
  },
  components: {
    Alert, ReauthorizeModal
  },
  methods: {
    ...mapActions(['setStudies', 'setAuthenticated', 'setUser']),
    didReauthorize () {
      this.isSessionExpired = false
    },
    signinCallback (isSignedIn) {
      this.setAuthenticated(isSignedIn)
      if (isSignedIn) {
        this.refreshPersistedData()
      } else {
        window.location.reload(false)
      }
    },
    refreshPersistedData () {
      console.log('Refreshing data')
      var self = this
      this.isLoadingPersistedData = true
      this.getPersistor.refreshData(function (studies, user) {
        self.setStudies(studies)
        self.setUser(user)
        self.isLoadingPersistedData = false
      })
    }
  },
  mounted () {
    var self = this
    window.clearInterval(this.sessionTimer)
    this.sessionTimer = window.setInterval(() => {
      if (self.getPersistor.isSessionExpired()) {
        self.isSessionExpired = true
      }
    }, 10 * 1000)
  }
}
</script>

<style lang="less">
@import '../static/less/app.less';
@import '../static/less/colors.less';

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
