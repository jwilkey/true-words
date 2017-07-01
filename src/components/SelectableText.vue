<template>
  <div id="content" class="container">
    <div class="row clearfix">
      <div v-if="words" id="selectable-text" class="col-sm-12 clearfix">
        <span :key="index" v-for="(word, index) in words" :id="'word-' + index" :data-index="index" :data-id="wordId(word)" @click="focused($event.target)" class="word">{{ word.text }}</span>
      </div>
    </div>
    <touchpad v-if="focusedElement" id="touchpad" :on-move="onTouchpadMove" :on-tap="onTouchpadTap" :on-double-tap="onTouchpadDoubleTap"></touchpad>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import $ from 'jquery'
import Touchpad from './common/Touchpad'
import { WordSelection } from '../js/models/ActivityData'
import { scrollToView } from '../js/polyfill'

export default {
  data () {
    return {
      focusedElement: undefined,
      currentSelectionIndex: 0,
      initialSelection: undefined
    }
  },
  components: { Touchpad },
  watch: {
    focusedElement (value) {
      if (this.delegate && this.delegate.onFocus) {
        this.delegate.onFocus(value !== undefined)
      }
    }
  },
  computed: {
    ...mapGetters({words: 'getCurrentWords'})
  },
  props: ['delegate'],
  methods: {
    wordId (word) {
      return word.verse + '-' + word.index
    },
    broadcastChange (wordSelection, operation) {
      if (this.delegate && this.delegate.onChange) {
        this.delegate.onChange(wordSelection, operation)
      }
    },
    focused (element) {
      if (element.dataset.selection) {
        var $selection = $(`.word[data-selection="${element.dataset.selection}"]`)
        this.unfill($selection)
        $selection.addClass('focused')
      } else {
        $(element).addClass('focused')
      }
      this.focusedElement = element
    },
    registerSelection () {
      this.currentSelectionIndex += 1
      $('.focused').attr('data-selection', this.currentSelectionIndex)
    },
    setSelected (words) {
      this.currentSelectionIndex += 1
      var self = this
      words.forEach(word => {
        var $wordElement = $('.word[data-id=' + self.wordId(word) + ']')
        self.fill($wordElement)
        $wordElement.attr('data-selection', this.currentSelectionIndex)
      })
    },
    muteSelectedWords () {
      $('.filled').addClass('mute-filled')
      $('.filled').removeClass('filled')
    },
    unmuteWords (words) {
      var self = this
      words.forEach(word => {
        var $elements = $('.word[data-id=' + self.wordId(word) + ']')
        $elements.removeClass('mute-filled')
        $elements.addClass('filled')
      })
    },
    clearFill (words) {
      var self = this
      words.forEach(word => {
        var $elements = $('.word[data-id=' + self.wordId(word) + ']')
        self.unfill($elements)
        $elements.removeAttr('data-selection')
      })
    },
    highlightWords (words, color) {
      var self = this
      words.forEach(word => {
        $(`.word[data-id=${self.wordId(word)}]`).addClass(color ? `highlighted-${color}` : 'highlighted')
      })
    },
    selectedText () {
      return $('.focused').map(function () {
        return $.trim($(this).text())
      }).get().join(' ')
    },
    selectedWords () {
      var wordSelections = []
      const self = this
      for (var i = 1; i <= this.currentSelectionIndex; i++) {
        var words = $(`.word[data-selection="${i}"]`)
        .map((i, el) => self.words[el.dataset.index]).get()
        if (words.length > 0) {
          wordSelections.push(new WordSelection(words))
        }
      }
      return wordSelections
    },
    highlightSelection (maintainSelection) {
      $('.focused').addClass('highlighted')
      if (maintainSelection === undefined || !maintainSelection) {
        $('.focused').removeClass('focused')
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
      this.fill($('.focused'))
      if (maintainSelection === undefined || !maintainSelection) {
        $('.focused').removeClass('focused')
      }
    },
    clearHighlight () {
      $('.word').removeClass('highlighted highlighted-red highlighted-green highlighted-orange highlighted-purple')
    },
    clearSelection () {
      $('.focused').removeAttr('data-selection')
      $('.focused').removeClass('focused start end')
    },
    scrollTo (words) {
      scrollToView($(`.word[data-id=${this.wordId(words[0])}]`), $('#selectable-text'))
    },
    reset () {
      $('.word').removeClass('highlighted focused start end')
      this.unfill($('.word'))
    },
    onTouchpadMove (direction) {
      switch (direction) {
        case 'RIGHT':
          var $nextWord = $('.focused').next('.word')
          if (!$nextWord.hasClass('filled')) {
            $nextWord.addClass('focused')
          }
          break
        case 'LEFT':
          $('.focused').last().removeClass('focused').removeAttr('data-selection')
          break
        case 'UP':
          var $prevWord = $('.focused').prev('.word')
          if (!$prevWord.hasClass('filled')) {
            $prevWord.addClass('focused')
          }
          break
        case 'DOWN':
          $('.focused').first().removeClass('focused').removeAttr('data-selection')
          break
        default: return
      }
    },
    focusedWords () {
      const self = this
      return $('#selectable-text .word.focused').toArray().map(el => self.words[el.dataset.index])
    },
    onTouchpadTap () {
      var words = this.focusedWords()
      this.registerSelection()
      this.fillSelection()
      this.focusedElement = undefined
      this.broadcastChange(new WordSelection(words), 'SELECT')
    },
    onTouchpadDoubleTap () {
      var words = this.focusedWords()
      this.clearSelection()
      this.focusedElement = undefined
      this.broadcastChange(new WordSelection(words), 'DESELECT')
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../static/less/colors.less';
@import '../../static/less/words.less';
@import '../../static/less/flex.less';
@import '../../static/less/common.less';

#content {
  position: relative;
  height: 100%;
}
.row {
  height: 100%;
}
#selectable-text {
  height: 100%;
  padding-top: 3px;
  padding-bottom: 10px;
}
#touchpad {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: inset 0px 0px 3px 4px @color-highlight-blue;
  opacity: 0.7;
}
</style>
