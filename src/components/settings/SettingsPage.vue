<template>
  <div>
    <titlebar title="SETTINGS" :left-items="['home']"></titlebar>

    <div class="container substance">
      <card title="FONT" subtitle="Adjust text" class="font-size">
        <div class="flex-row">
          <button @click="fontSize(-2)" class="btn callout-light flex-one" :class="{alt: font !== -2}">Aa</button>
          <button @click="fontSize(-1)" class="btn callout-light flex-one" :class="{alt: font !== -1}">Aa</button>
          <button @click="fontSize(0)" class="btn callout-light flex-one" :class="{alt: font !== 0}">Aa</button>
          <button @click="fontSize(1)" class="btn callout-light flex-one" :class="{alt: font !== 1}">Aa</button>
          <button @click="fontSize(2)" class="btn callout-light flex-one" :class="{alt: font !== 2}">Aa</button>
        </div>
        <p class="sample">In the beginning was the Word, and the Word was with God, and the Word was God.</p>
      </card>

      <card title="THEME" subtitle="Choose a theme">
        <div class="theme-container">
          <p>Light</p>
          <div class="theme-light flex-row shadow-long" @click="setTheme('light-theme')">
            <div class="t-back"></div>
            <div class="t-mid"></div>
            <div class="t-hi"></div>
            <div class="t-callout"></div>
            <div class="t-callout-light"></div>
          </div>
          <hr class="hi-bottom" />
          <p>Dark</p>
          <div class="theme-dark flex-row shadow-long" @click="setTheme('dark-theme')">
            <div class="t-back"></div>
            <div class="t-mid"></div>
            <div class="t-hi"></div>
            <div class="t-callout"></div>
            <div class="t-callout-light"></div>
          </div>
        </div>
      </card>
      <a class="btn callout-light btn-block" href="mailto:help.truewords@gmail.com?subject=Feedback">Provide Feedback</a>
      <p class="muted app-info">App info: {{platform}}{{version}}</p>
    </div>
  </div>
</template>

<script>
import Titlebar from '../Titlebar'
import Card from '../Card'
import container from '../../js/container'
import $ from 'jquery'

export default {
  data () {
    return {
      font: 0
    }
  },
  components: { Titlebar, Card },
  computed: {
    platform () {
      return container.platform
    },
    version () {
      return container.appVersion ? ` ${container.appVersion}` : ''
    }
  },
  methods: {
    fontSize (size) {
      this.font = size
      $('html').removeClass('font-2 font-1 font1 font2')
      if (size !== 0) {
        $('html').addClass(`font${size}`)
      }
    },
    setTheme (theme) {
      $('html').removeClass('light-theme dark-theme')
      $('html').addClass(theme)
    }
  },
  mounted () {
    if ($('html').hasClass('font-2')) { this.font = -2 }
    if ($('html').hasClass('font-1')) { this.font = -1 }
    if ($('html').hasClass('font1')) { this.font = 1 }
    if ($('html').hasClass('font2')) { this.font = 2 }
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors';
@import '../../../static/less/flex';

.font-size {
  button {
    border-radius: 0px;
    border-right: none;
    &:first-child {
      font-size: 14px;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    &:nth-child(2) {
      font-size: 16px;
    }
    &:nth-child(4) {
      font-size: 20px;
    }
    &:last-child {
      font-size: 22px;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      border-right: solid 1px;
    }
  }
  .sample {
    margin-bottom: 0;
    padding-top: 8px;
  }
}

.theme-slab {
  width: 15px;
  height: 40px;
  flex: 1;
}
.t-back {
  .theme-slab;
}
.t-mid {
  .theme-slab;
}
.t-hi {
  .theme-slab;
}
.t-callout {
  .theme-slab;
}
.t-callout-light {
  .theme-slab;
}
.theme-light {
  cursor: pointer;
  &:hover {
    box-shadow: 0px 0px 5px 2px @color-highlight-blue;
  }
  & > .t-back { background-color: @color-back; }
  & > .t-mid { background-color: @color-back-raised; }
  & > .t-hi { background-color: @color-back-raised2; }
  & > .t-callout { background-color: @color-callout; }
  & > .t-callout-light { background-color: @color-callout-light; }
}
.theme-dark {
  cursor: pointer;
  &:hover {
    box-shadow: 0px 0px 5px 2px @color-highlight-blue;
  }
  .t-back { background-color: @color-dark-back; }
  .t-mid { background-color: @color-dark-back-raised; }
  .t-hi { background-color: @color-dark-back-raised2; }
  .t-callout { background-color: @color-dark-callout; }
  .t-callout-light { background-color: @color-dark-callout-light; }
}
.app-info {
  text-align: right;
  margin-top: 20px;
}
</style>
