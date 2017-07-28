<template>
  <div>
    <titlebar title="BIBLE CHOOSER" :left-items="['close']" :on-close="closePressed"></titlebar>

    <div class="container substance">
      <div v-for="version in versions" @click="bibleSelected(version.id)" class="version shadow-light text-center theme-mid hover">
        <h1>{{ version.display }}</h1>
        <p class="muted">{{ version.name }}</p>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Titlebar from '../components/Titlebar'

export default {
  data () {
    return {
      versions: [
        {display: 'ESV', name: 'English Standard Version', id: 'ESV'},
        {display: 'NASB', name: 'New American Standard Bible', id: 'NASB'},
        {display: 'RVR60 (Español)', name: 'Reina-Valera 1960', id: 'RVR60'}
      ]
    }
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
.version {
  margin-bottom: 10px;
  cursor: pointer;
}
h1 {
  font-family: "Homizio";
  letter-spacing: 3px;
  padding: 15px;
  padding-bottom: 0px;
  margin: 0px;
  transition: background-color 0.3s;
}
</style>
