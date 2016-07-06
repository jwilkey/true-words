<template>
  <div class="modal-container">
  </div>
</template>

<script>
export default {
  components: {
  },
  vuex: {
    actions: {
    }
  }
}
</script>

<style lang="less">
.modal-container {
  display: none;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px;
  &.show {
    display: block;
  }
}
</style>
