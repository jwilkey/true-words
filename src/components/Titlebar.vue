<template>
  <div class="titlebar">
    <div class="titlebar-item-group left">
      <a v-if="showLeft('close')" class="titlebar-item" @click="onClose()"><span class="glyphicon glyphicon-remove"></span></a>
      <router-link v-if="showLeft('home')" class="titlebar-item" to="/">
        <span class="glyphicon glyphicon-home"></span>
      </router-link>
      <a v-if="showLeft('back')" class="titlebar-item" @click="onBack()"><span class="glyphicon glyphicon-menu-left"></span></a>
      <div v-if="showLeft('help')" class="titlebar-item" @click="help()"><span class="glyphicon glyphicon-question-sign"></span></div>
    </div>
    <div class="text-center title">
      {{ title }}
      <slot name="center"></slot>
    </div>
    <div class="titlebar-item-group right">
      <a v-if="showRight('close')" class="titlebar-item" @click="onClose()"><span class="glyphicon glyphicon-remove"></span></a>
      <router-link v-if="showRight('home')" class="titlebar-item" to="/"><span class="glyphicon glyphicon-home"></span></router-link>
      <a v-if="showRight('back')" class="titlebar-item" @click="onBack()">BACK</a>
      <div v-if="showRight('help')" class="titlebar-item" @click="help()"><span class="glyphicon glyphicon-question-sign"></span></div>
      <p class="titlebar-item">
        <slot name="right"></slot>
      </p>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  data () { return { } },
  components: { },
  methods: {
    showLeft (label) {
      return this.leftItems !== undefined && this.leftItems.indexOf(label) > -1
    },
    showRight (label) {
      return this.rightItems !== undefined && this.rightItems.indexOf(label) > -1
    },
    help () {
      this.onHelp !== undefined ? this.onHelp() : window.alert('Help coming soon!!!')
    }
  },
  mounted () {
    $('#tasks-button').click(function () {
      $('.menubar').toggleClass('show')
    })
  },
  props: ['title', 'leftItems', 'rightItems', 'onHelp', 'onBack', 'onClose']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../static/less/colors.less';
.title {
  font-family: serif;
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
