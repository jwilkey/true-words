<template>
  <div class="selector-bar flex-row">
    <div @click="previous" class="navigate-adjective callout-light hover"><i class="fa fa-chevron-left" /></div>
    <div @click="click" class="flex-two finish-button callout-light hover">{{ clickTitle }}</div>
    <div @click="next" class="navigate-adjective callout-light hover"><i class="fa fa-chevron-right" /></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: ['next', 'previous', 'click', 'clickTitle']
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors.less';
@import '../../../static/less/flex.less';

.selector-bar {
  border-radius: 6px;
  overflow: hidden;
  text-align: center;
  font-size: 18px;
  margin-bottom: 5px;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.finish-button {
  padding: 7px 10px;
  text-shadow: 1px 0px 1px black;
  margin: 0 3px;
  font-weight: bolder;
  letter-spacing: 1.5px;
  cursor: pointer;
}
.navigate-adjective {
  min-width: 90px;
  text-shadow: 1px 0px 1px black;
  padding: 7px 10px;
  cursor: pointer;
  .hint {
    font-size: 14px;
  }
}
</style>
