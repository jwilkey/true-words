<template>
  <div>
    <titlebar title="SETTINGS" :left-items="['home']"></titlebar>

    <div class="container">
      <br />
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
    </div>
  </div>
</template>

<script>
import Titlebar from '../Titlebar'
import Card from '../Card'
import $ from 'jquery'

export default {
  data () {
    return {
    }
  },
  components: { Titlebar, Card },
  computed: {
  },
  methods: {
    setTheme (theme) {
      $('html').removeClass('light-theme dark-theme')
      $('html').addClass(theme)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors';
@import '../../../static/less/flex';

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
</style>
