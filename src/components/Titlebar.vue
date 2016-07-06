<template>
  <div class="titlebar">
    <div class="titlebar-item col-xs-3 text-left"><a v-link="'/'"><span class="glyphicon glyphicon-home"></span></a></div>
    <div id="title" class="titlebar-item col-xs-6 text-center">{{ title }}</div>
    <div class="titlebar-item col-xs-3 text-right">
      <span class="glyphicon glyphicon-question-sign"></span>
      <div id="tasks-button" class="titlebar-button pull-right"><span class="glyphicon glyphicon-tasks"></span></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: ['title']
}

import $ from 'jquery'

$(document).ready(function () {
  $('#tasks-button').click(function () {
    $('.menubar').toggleClass('show')
  })
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../static/less/colors.less';
@import '../../static/less/titlebar.less';
</style>
