<template>
  <div class="container help-content">
    <div class="clearfix">
      <p>Place each of the words from the passage in 1 of 4 buckets/categories: People, Places, Things, or Other.</p>
      <div class="help-buckets">
        <div class="third back-orange">PEOPLE</div>
        <div class="third back-purple">PLACES</div>
        <div class="third back-red">THINGS</div>
        <div class="back-dark">OTHER</div>
      </div>
      <p>• To place a word in one of these buckets, drag the current <span class="current-word">word</span> into the corresponding bucket, or simply tap the bucket.</p>
      <p>• "OTHER" refers to any word that is not a person, place or thing.</p>
      <p>• The activity is completed once you have placed every word in a bucket.</p>
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
  methods: {
    isSelected: function (index) {
      return [4, 10, 11, 12].indexOf(index) !== -1
    },
    isStart: function (index) {
      return index === 10
    },
    isEnd: function (index) {
      return index === 12
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors.less';
.help-buckets {
  margin-top: 10px;
  margin-bottom: 10px;
}
.third {
  width: 33.33333%;
  float: left;
  color: white;
  border: solid 1px @color-border;
  text-align: center;
  letter-spacing: 2px;
  font-size: 19px;
}
.back-dark {
  background-color: @color-back-raised;
  color: white;
  border: solid 1px @color-border;
  text-align: center;
  letter-spacing: 2px;
  font-size: 19px;
}
.current-word {
  color: @color-back;
  background-color: @color-selection1;
  border-radius: 4px;
  padding-left: 5px;
  padding-right: 5px;
  box-shadow: @shadow;
}
</style>
