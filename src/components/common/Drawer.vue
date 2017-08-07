<template>
  <div class="drawer">
    <div @click="toggleDrawer" class="drawer-header flex-row hi-bottom">
      <div class="flex-one">
        <slot name="title"></slot>
      </div>
      <i class="fa fa-chevron-right muted" :class="{'fa-rotate-90': !collapsed}"></i>
    </div>
    <div class="drawer-content" :class="{collapsed: collapsed}">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      collapsed: false
    }
  },
  props: ['expanded'],
  watch: {
    expanded (val) {
      this.collapsed = this.expanded === undefined ? false : this.expanded
    }
  },
  methods: {
    toggleDrawer () {
      this.collapsed = !this.collapsed
    }
  }
}
</script>

<style lang="less">
.drawer {
  .drawer-header {
    cursor: pointer;
    padding: 5px 10px;
    .fa-chevron-right {
      padding: 5px;
      transition: transform 0.3s;
    }
  }
  .drawer-content {
    padding-top: 10px;
    max-height: 10000px;
    transition: max-height 0.5s;
    overflow: hidden;
    &.collapsed {
      max-height: 0px;
    }
  }
}
</style>
