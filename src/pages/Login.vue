<template>
  <div>
    <titlebar title="LOGIN" :left-items="['close']" :on-close="closePressed"></titlebar>

    <div class="container">
      <google-auth></google-auth>
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
    ...mapGetters(['getPersistor', 'getStudies'])
  },
  watch: {
    getPersistor: function (newPersistor, oldVal) {
      if (newPersistor.isLoggedIn()) {
        var self = this
        this.existingStudies.forEach(function (study) {
          newPersistor.saveStudy(study).done(function () {
            self.getStudies.push(study)
          })
        })
        this.closePressed()
      }
    }
  },
  components: {
    Titlebar, GoogleAuth
  },
  methods: {
    closePressed () {
      this.$router.replace(this.$route.query.referrer)
    }
  },
  mounted () {
    this.existingStudies = this.getStudies.slice(0)
  }
}
</script>

<style lang="less">
@import '../../static/less/colors.less';
body {
  padding-top: 55px;
}
h1 {
  font-family: serif;
  letter-spacing: 3px;
  padding: 15px;
  &:hover {
    background-color: @color-back-raised;
    color: @color-selection1;
  }
}
</style>
