<template>
  <div class="titlebar theme-mid shadow">
    <div class="titlebar-item-group left">
      <a v-if="showLeft('close')" class="titlebar-item theme-mid" data-title="close" @click="onClose()"><span class="glyphicon glyphicon-remove"></span></a>
      <router-link v-if="showLeft('home')" data-title="home" class="titlebar-item theme-mid" to="/">
        <span class="glyphicon glyphicon-home"></span>
      </router-link>
      <a v-if="showLeft('back')" class="titlebar-item theme-mid" data-title="back" @click="onBack()"><span class="glyphicon glyphicon-menu-left"></span></a>
      <div v-if="showLeft('help')" class="titlebar-item theme-mid" data-title="help" @click="help()"><i class="fa fa-question-circle-o font-large"></i></div>
      <a v-for="title in customLeftButtons" class="titlebar-item theme-mid" @click="onSelect(title)">{{ title }}</a>
    </div>
    <div class="text-center title brand-font">
      {{ title }}
      <slot name="center"></slot>
    </div>
    <div class="titlebar-item-group right">
      <a v-if="showRight('close')" class="titlebar-item theme-mid" data-title="close" @click="onClose()"><span class="glyphicon glyphicon-remove"></span></a>
      <router-link v-if="showRight('home')" class="titlebar-item theme-mid" data-title="home" to="/"><span class="glyphicon glyphicon-home"></span></router-link>
      <a v-if="showRight('back')" class="titlebar-item theme-mid" @click="onBack()">BACK</a>
      <div v-if="showRight('help')" class="titlebar-item theme-mid" data-title="help" @click="help()"><i class="fa fa-question-circle-o font-large"></i></div>
      <a v-for="title in customRightButtons" class="titlebar-item theme-mid pull-right" @click="onSelect(title)">{{ title }}</a>
      <div class="titlebar-item">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  data () { return { } },
  computed: {
    customLeftButtons: function () {
      return (this.leftItems === undefined) ? [] : this.leftItems.filter(function (e) {
        return ['close', 'home', 'back', 'help'].indexOf(e) === -1
      })
    },
    customRightButtons: function () {
      return (this.rightItems === undefined) ? [] : this.rightItems.filter(function (e) {
        return ['close', 'home', 'back', 'help'].indexOf(e) === -1
      })
    }
  },
  components: { },
  methods: {
    showLeft (label) {
      return this.leftItems !== undefined && this.leftItems.indexOf(label) > -1
    },
    showRight (label) {
      return this.rightItems !== undefined && this.rightItems.indexOf(label) > -1
    },
    help () {
      this.onHelp !== undefined ? this.onHelp() : this.alert('Help coming soon!!!', 'ok')
    }
  },
  mounted () {
    $('#tasks-button').click(function () {
      $('.menubar').toggleClass('show')
    })
  },
  props: ['title', 'leftItems', 'rightItems', 'onHelp', 'onBack', 'onClose', 'onSelect']
}
</script>

<style lang="less">
@import '../../static/less/common.less';

body {
  padding-top: @titlebar-height;
}
</style>

<style lang="less" scoped>
@import '../../static/less/colors.less';
@import '../../static/less/common.less';

.title {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}
.titlebar {
  display: table;
  height: @titlebar-height;
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  letter-spacing: 1px;
  .titlebar-item-group {
    position: absolute;
    @media screen and (max-width: 767px) {
      padding-left: 7px;
      padding-right: 7px;
    }
    @media (min-width: 768px) {
      padding-left: 15px;
      padding-right: 15px;
    }
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
      // min-width: 35px;
      cursor: pointer;
      letter-spacing: 1px;
    }
  }
}
.titlebar-button.pull-right {
  // margin-left: 10px;
}
</style>
