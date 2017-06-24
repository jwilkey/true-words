import $ from 'jquery'

export default {
  checkAuth (signinListener, callback) {
    const self = this

    function initialAuthCheck () {
      self.initAuth(function () {
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(signinListener)
        var currentStatus = window.gapi.auth2.getAuthInstance().isSignedIn.get()
        if (currentStatus) {
          callback()
          signinListener(currentStatus)
        }
      })
    }

    if (window.gapi && window.gapi.auth2) {
      initialAuthCheck()
    } else {
      $.holdReady(true)
      $.getScript('https://apis.google.com/js/api.js', function () {
        $.holdReady(false)
        window.gapi.load('auth2', initialAuthCheck)
      })
    }
  },
  initAuth (callback) {
    var CLIENT_ID = '105793449722-prnvpc85hufiqrn8vebatsbfk2aa7u2b.apps.googleusercontent.com'
    var SCOPE = 'https://www.googleapis.com/auth/drive.appdata'
    window.gapi.auth2.init({ client_id: CLIENT_ID, scope: SCOPE })
    .then(callback)
  },
  signIn () {
    return window.gapi.auth2.getAuthInstance().signIn()
  },
  signOut () {
    return window.gapi.auth2.getAuthInstance().signOut()
  },
  isSignedIn () {
    return window.gapi.auth2.getAuthInstance().isSignedIn.get()
  },
  driveToken () {
    try {
      var user = window.gapi.auth2.getAuthInstance().currentUser.get()
      var expiresIn = (user.getAuthResponse().expires_at - new Date().getTime()) / 1000 / 60
      if (expiresIn < 0) {
        return undefined
      }
      if (expiresIn < 10) {
        user.reloadAuthResponse()
      }
      return user.getAuthResponse().access_token
    } catch (e) {
      return undefined
    }
  },
  driveUser () {
    var profile = window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile()
    return {name: profile.getName(), imageUrl: profile.getImageUrl()}
  }
}
