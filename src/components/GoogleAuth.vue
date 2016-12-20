<template>
  <div class="row clearfix">
    <div id="authorize-div" style="display: none">
      <p class="text-center">Use Google Drive to save your studies</p>
      <button id="authorize-button" class="btn btn-primary btn-block" @click="handleAuthClick(event)">Connect Google Drive</button>
      <hr/>
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
        authorizeDiv.style.display = 'inline'
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
body {
  padding-top: 55px
}
</style>
