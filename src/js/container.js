import driveAuth from './helpers/drive-auth-helper'

var container = {
  authToken: '',
  platform: 'web',
  recentPersistentStrategy: undefined
}

function isWebView () {
  return /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent)
}

container.authHandler = {
  checkAuth (callback) {
    if (isWebView()) {
      window.location = 'truewords:drive:checkAuth'
    } else {
      driveAuth.checkAuth()
    }
  },
  signIn (strategy) {
    if (strategy !== undefined) {
      container.recentPersistentStrategy = strategy
    } else {
      strategy = container.recentPersistentStrategy
    }

    if (isWebView()) {
      if (strategy === 'GOOGLE_DRIVE') {
        window.location = 'truewords:drive:signIn'
      }
    } else {
      if (strategy === 'GOOGLE_DRIVE') {
        driveAuth.signIn()
      }
    }
  },
  signOut (strategy) {
    container.recentPersistentStrategy = undefined
    if (isWebView()) {
      if (strategy === 'GOOGLE_DRIVE') {
        window.location = 'truewords:drive:signOut'
      }
    } else {
      if (strategy === 'GOOGLE_DRIVE') {
        driveAuth.signOut()
      }
    }
  },
  isSignedIn (strategy) {
    if (isWebView()) {
      return true
    } else {
      if (strategy === 'GOOGLE_DRIVE') {
        return driveAuth.isSignedIn()
      }
    }
    return false
  },
  refreshAuthorization () {
    if (container.platform === 'web') {
      container.onAuthorizationExpired()
    }
  }
}

container.authHandler.isSessionExpired = function (strategy) {
  // if (strategy === 'GOOGLE_DRIVE') {
    // return $.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${container.authToken}`)
  // }
  // return strategy !== undefined && container.recentPersistentStrategy === strategy && !container.authHandler.isSignedIn(strategy)
  return false
}

window.twauth = function (token, username, imageUrl) {
  container.authToken = token
  container.user.name = username
  container.user.imageUrl = imageUrl
}

export default container
