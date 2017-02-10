<template>
  <div>
    <router-view id="application"></router-view>
    <alert></alert>
  </div>
</template>

<script>
import Alert from './components/Alert'
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      alertCallback: undefined,
      isAuthenticated: false,
      isLoadingPersistedData: false
    }
  },
  computed: {
    ...mapGetters(['getPersistor'])
  },
  components: {
    Alert
  },
  methods: {
    ...mapActions(['setStudies', 'setUser']),
    signinCallback (isSignedIn) {
      this.isAuthenticated = isSignedIn
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
