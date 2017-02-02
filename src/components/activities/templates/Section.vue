<template>
  <div class="section">
    <div class="section-title editing">
      <div class="section-item" @click="editSection($event.target)">
        {{ prefix }}{{ section.title }} <span v-if="section.title" class="word-range">{{ section.rangeDescription() }}</span>
      </div>

      <input class="section-edit" type="text" placeholder="type here" :value="section.title" @blur="applySectionEdit(section, $event.target)" />

      <div v-if="allowsSubSections" class="action">
        <div class="action-button" @click="deleteAction(section, index)">
          <img class="svg close-button" src="/static/images/close.svg" />
        </div>
      </div>
    </div>

    <div class="subsections">
      <div v-if="allowsSubSections" v-for="subsection in section.subSections.items">
        <subsection-vue :section="subsection" :allows-sub-sections="false" :delete="deleteSubsection" :prefix="'• '"></subsection-vue>
      </div>
      <div v-if="allowsSubSections" class="temp">
        <input type="text" placeholder="type a supporting idea (optional)..." @change="addSubSection(section, $event.target)"  />
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import images from '../../../js/images'
import { Section } from '../../../js/models/ActivityData'

export default {
  name: 'subsection-vue',
  data () {
    return { }
  },
  props: ['section', 'index', 'allowsSubSections', 'delete', 'prefix'],
  computed: {
  },
  components: { },
  methods: {
    deleteAction (section, index) {
      this.delete(section, index)
    },
    addSubSection (section, input) {
      section.addSubSection(new Section(input.value))
      input.value = ''
      this.$nextTick(function () { images.svgs() })
    },
    editSection (sectionDiv) {
      if ($(sectionDiv).closest('.section.readonly').length === 0) {
        $(sectionDiv).closest('.section-title').addClass('editing')
        $(sectionDiv).siblings('.section-edit').focus()
      }
    },
    applySectionEdit (section, input) {
      if (input.value.length > 0) {
        section.title = input.value
        $(input).closest('.section-title').removeClass('editing')
      }
    },
    deleteSubsection () {
      throw new Error('Delete subsections not implemented')
    }
  },
  mounted () {
    if ($(this.$el).closest('.subsections').length === 0) {
      $(this.$el).find('.section-title:first').addClass('root')
    }
    if (this.section.title.length > 0) {
      $(this.$el).find('.section-title').removeClass('editing')
    }
    this.$nextTick(function () { images.svgs() })
  }
}
</script>

<style lang="less" scoped>
@import '../../../../static/less/colors.less';

.section {
  font-family: serif;
  .section-title {
    display: table;
    width: 100%;
    border-bottom: solid 1px @color-back-raised;
    padding-top: 5px;
    padding-bottom: 8px;
    .section-item {
      display: table-cell;
      vertical-align: middle;
      cursor: pointer;
    }
    .section-edit {
      display: none;
    }
  }
  .section-title.root {
    border-bottom: solid 1px @color-callout;
    font-size: 18px;
    text-shadow: 1px 1px @color-back-raised2;
    letter-spacing: 1px;
  }
  .section-title.editing {
    .section-item {
      display: none;
    }
    .section-edit {
      display: table-cell;
    }
  }
  .section-edit, .temp>input {
    display: table-cell;
    vertical-align: middle;
    width: 100%;
    height: 100%;
    padding: 0;
    border: none;
    background-color: transparent;
    outline: none;
  }
  .word-range {
    color: @color-deemphasize;
    font-size: 13px;
  }
  .action {
    display: table-cell;
    vertical-align: middle;
    width: 48px;
    height: 30px;
    .action-button {
      width: 30px;
      height: 30px;
      float: right;
    }
  }
  .subsections {
    padding-left: 10px;
    .temp {
      padding-top: 5px;
      padding-bottom: 8px;
      border-bottom: solid 1px @color-back-raised;
    }
  }
}
.section.readonly {
  .section-edit, .action, .temp {
    display: none;
    cursor: default;
  }
  .section-item {
    cursor: auto;
  }
}
</style>
