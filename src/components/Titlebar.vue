<template>
  <div class="titlebar">
    <div class="titlebar-item-group left">
      <div v-for="item in leftItems" :is="item"></div>
    </div>
    <div class="text-center">
      {{ title }}
      <slot name="center"></slot>
    </div>
    <div class="titlebar-item-group right">
      <div v-for="item in rightItems" :is="item"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  components: {
    'close': {
      template: '<a class="titlebar-item" @click="onClose()"><span class="glyphicon glyphicon-remove"></span></a>',
      methods: {
        onClose () {
          this.$parent.onClose()
        }
      }
    },
    'home': {
      template: '<a class="titlebar-item" v-link="\'/\'"><span class="glyphicon glyphicon-home"></span></a>'
    },
    'back': {
      template: '<a class="titlebar-item" @click="onBack()"><span class="glyphicon glyphicon-menu-left"></span></a>',
      methods: {
        onBack () {
          this.$parent.onBack()
        }
      }
    },
    'help': {
      template: '<div class="titlebar-item" @click="help()"><span class="glyphicon glyphicon-question-sign"></span></div>',
      methods: {
        help () {
          this.$parent.onHelp !== undefined ? this.$parent.onHelp() : window.alert('Help coming soon!!!')
        }
      }
    }
  },
  methods: {
  },
  props: ['title', 'leftItems', 'rightItems', 'onHelp', 'onBack', 'onClose']
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
.title {
  font-family: serif;
  font-size: 16px;
  letter-spacing: 3px;
}

.titlebar {
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  color: #eee;
  background-color: @color-back;
  padding-top: 10px;
  padding-bottom: 10px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.9);;
  font-family: serif;
  font-size: 16px;
  letter-spacing: 3px;
  .titlebar-item-group {
    position: absolute;
    padding-left: 15px;
    padding-right: 15px;
    height: 100%;
    top: 50%;
    &.left > * {
      float: left;
    }
    &.right {
      right: 0;
      * {
        float: right;
      }
    }
    .titlebar-item {
      transform: translateY(-50%);
      text-align: center;
      padding: 10px;
      min-width: 35px;
      box-shadow: @shadow;
    }
  }
}
.titlebar-button.pull-right {
  margin-left: 10px;
}
</style>
