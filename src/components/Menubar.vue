<template>
  <titlebar title="ACTIVITY"></titlebar>

  <div class="menubar">
    <button class="btn btn-default pull-right">Start over</button>
  </div>
</template>


<style lang="less" scoped>
.menubar {
  visibility: hidden;
  overflow: hidden;
  position: fixed;
  top: 0px;
  width: 100%;
  z-index: 99;
  background-color: #330910;
  padding: 5px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.9);
  transition: visibility 1s, top 0.15s linear;
  &.show {
    visibility: visible;
    top: 45px;
  }
}
</style>
