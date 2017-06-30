import $ from 'jquery'

const googleAuth = {
  authToken () {
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
  user () {
    var profile = window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile()
    return {name: profile.getName(), imageUrl: profile.getImageUrl()}
  }
}

googleAuth.signinCallback = function (isSignedIn) {
  if (isSignedIn) {
    window.twauth(googleAuth.authToken(), 'GOOGLE_DRIVE', googleAuth.user().name, googleAuth.user().imageUrl)
  } else {
    window.twdeauth()
  }
}

export default {
  checkAuth () {
    function initialAuthCheck () {
      var CLIENT_ID = '105793449722-prnvpc85hufiqrn8vebatsbfk2aa7u2b.apps.googleusercontent.com'
      var SCOPE = 'https://www.googleapis.com/auth/drive.appdata'
      window.gapi.auth2.init({ client_id: CLIENT_ID, scope: SCOPE })
      .then(() => {
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(googleAuth.signinCallback)
        var currentStatus = window.gapi.auth2.getAuthInstance().isSignedIn.get()
        if (currentStatus) {
          googleAuth.signinCallback(currentStatus)
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
  signIn () {
    return window.gapi.auth2.getAuthInstance().signIn()
  },
  signOut () {
    return window.gapi.auth2.getAuthInstance().signOut()
  },
  isSignedIn () {
    return window.gapi.auth2.getAuthInstance().isSignedIn.get()
  }
}
