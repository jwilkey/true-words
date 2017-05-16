<template>
  <div id="content" class="container">
    <div class="row clearfix">
      <div v-if="words" id="text" class="col-sm-12 clearfix">
        <span :key="index" v-for="(word, index) in words" :id="'word-' + index" :data-index="index" :data-id="wordId(word)" @click="selected($event.target)" class="word">{{ word.text }}</span>
      </div>
    </div>
    <touchpad v-if="selectedElement" id="touchpad" :on-move="onTouchpadMove" :on-tap="onTouchpadTap" :on-double-tap="onTouchpadDoubleTap"></touchpad>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import $ from 'jquery'
import Touchpad from './common/Touchpad'

export default {
  data () {
    return {
      allowsMultipleSelection: true,
      selectedWordIndex: undefined,
      selectionStartIndex: undefined,
      selectionEndIndex: undefined,
      selectedElement: undefined,
      currentSelectionIndex: 0,
      initialSelection: undefined
    }
  },
  components: { Touchpad },
  computed: {
    ...mapGetters({words: 'getCurrentWords'})
  },
  props: ['delegate'],
  methods: {
    wordId (word) {
      return word.verse + '-' + word.index
    },
    selected (element) {
      this.allowsMultipleSelection ? this.handleMultiSelection(element) : this.handleSingleSelection(element)
    },
    handleMultiSelection (element) {
      if (element.dataset.selection) {
        var $selection = $(`.word[data-selection="${element.dataset.selection}"]`)
        this.unfill($selection)
        $selection.addClass('selected')
      } else {
        $(element).addClass('selected')
      }
      this.selectedElement = element
    },
    handleSingleSelection (element) {
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
        var attributes = {highlighted: $(element).hasClass('highlighted'), filled: $(element).hasClass('filled')}
        this.delegate.onSelect($(element).text(), $(element).data('index'), attributes)
      }
    },
    registerSelection () {
      this.currentSelectionIndex += 1
      $('.selected').attr('data-selection', this.currentSelectionIndex)
    },
    setFilled (words) {
      var self = this
      words.forEach(function (word) {
        self.fill($('.word[data-id=' + self.wordId(word) + ']'))
      })
    },
    clearFill (words) {
      var self = this
      words.forEach(function (word) {
        self.unfill($('.word[data-id=' + self.wordId(word) + ']'))
      })
    },
    highlightWords (words) {
      var self = this
      words.forEach(function (word) {
        $('.word[data-id=' + self.wordId(word) + ']').addClass('highlighted')
      })
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
    fill ($elements) {
      $elements.addClass('filled')
      if ($elements.length > 1) {
        $elements.first().addClass('fill-start')
        $elements.last().addClass('fill-end')
      }
    },
    unfill ($elements) {
      $elements.removeClass('filled fill-start fill-end')
    },
    fillSelection (maintainSelection) {
      this.fill($('.selected'))
      if (maintainSelection === undefined || !maintainSelection) {
        $('.selected').removeClass('selected')
        this.resetSelectedIndexes()
      }
    },
    clearHighlight () {
      $('.word').removeClass('highlighted')
    },
    clearSelection () {
      $('.selected').removeAttr('data-selection')
      $('.selected').removeClass('selected start end')
      this.resetSelectedIndexes()
    },
    reset () {
      $('.word').removeClass('highlighted selected start end')
      this.unfill($('.word'))
      this.resetSelectedIndexes()
    },
    resetSelectedIndexes () {
      this.selectedWordIndex = undefined
      this.selectionStartIndex = undefined
      this.selectionEndIndex = undefined
    },
    onTouchpadMove (direction) {
      switch (direction) {
        case 'RIGHT':
          var $nextWord = $('.selected').next('.word')
          if (!$nextWord.hasClass('filled')) {
            $nextWord.addClass('selected')
          }
          break
        case 'LEFT':
          $('.selected').last().removeClass('selected')
          break
        case 'UP':
          var $prevWord = $('.selected').prev('.word')
          if (!$prevWord.hasClass('filled')) {
            $prevWord.addClass('selected')
          }
          break
        case 'DOWN':
          $('.selected').first().removeClass('selected')
          break
        default: return
      }
    },
    onTouchpadTap () {
      this.registerSelection()
      this.fillSelection()
      this.selectedElement = undefined
    },
    onTouchpadDoubleTap () {
      this.clearSelection()
      this.selectedElement = undefined
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../static/less/colors.less';
@import '../../static/less/words.less';
@import '../../static/less/flex.less';

#content {
  position: relative;
  height: 100%;
}
.row {
  height: 100%;
}
#text {
  height: 100%;
}
#touchpad {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: inset 1px 0px 10px @color-highlight-blue;
}
</style>
