<template>
  <div>
    <titlebar title="SIGN IN" :left-items="['close']" :on-close="closePressed"></titlebar>

    <div class="container">
      <google-auth v-if="!isAuthenticated"></google-auth>

      <div v-if="isAuthenticated" class="text-center">
        <p class="user-name">Hello {{ username }}!</p>
        <img v-if="userimage" class="user-photo" :src="userimage" />
        <hr />
        <p class="redirect-helper">If you are not automatically redirected <router-link to="Home">click here</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import Titlebar from '../components/Titlebar'
import GoogleAuth from '../components/GoogleAuth'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      existingStudies: []
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'getUser', 'getPersistor', 'getStudies']),
    username: function () {
      return this.getUser ? this.getUser.name : undefined
    },
    userimage: function () {
      return this.getUser ? this.getUser.imageUrl : undefined
    }
  },
  watch: {
    getPersistor: function (newPersistor, oldVal) {
      if (newPersistor && newPersistor.isLoggedIn()) {
        var self = this
        this.existingStudies.forEach(function (study) {
          newPersistor.saveStudy(study).done(function () {
            self.getStudies.push(study)
          })
        })
      }
    },
    isAuthenticated (authenticated) {
      const self = this
      if (authenticated) {
        setTimeout(self.closePressed, 2000)
      }
    }
  },
  components: {
    Titlebar, GoogleAuth
  },
  methods: {
    closePressed () {
      var referrer = this.$route.query.referrer || '/'
      this.$router.replace(referrer)
    }
  },
  mounted () {
    this.existingStudies = this.getStudies.slice(0)
  }
}
</script>

<style lang="less" scoped>
@import '../../static/less/colors.less';
body {
  padding-top: 55px;
}
.user-name {
  text-align: center;
  font-size: 20px;
  margin-top: 40px;
}
.user-photo {
  margin: 25px 0px;
  width: 100px;
  height: 100px;
  border-radius: 6px;
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.5);
  transition: height 0.7s, width 0.7s, opacity 0.7s;
}
.redirect-helper {
  font-size: 13px;
  color: @color-deemphasize;
  margin-top: 40px;
  a {
    color: @color-highlight-blue;
  }
}
</style>
