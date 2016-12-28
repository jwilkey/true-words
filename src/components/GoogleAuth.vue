<template>
  <div id="authorize-div" class="clearfix" style="display: none" @click="signInToDrive(event)">
    <img class="drive-logo" src="../assets/drive.png" />
    <div class="drive-text">
      <p class="drive-connect-label">Save your studies in Google Drive</p>
      <p class="drive-connect">Sign in using Google</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import $ from 'jquery'
import drive from '../js/helpers/DriveHelper'

export default {
  data () {
    return { }
  },
  computed: {
    ...mapGetters([])
  },
  components: {
  },
  methods: {
    ...mapActions(['setPersistenceStrategy']),
    checkAuth () {
      var self = this
      drive.initAuth(function () {
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(self.updateSigninStatus)
        self.updateSigninStatus(drive.isSignedIn())
      })
    },
    updateSigninStatus (isSignedIn) {
      var authorizeDiv = document.getElementById('authorize-div')
      if (isSignedIn) {
        this.setPersistenceStrategy('GOOGLE_DRIVE')
        authorizeDiv.style.display = 'none'
      } else {
        authorizeDiv.style.display = 'table'
      }
    },
    signInToDrive () {
      window.gapi.auth2.getAuthInstance().signIn()
    }
  },
  mounted: function () {
    $.holdReady(true)
    var self = this
    $.getScript('https://apis.google.com/js/api.js', function () {
      $.holdReady(false)
      window.gapi.load('auth2', self.checkAuth)
    })
  }
}
</script>

<style lang="less">
@import '../../static/less/colors.less';

#authorize-div {
  display: table;
  background-color: @color-back-raised2;
  @media screen and (max-width: 767px) {
    padding-left: 10px;
  }
  @media (min-width: 768px) {
    padding-left: 20px;
  }
  padding: 10px;
  padding-right: 20px;
  box-shadow: @shadow;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 0px 15px rgba(250, 240, 230, 0.5);
  }
}
.drive-text {
  display: table-cell;
  vertical-align: middle;
  width: 100%;
}
.drive-logo {
  @media screen and (max-width: 767px) {
    width: 50px;
    height: 50px;
    margin-right: 15px;
  }
  @media (min-width: 768px) {
    width: 80px;
    height: 80px;
    margin-right: 25px;
  }
  display: table-cell;
  float: left;
}
.drive-connect-label {
  @media screen and (max-width: 767px) {
    font-size: 14px;
  }
  @media (min-width: 768px) {
    font-size: 16px;
  }
  margin-bottom: 0px;
}
.drive-connect {
  @media screen and (max-width: 767px) {
    font-size: 23px;
  }
  @media (min-width: 768px) {
    font-size: 35px;
  }
  color: @color-actionable;
  margin-bottom: 0px;
}
</style>
