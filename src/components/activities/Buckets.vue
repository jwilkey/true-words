<template>
  <div class="flex-column vfull">
    <div class="flex-one flex-column">
      <div class="flex-two flex-row">
        <div data-index="0" class="flex-one flex-column flex-center bucket back-orange dropzone" @click="assignToBucket(0)">
          {{ container(0).name }}
        </div>
        <div data-index="1" class="flex-one flex-column flex-center bucket back-purple dropzone" @click="assignToBucket(1)">
          {{ container(1).name }}
        </div>
      </div>

      <div class="relative flex-three flex-column flex-center">
        <div class="flex-one">
          <div class="word-viewer-container">
            <span id="word-viewer"></span>
          </div>
        </div>
        <div class="text-view">
          <p :key="word.index" v-for="(word, index) in words" class="bucket-word" :data-index="index" :data-word="word.verse + '-' + word.index">{{ word.text }}</p>
        </div>
        <div class="flex-one">
          <div id="buckets-clear-button" class="image-button" @click="clearCurrentWordSelection()">
            <img class="svg close-button" src="/static/images/close.svg" />
          </div>
        </div>
        <div class="indicator"></div>
      </div>

      <div class="flex-two flex-row">
        <div data-index="2" class="flex-one flex-column flex-center bucket back-red dropzone" @click="assignToBucket(2)">
          {{ container(2).name }}
        </div>
      </div>
    </div>

    <div id="buckets-action" class="actionbar-flex">
      <button class="btn-lg btn-actionable btn-block" @click="donePressed()">DONE</button>
    </div>
  </div>
</template>

<script>
import store from '../../../vuex/store'
import { mapGetters } from 'vuex'
import $ from 'jquery'
import activities from '../../js/activity'
import { isTouchDevice, arrayLast } from '../../js/polyfill'
import { WordSelection } from '../../js/models/ActivityData'

export default {
  data () {
    return {
      currentWord: undefined,
      currentWordContainer: undefined,
      activityType: activities.types.PeoplePlacesThings
    }
  },
  computed: {
    ...mapGetters({ words: 'getCurrentWords' }),
    currentWordAssigned: function () {
      return $('.bucket-word.current').hasClass('red')
    }
  },
  props: ['finish', 'data'],
  watch: {
    currentWord: function (newWord, oldVal) {
      var wordId = newWord.verse + '-' + newWord.index
      var wordElement = $('.bucket-word[data-word=' + wordId + ']')
      this.scrollToWord(wordElement)
      if (this.findContainerAndWordSelection(newWord)) {
        $('#buckets-clear-button').show()
      } else {
        $('#buckets-clear-button').hide()
      }
    }
  },
  methods: {
    container (index) {
      return this.data.containers[index]
    },
    moveToNextWord () {
      if (this.currentWord !== arrayLast(this.words)) {
        var nextWord = this.words.indexOf(this.currentWord) + 1
        this.currentWord = this.words[nextWord]
      }
    },
    findCenterWordElement () {
      var centerX = $(window).width() / 2
      var centerY = $(window).height() / 2
      var $centerElement = $(document.elementFromPoint(centerX, centerY))

      if (!$centerElement.hasClass('bucket-word')) {
        return undefined
      }

      return $centerElement
    },
    showWordPreview () {
      if (isTouchDevice()) {
        var centerWord = this.findCenterWordElement()
        if (centerWord) {
          $('#word-viewer').addClass('scrolling')
          $('#word-viewer').text(centerWord.text())
        }
      }
    },
    hideWordPreview () {
      $('#word-viewer').removeClass('scrolling')
    },
    determineCurrentWord () {
      var $centerElement = this.findCenterWordElement()

      if ($centerElement) {
        $('.current').removeClass('current')
        $centerElement.addClass('current')

        this.currentWord = this.words[$centerElement.data('index')]
      }
    },
    scrollToWord (wordElement) {
      var width = wordElement.width()
      var scrollLeft = $('.text-view').scrollLeft()
      var elementOffset = wordElement.offset().left
      var offset = scrollLeft + elementOffset + (width / 2) - ($(window).width() / 2)
      $('.text-view').animate({ scrollLeft: offset }, 200, function () {
        $('.indicator').removeClass('active')
      })
    },
    bucketClass (bucketIndex) {
      if (bucketIndex === 0) {
        return 'orange'
      } else if (bucketIndex === 1) {
        return 'purple'
      } else if (bucketIndex === 2) {
        return 'red'
      }
      return ''
    },
    assignToBucket (bucketIndex) {
      var self = this
      this.data.containers.forEach(function (container, i) {
        var wordSelection = container.search(self.currentWord)
        if (i === bucketIndex) {
          if (wordSelection === undefined) {
            container.add(new WordSelection(self.currentWord))
          }
        } else if (wordSelection !== undefined) {
          container.remove(wordSelection)
        }
      })

      var wordIndex = self.words.indexOf(self.currentWord)
      var $wordElement = $('.bucket-word[data-index=' + wordIndex + ']')
      $wordElement.removeClass('orange purple red')
      $wordElement.addClass(self.bucketClass(bucketIndex))
      $wordElement[0].dataset.container = bucketIndex

      this.moveToNextWord()
    },
    findContainerAndWordSelection (word) {
      var result
      var self = this
      this.data.containers.every(function (container, i) {
        var wordSelection = container.search(self.currentWord)
        if (wordSelection !== undefined) {
          result = {container: container, wordSelection: wordSelection}
          return false
        }
        return true
      })
      return result
    },
    clearCurrentWordSelection () {
      var result = this.findContainerAndWordSelection(this.currentWord)
      if (result) {
        result.container.remove(result.wordSelection)
        $('.bucket-word.current').removeClass('orange red purple')
      }
    },
    donePressed () {
      this.finish(this.activityType, this.data)
    }
  },
  components: {
  },
  store,
  mounted () {
    var self = this

    this.data.containers.forEach(function (container, cIndex) {
      container.items.forEach(function (wordSelection) {
        wordSelection.words.forEach(function (word) {
          var wordId = word.verse + '-' + word.index
          var $wordElement = $('.bucket-word[data-word=' + wordId + ']')
          $wordElement.addClass(self.bucketClass(cIndex))
          $wordElement[0].dataset.container = cIndex
        })
      })
    })

    $('.text-view').scroll(function () {
      clearTimeout($.data(this, 'scrollTimer'))
      $('.indicator').addClass('active')
      $('.text-view').addClass('scrolling')
      self.showWordPreview()
      $.data(this, 'scrollTimer', setTimeout(function () {
        $('.text-view').removeClass('scrolling')
        self.hideWordPreview()
        self.determineCurrentWord()
      }, 250))
    })

    var padding = $(window).width() / 2 - 2
    $('.text-view').css('padding-left', padding + 'px')
    $('.text-view').css('padding-right', padding + 'px')

    this.$nextTick(function () {
      this.currentWord = this.words[0]
      $('.bucket-word:nth(0)').addClass('current')
    })
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors.less';
@import '../../../static/less/flex.less';

@media screen and (max-height: 380px) {
  #buckets-action {
    display: none;
  }
}
.bucket {
  border: solid 1px @color-border;
  text-align: center;
  letter-spacing: 2px;
  font-size: 19px;
  font-weight: bold;
  user-select: none;
  transition: all 0.2s;
  &:hover {
    font-size: 21px;
    border: solid 1px @color-text;
  }
}
#current-word {
  z-index: 100;
  position: absolute;
}
.text-view {
  position: relative;
  font-size: 20px;
  background-color: @color-back-raised;
  box-shadow: @shadow-long;
  color: @color-text;
  overflow-x: scroll;
  padding: 15px;
  // padding-right/left: half-view-width;  <- onMounted
  white-space: nowrap;
  z-index: 10;
  user-select: none;
  transition: background-color 0.3s;
  &.scrolling {
    background-color: rgba(55,55,55,0.5);
  }
}
.word-viewer-container {
  padding-top: 10px;
  text-align: center;
  #word-viewer {
    opacity: 0;
    color: @color-deemphasize;
    background-color: @color-back-raised;
    padding: 5px;
    border-radius: 5px;
    box-shadow: @shadow-long;
    transition: opacity 0.7s;
    &.scrolling {
      opacity: 1;
    }
  }
}
.relative {
  position: relative;
}
.indicator {
  position: absolute;
  top: 20%;
  bottom: 20%;
  left: 50%;
  width: 1px;
  background-color: @color-back-raised2;
  opacity: 0;
  transition: opacity 0.5s;
  z-index: 1;
  &.active {
    opacity: 1;
  }
}
.bucket-word {
  padding-left: 2px;
  padding-right: 2px;
  padding-top: 5px;
  padding-bottom: 5px;
  display: inline;
  z-index: 10;
  &.current {
    border-top: solid 2px @color-highlight-blue;
    border-bottom: solid 2px @color-highlight-blue;
    box-shadow: @shadow;
  }
}
.image-button {
  max-height: 30px;
  max-width: 30px;
  margin: auto;
  margin-top: 10px;
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
</style>
