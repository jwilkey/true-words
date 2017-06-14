<template>
  <div>
    <titlebar title="BIBLE CHOOSER" :left-items="['close']" :on-close="closePressed" :on-help="helpPressed"></titlebar>

    <div class="container">
      <h1 @click="bibleSelected('ESV')" class="text-center theme-mid hover">ESV</h1>
      <h1 @click="bibleSelected('NASB')" class="text-center theme-mid hover">NASB</h1>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Titlebar from '../components/Titlebar'

export default {
  data () {
    return { }
  },
  computed: {
    ...mapGetters(['getCurrentBible'])
  },
  components: {
    Titlebar
  },
  methods: {
    closePressed () {
      this.$router.back()
    },
    bibleSelected (bible) {
      this.setCurrentBible(bible)
      this.$router.back()
    },
    ...mapActions(['setCurrentBible'])
  },
  mounted () {
  }
}
</script>

<style lang="less">
@import '../../static/less/colors.less';
body {
  padding-top: 55px;
}
h1 {
  font-family: "Homizio";
  letter-spacing: 3px;
  padding: 15px;
  transition: background-color 0.3s;
}
</style>
