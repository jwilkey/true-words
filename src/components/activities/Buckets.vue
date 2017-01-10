<template>
  <div id="buckets-container">
    <table class="buckets vthird">
      <tbody>
        <tr>
          <td data-index="0" class="bucket back-orange hthird dropzone" @click="assignToBucket(0)">{{ container(0).name }}</td>
          <td data-index="1" class="bucket back-purple hthird dropzone" @click="assignToBucket(1)">{{ container(1).name }}</td>
          <td data-index="2" class="bucket back-red hthird dropzone" @click="assignToBucket(2)">{{ container(2).name }}</td>
        </tr>
      </tbody>
    </table>

    <div id="buckets-neutral-zone" class="vthird">
      <div id="current-word" class="word draggable">{{ currentWord }}</div>
      <table class="text-previewer"><tbody>
        <tr class="buckets-indicator"><td>
          {{ currentWordIndex + 1 }} / {{ wordCount }}
        </td></tr>
        <tr><td>
          <div class="text-preview">
            <span :key="word.index" v-for="(word, index) in words" :id="'text-preview-' + index">{{ word.text }} </span>
          </div>
        </td></tr>
      </tbody>
    </table>
  </div>

  <table class="bucket vthird">
    <tbody>
      <tr>
        <td data-index="3" colspan=2 class="bucket dropzone" @click="assignToBucket(3)">{{ container(3).name }}</td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>
import buckets from '../../js/buckets.js'
import store from '../../../vuex/store'
import { mapGetters } from 'vuex'
import $ from 'jquery'
import activities from '../../js/activity'
import { WordSelection } from '../../js/models/ActivityData'

export default {
  data () {
    return {
      currentWordIndex: 0,
      activityType: activities.types.PeoplePlacesThings
    }
  },
  computed: {
    ...mapGetters({ words: 'getCurrentWords' }),
    currentWord: function () {
      return this.words[this.currentWordIndex].text
    },
    wordCount: function () {
      return this.words.length
    },
    priorTwoWords: function () {
      return 'test words'
    },
    nextTwoWords: function () {
      return 'more words'
    }
  },
  props: ['finish', 'data'],
  methods: {
    container (index) {
      return this.data.containers[index]
    },
    incrementCurrentWord () {
      this.currentWordIndex++
    },
    lineViewerFocusWord (index) {
      $('.text-preview > .current').removeClass('current')
      var wordSelector = '#text-preview-' + this.currentWordIndex
      $(wordSelector).addClass('current')
      var previewerCenter = $('.text-previewer').width() / 2
      var spanCenter = $(wordSelector).offset().left + ($(wordSelector).width() / 2)
      var diff = spanCenter - previewerCenter
      var currentLeft = parseInt($('.text-preview').css('margin-left'))
      $('.text-preview').css('margin-left', currentLeft - diff)
    },
    assignToBucket (bucketIndex) {
      var container = this.container(bucketIndex)
      var word = this.words[this.currentWordIndex]
      container.add(new WordSelection(word))

      if (this.currentWordIndex + 1 === this.words.length) {
        this.finish(this.activityType, this.data)
      } else {
        this.incrementCurrentWord()
        buckets.positionWord()
        this.lineViewerFocusWord(this.currentWordIndex)
      }
    }
  },
  components: {
  },
  store,
  mounted () {
    this.$nextTick(function () {
      buckets.setupDraggables()
      var v = this
      this.lineViewerFocusWord(this.currentWordIndex)
      buckets.setOnWordDrop(function (e) {
        var bucketIndex = $(e.target).data('index')
        v.assignToBucket(bucketIndex)
      })
    })
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors.less';
#buckets-container {
  height: 100%;
  width: 100%;
}
#buckets-neutral-zone {
  position: relative;
}
#current-word {
  z-index: 100;
  position: absolute;
}
.text-previewer {
  position: absolute;
  table-layout: fixed;
  height: 100%;
  width: 100%;
  tr {
    vertical-align: bottom;
  }
}
.text-preview {
  color: @color-deemphasize;
  overflow-x: hidden;
  white-space: nowrap;
  text-align: center;
  transition: margin-left 1.5s ease;
  span.current {
    color: @color-selection1;
  }
}
table {
  width: 100%;
  overflow-x: hidden;
}
.buckets {
  width: 100%;
  padding-left: 0px;
  padding-right: 0px;
  .bucket {
    height: 100%;
  }
}
.bucket {
  background-color: @color-back-raised;
  border: solid 1px @color-border;
  text-align: center;
  letter-spacing: 2px;
  font-size: 19px;
  user-select: none;
}
.buckets-indicator {
  color: @color-deemphasize;
  width: 100%;
  height: 30px;
  background-color: @color-back;
  border: none;
  vertical-align: top;
  td {
    padding-left: 10px;
  }
}
.draggable {
  float: left;
}
.word {
  color: @color-back;
  background-color: @color-selection1;
  font-size: 20px;
  border-radius: 4px;
  padding: 12px;
  box-shadow: @shadow;
  transition: background-color 0.3s;
}
.dropzone {
  border: solid 4px @color-back;
  transition: background-color 0.3s;
}
.drop-active {
  border: dashed 4px @color-back-raised2;
}
.drop-target {
  background-color: @color-callout;
  border-color: #fff;
  border-style: solid;
}
</style>
