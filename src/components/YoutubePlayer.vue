<template>
  <div class="embed-responsive embed-responsive-16by9">
    <iframe v-if="videoId" class="embed-responsive-item" :src="url" frameborder="0" allowfullscreen></iframe>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {
    url () {
      return `https://www.youtube.com/embed/${this.videoId}?rel=0`
    }
  },
  props: ['videoId']
}
</script>

<style lang="less" scoped>
</style>
