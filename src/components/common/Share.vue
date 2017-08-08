<template>
  <div class="share-view theme-mid shadow-top" :class="{show}">
    <p class="share-label font-larger callout-light shadow">Share this app! <a @click="done" class="pull-right mid-left">cancel</a></p>
    <social-sharing v-if="version('1.0.1')" url="https://truewordsapp.com" title="You can study the Bible. Here's how." inline-template>
      <div class="share-buttons">
        <network network="facebook">
          <button class="btn btn-share theme-hi shadow"><i class="fa fa-facebook fa-2x"></i><span class="font-smaller">Facebook</span></button>
        </network>
        <network network="twitter">
          <button class="btn btn-share theme-hi shadow"><i class="fa fa-twitter fa-2x"></i><span class="font-smaller">Twitter</span></button>
        </network>
        <network network="googleplus">
          <button class="btn btn-share theme-hi shadow"><i class="fa fa-google-plus fa-2x"></i><span class="font-smaller">Google +</span></button>
        </network>
        <network network="reddit">
          <button class="btn btn-share theme-hi shadow"><i class="fa fa-reddit fa-2x"></i><span class="font-smaller">Reddit</span></button>
        </network>
      </div>
    </social-sharing>
    <p v-else class="text-center">Update True Words to enable this feature</p>
  </div>
</template>

<script>
import container from '../../js/container'

export default {
  data () {
    return {
    }
  },
  props: ['show', 'done'],
  computed: {
    isMobile () {
      return container.isMobile()
    }
  }
}
</script>

<style lang="less">
.share-buttons {
  width: 100%;
  padding: 10px 15px;
  overflow-x: scroll;
  display: inline-block;
  white-space: nowrap;
}
.btn-share {
  color: #000711;
  margin-right: 3px;
  min-width: 80px;
  padding-top: 15px;
  background-color: transparent;
  i {
    display: block;
    margin-bottom: 5px;
  }
}
</style>

<style lang="less" scoped>
.share-view {
  position: fixed;
  z-index: 1000;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateY(100%);
  padding-bottom: 15px;
  transition: transform 0.3s;
  transform-origin : 50% 100%;
  &.show {
    transform: translateY(0%);
  }
  .share-label {
    padding: 15px;
    a { padding-left: 10px; }
  }
}
</style>
