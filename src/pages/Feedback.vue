<template>
  <div id="feedback">
    <titlebar title="FEEDBACK" :left-items="['close']" :on-close="closePressed"></titlebar>

    <div class="flex-v">
      <div class="flex-1">
        <div class="container">
          <form action="https://script.google.com/macros/s/AKfycbzIzYwMtkH4ZLfW0O0mho8R1PN_BsuQBdWsgoNULFB2DGUKSzw/exec?callback=submitDone" method="post" target="feedback_iframe" v-on:submit="submit()">
            <p class="muted">Thank you for providing feedback:</p>
            <div class="form-group">
              <input name="user" type="hidden" :value="user" />
            </div>
            <div class="form-group">
              <input name="ua" type="hidden" :value="useragent" />
            </div>
            <div class="form-group">
              <input name="message" class="form-control feedback-input" type="text" />
            </div>
            <button type="submit" class="btn btn-actionable">SUBMIT</button>
          </form>
        </div>

        <iframe id="feedback_iframe" name="feedback_iframe" src="https://google.com"></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import Titlebar from '../components/Titlebar'
import { mapGetters } from 'vuex'
import $ from 'jquery'

export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['getUser']),
    user: function () {
      return this.getUser !== undefined ? this.getUser.name : 'anonymous'
    },
    useragent: function () {
      return window.navigator.userAgent
    }
  },
  components: {
    Titlebar
  },
  methods: {
    closePressed () {
      this.$router.back()
    },
    submit () {
      this.$router.back()
    }
  },
  mounted () {
    $('.feedback-input').focus()
  }
}
</script>

<style lang="less">
@import '../../static/less/colors.less';
body {
  padding-top: 55px;
}
#feedback {
  height: 100%;
  && {
    height: 100%;
  }
}
.feedback-input {
  background-color: transparent;
  border: solid 1px @color-callout-light;
}
#feedback_iframe {
  display: none;
}
</style>
