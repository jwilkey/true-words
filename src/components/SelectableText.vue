<template>
  <div id="content" class="container">
    <div class="row">
      <div v-if="words" id="text" class="col-sm-12">
        <span :key="index" v-for="(word, index) in words" :id="'word-' + index" :data-index="index" @click="selected($event.target)" class="word">{{ word.text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import $ from 'jquery'

export default {
  data () {
    return {
      selectedWordIndex: undefined,
      selectionStartIndex: undefined,
      selectionEndIndex: undefined,
      initialSelection: undefined
    }
  },
  computed: {
    ...mapGetters({words: 'getCurrentWords'})
  },
  props: ['delegate'],
  methods: {
    selected (element) {
      var wordIndex = parseInt(element.id.substring(5))
      if (this.selectedWordIndex !== undefined) {
        if (this.selectionStartIndex && this.selectionEndIndex) {
          this.adjustSelectionRange(element, wordIndex)
        } else if (wordIndex === this.selectedWordIndex) {
          $(element).removeClass('selected')
          this.resetSelectedIndexes
        } else {
          this.createSelectionRange(element, wordIndex)
        }
        this.cleanUpSelectionRange(element, wordIndex)
      } else {
        $(element).addClass('selected')
        this.selectedWordIndex = wordIndex
      }
      if (this.delegate && this.delegate.onSelect) {
        this.delegate.onSelect($(element).text(), $(element).data('index'))
      }
    },
    createSelectionRange (element, wordIndex) {
      var previousWord = $('#word-' + this.selectedWordIndex)
      if (wordIndex < this.selectedWordIndex) {
        $(element).addClass('start selected')
        previousWord.addClass('end selected')
        this.selectionStartIndex = wordIndex
        this.selectionEndIndex = this.selectedWordIndex
      }
      if (wordIndex > this.selectedWordIndex) {
        $(element).addClass('end selected')
        previousWord.addClass('start selected')
        this.selectionStartIndex = this.selectedWordIndex
        this.selectionEndIndex = wordIndex
      }
    },
    adjustSelectionRange (element, wordIndex) {
      if (wordIndex < this.selectionStartIndex) {
        $('.start.selected').removeClass('start')
        $(element).addClass('start selected')
        this.selectionStartIndex = wordIndex
      } else if (wordIndex === this.selectionStartIndex) {
        $(element).nextUntil(':not(.selected)').addBack().removeClass('selected start end')
        this.resetSelectedIndexes()
      } else if (wordIndex < this.selectionEndIndex) {
        $('.end.selected').removeClass('end selected')
        $(element).addClass('end selected')
        this.selectionEndIndex = wordIndex
      } else if (wordIndex > this.selectionEndIndex) {
        $('.end.selected').removeClass('end selected')
        $(element).addClass('end selected')
        this.selectionEndIndex = wordIndex
      }
    },
    cleanUpSelectionRange (element, wordIndex) {
      $('.selected.start').nextUntil('.selected.end').addClass('selected')
      $('.selected.end').nextUntil(':not(.selected)').removeClass('selected')
      if (this.selectionStartIndex !== undefined && this.selectionEndIndex !== undefined && (this.selectionStartIndex === this.selectionEndIndex)) {
        this.selectedWordIndex = wordIndex
        this.selectionStartIndex = undefined
        this.selectionEndIndex = undefined
        $(element).removeClass('start end')
      }
    },
    selectedText () {
      return $('.selected').map(function () {
        return $.trim($(this).text())
      }).get().join(' ')
    },
    selectedWords () {
      var self = this
      return $('.selected').map(function () {
        return self.words[this.dataset.index]
      }).get()
    },
    highlightSelection (maintainSelection) {
      $('.selected').addClass('highlighted')
      if (maintainSelection === undefined || !maintainSelection) {
        $('.selected').removeClass('selected')
        this.resetSelectedIndexes()
      }
    },
    fillSelection (maintainSelection) {
      $('.selected').addClass('filled')
      if (maintainSelection === undefined || !maintainSelection) {
        $('.selected').removeClass('selected')
        this.resetSelectedIndexes()
      }
    },
    clearHighlight () {
      $('.word').removeClass('highlighted')
    },
    clearSelection () {
      $('.word').removeClass('selected start end')
      this.resetSelectedIndexes()
    },
    reset () {
      $('.word').removeClass('highlighted filled selected start end')
      this.resetSelectedIndexes()
    },
    resetSelectedIndexes () {
      this.selectedWordIndex = undefined
      this.selectionStartIndex = undefined
      this.selectionEndIndex = undefined
    }
  },
  mounted () {
    $('#content').on('touchstart mousedown', this.onTouchStart)
    $('#content').on('touchmove mousemove', this.onTouchMove)
    $('#content').on('touchend touchleave mouseup mouseleave', this.onTouchEnd)
  }
}

// function getPoint (e) {
//   return {
//     x: e.pageX ? e.pageX : e.originalEvent.pageX,
//     y: e.pageY ? e.pageY : e.originalEvent.pageY
//   }
// }
// function getElement (point) {
//   return document.elementFromPoint(point.x, point.y)
// }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../static/less/colors.less';
.word {
  float: left;
  color: white;
  font-size: 18px;
  background-color: @color-back-raised;
  margin-top: 3px;
  margin-bottom: 3px;
  border: solid 1px @color-back;
  padding: 5px;
  padding-left: 8px;
  padding-right: 8px;
  box-shadow: 0px -1px 2px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.word.selected {
  background-color: @color-selection1;
  color: @color-back;
  word-wrap: normal;
  box-shadow: none;
  border-radius: 0px;
  border-right: solid 1px #ff8;
  border-left: solid 1px transparent;
  border-top: solid 1px #ff8;
  border-bottom: solid 1px #ff8;
  &.start {
    border-bottom-left-radius: 6px;
    border-top-left-radius: 6px;
    border-left: solid 1px #ff8;
  }
  &.end {
    border-bottom-right-radius: 6px;
    border-top-right-radius: 6px;
    border-right: solid 1px #ff8;
  }
}
.word.highlighted {
  border-radius: 0px;
  border: solid 1px #ff8;
  &.start {
    border-bottom-left-radius: 6px;
    border-top-left-radius: 6px;
  }
  &.end {
    border-bottom-right-radius: 6px;
    border-top-right-radius: 6px;
  }
}
.word.filled {
  background-color: @color-callout;
}
</style>
