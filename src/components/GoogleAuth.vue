<template>
  <div id="authorize-div" class="clearfix" style="display: none" @click="handleAuthClick(event)">
    <img class="drive-logo" src="../assets/drive.png" />
    <div class="drive-text">
      <p class="drive-connect-label">Use Google Drive to save your studies</p>
      <p class="drive-connect">Sign in using Google</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

var gapi

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
      gapi = window.gapi
      gapi.auth.authorize({ 'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate': true }, this.handleAuthResult)
    },
    handleAuthClick (event) {
      gapi.auth.authorize({client_id: CLIENT_ID, scope: SCOPES, immediate: false}, this.handleAuthResult)
      return false
    },
    handleAuthResult (authResult) {
      var authorizeDiv = document.getElementById('authorize-div')
      if (authResult && !authResult.error) {
        this.setPersistenceStrategy('GOOGLE_DRIVE')
        authorizeDiv.style.display = 'none'
      } else {
        authorizeDiv.style.display = 'table'
      }
    }
  },
  mounted: function () {
    this.lib = 'https://apis.google.com/js/client.js?onload=initDrive'

    var vm = this
    window.initDrive = function () {
      vm.checkAuth()
    }

    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = this.lib
    document.body.appendChild(script)
  }
}

var CLIENT_ID = '105793449722-prnvpc85hufiqrn8vebatsbfk2aa7u2b.apps.googleusercontent.com'
var SCOPES = ['https://www.googleapis.com/auth/drive.appdata']
</script>

<style lang="less">
@import '../../static/less/colors.less';

#authorize-div {
  display: table;
  background-color: @color-back-raised2;
  padding: 10px;
  padding-left: 20px;
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
  display: table-cell;
  width: 80px;
  height: 80px;
  float: left;
  margin-right: 25px;
}
.drive-connect-label {
  margin-bottom: 0px;
}
.drive-connect {
  font-size: 34px;
  color: @color-actionable;
  margin-bottom: 0px;
}
</style>
