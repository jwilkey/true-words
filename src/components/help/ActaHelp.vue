<template>
  <div class="container help-content">
    <div>
      <p><i>It is just you and God. Be specific and be personal.</i></p>
      <hr />
      <p>ACTA is an acronym. Each letter serves as a theme for you to pray as you reflect on the passage.</p>
      <p><strong>A</strong>dore - God, I adore you for...</p>
      <p><strong>C</strong>onfess - God, I have sinned by...</p>
      <p><strong>T</strong>hank - God, thank you for...</p>
      <p><strong>A</strong>sk - God, would you please...</p>
      <p>Record as many short prayers as you wish. When finished, {{selectWord.toLowerCase()}} 'FINISHED'.</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  components: { },
  props: [],
  computed: {
    selectWord: function () {
      return (typeof window.orientation !== 'undefined') ? 'Tap' : 'Select'
    },
    selectWordActive: function () {
      return (typeof window.orientation !== 'undefined') ? 'Tapping' : 'Selecting'
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors';

.help-content {
  strong {
    background-color: @color-help;
    border-radius: 4px;
    padding: 1px 7px;
    margin-right: 2px;
    color: @color-help-back;
  }
}
</style>
