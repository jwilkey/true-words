<template>
  <div class="help-content">
    <div class="clearfix">
      <div class="video-help embed-responsive embed-responsive-16by9">
        <iframe src="https://www.youtube.com/embed/KNV93v4ey20?rel=0" frameborder="0" allowfullscreen></iframe>
      </div>

      <p>Place words from the passage in 1 of 3 buckets/categories: People, Places, or Things.</p>
      <div class="help-buckets">
        <div class="third font-large back-orange">PEOPLE</div>
        <div class="third font-large back-purple">PLACES</div>
        <div class="third font-large back-red">THINGS</div>
      </div>
      <br/>

    </br/>
      <p>Scroll the text left or right to <span class="selected">select</span> a different word.</p>
      <p>• Tap a bucket to place the selected word in the corresponding category, and the word will change to the matching color.</p>
      <p>• To clear a word from a category, select the <img id="buckets-help-clear" class="svg close-button" src="/static/images/close.svg" /> button that appears beneath the selected word.</p>
      <p>• Once you are finished categorizing words in the passage, select the 'DONE' button at the bottom of the screen.</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  components: { },
  props: [],
  computed: { },
  methods: { }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors.less';

.video-help {
  margin-bottom: 20px;
}
.help-buckets {
  margin-top: 10px;
  margin-bottom: 10px;
}
.third {
  width: 33.33333%;
  float: left;
  text-align: center;
  letter-spacing: 2px;
}
.selected {
  border-top: solid 2px @color-highlight-blue;
  border-bottom: solid 2px @color-highlight-blue;
}
#buckets-help-clear {
  height: 17px;
  width: 17px;
}
</style>
