<template>
  <div>
    <titlebar :title="getCurrentStudy.passage.description()" :left-items="['back']" :on-back="goBack">
      <div slot="right">
        <span class="verses-style glyphicon" :class="readingModeButtonClass" @click="toggleTextStyle()"></span>
      </div>
    </titlebar>

    <div class="flex-column vfull">
      <div class="flex-one substance">
        <div class="container verses" :class="{inline: readingMode === 'inline'}">
          <div v-for="verse in getCurrentStudy.verses" class="verse theme-mid hover" :data-verse="verse.number">
            <span class="verse-number"><span v-if="verse.number === 1">{{verse.chapter}}:</span>{{ verse.number }}</span><span class="verse-text">{{ verse.text }}</span>
          </div>
        </div>
      </div>

      <div class="bottombar">
        <div class="text-right">
          <router-link :to="readerContextPath" class="callout-light alt context-link">READ IN CONTEXT <i class="fa fa-arrow-right"></i></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Titlebar from '../Titlebar'

export default {
  data () {
    return {
      readingMode: 'list'
    }
  },
  components: {
    Titlebar
  },
  computed: {
    ...mapGetters(['getCurrentStudy']),
    readingModeButtonClass: function () {
      return this.readingMode === 'list' ? ['glyphicon-align-center'] : ['glyphicon-list']
    },
    readerContextPath () {
      const book = this.getCurrentStudy.passage.start.book
      const chapter = this.getCurrentStudy.passage.start.chapter
      return `/passage?book=${book}&chapter=${chapter}&read_only=true`
    }
  },
  methods: {
    goBack () {
      this.$router.back()
    },
    toggleTextStyle () {
      this.readingMode = this.readingMode === 'list' ? 'inline' : 'list'
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/app.less';
@import '../../../static/less/colors.less';
@import '../../../static/less/flex.less';

.container {
  padding: 2px;
}
.center-wrapper {
  height: 100%;
  text-align: center;
}
.center-wrapper:before {
  content: "";
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
.center {
  display: inline-block;
  vertical-align: middle;
}
.verses {
  .verse {
    padding: 1px 20px;
    font-size: 18px;
    margin-bottom: 2px;
    transition: background-color 0.3s;
  }
  .verse-number {
    color: #999;
    padding-right: 2px;
    vertical-align: super;
    font-size: 12px !important;
  }
  &.inline {
    padding-left: 20px;
    padding-right: 20px;
    .verse {
      display: inline;
      background-color: transparent;
      padding: 0px 7px 0px 0px;
      margin-bottom: 0px;
    }
  }
}
.context-link {
  padding: 5px;
  border-radius: 4px;
  i {
    padding: 0 5px;
  }
}
</style>
