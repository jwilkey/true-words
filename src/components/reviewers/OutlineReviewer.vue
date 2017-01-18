<template>
  <div v-if="data !== undefined" class="flex-v">
    <div class="flex-1">
      <div class="container content">
        <div class="row section-container" :key="sectionIndex" v-for="(section, sectionIndex) in data.collection.items">
          <section-vue class="section-content col-xs-12 readonly" :section="section" :index="sectionIndex" :allows-sub-sections="true"></section-vue>
        </div>
      </div>
    </div>

    <div class="actionbar-flex">
      <button @click="donePressed()" class="btn btn-lg btn-primary btn-block">DONE</button>
    </div>
  </div>
</template>

<script>
import SectionVue from '../activities/templates/Section'

export default {
  data () { return { } },
  computed: {
  },
  components: { SectionVue },
  props: ['data'],
  methods: {
    donePressed: function () {
      this.$router.replace('/activities')
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors.less';
</style>
