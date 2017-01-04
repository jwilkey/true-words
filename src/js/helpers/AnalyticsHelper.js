export default {
  trackScreen (screenname) {
    window.ga('set', 'screenName', screenname)
    window.ga('send', 'screenview', {
      'screenName': screenname
    })
  },
  trackEvent (category, action, label, value) {
    window.ga('send', 'event', category, action, label, value)
  },
  attach (label, domElement) {
    var $ = window.$
    var self = this
    var category = 'AutoAttached'
    window.ga(function (tracker) {
      category = tracker.get('screenName')
    })
    $(domElement).find('button:not(.track), a:not(.track)').addClass('track').click(function () {
      if (label === undefined) {
        label = '#' + $(this).closest('[id]')[0].id
      }
      var detail = this.textContent || this.dataset.title
      self.trackEvent(category, 'click', label + '-' + detail)
    })
  }
}
