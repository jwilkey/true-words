<template>
  <div class="flex-column vfull">
    <div class="flex-one flex-column">
      <div class="flex-two flex-row">
        <div data-index="0" class="flex-one flex-column flex-center bucket back-orange dropzone" @click="assignToBucket(0)">
          <p><i class="fa fa-user-circle-o"></i> {{ container(0).name }} <span v-if="!container(0).isEmpty()" class="bubble">{{ container(0).items.length }}</span></p>
        </div>
        <div data-index="1" class="flex-one flex-column flex-center bucket back-purple dropzone" @click="assignToBucket(1)">
          <p><i class="fa fa-institution"></i> {{ container(1).name }} <span v-if="!container(1).isEmpty()" class="bubble">{{ container(1).items.length }}</span></p>
        </div>
      </div>

      <div class="relative flex-three flex-column flex-center">
        <div class="flex-one flex-row">
          <div class="flex-one flex-column">
            <div class="flex-one"></div>
            <div class="flex-zero join-container">
              <div class="join-button theme-mid muted left" @click="joinLeft()">
                <span class="glyphicon glyphicon-menu-left"></span> JOIN
              </div>
            </div>
          </div>
          <div class="flex-two flex-column word-viewer-container">
            <div class="flex-one"></div>
            <div>
              <span id="word-viewer" class="theme-mid muted shadow-long"></span>
            </div>
          </div>
          <div class="flex-one flex-column text-right">
            <div class="flex-one"></div>
            <div class="flex-zero join-container">
              <div class="join-button theme-mid muted right" @click="joinRight()">
                JOIN <span class="glyphicon glyphicon-menu-right"></span>
              </div>
            </div>
          </div>
        </div>

        <div class="text-view theme-mid shadow-long">
          <p :key="word.index" v-for="(word, index) in words" class="bucket-word" :data-index="index" :data-word="word.verse + '-' + word.index">{{ word.text }}</p>
        </div>

        <div class="flex-one">
          <div id="buckets-clear-button" class="image-button" @click="clearCurrentWordSelection()">
            <img class="svg close-button" src="/static/images/close.svg" />
          </div>
          <div v-if="showScrollTip" class="scroll-tip muted-more">
            Drag text to scroll
          </div>
        </div>
        <div class="indicator callout-light"></div>
      </div>

      <div class="flex-two flex-row">
        <div data-index="2" class="flex-one flex-column flex-center bucket back-red dropzone" @click="assignToBucket(2)">
          <p><i class="fa fa-tree"></i> {{ container(2).name }} <span v-if="!container(2).isEmpty()" class="bubble">{{ container(2).items.length }}</span></p>
        </div>
      </div>
    </div>

    <div id="buckets-action" class="bottombar flex-zero">
      <button class="btn-lg btn-clear btn-block" @click="donePressed()">DONE</button>
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
      activityType: activities.types.PeoplePlacesThings,
      textViewNode: undefined,
      startScrollPosition: undefined,
      startXPos: undefined,
      curDown: undefined
    }
  },
  computed: {
    ...mapGetters({ words: 'getCurrentWords' }),
    currentWordAssigned: function () {
      return $('.bucket-word.current').hasClass('red')
    },
    showScrollTip () {
      return !isTouchDevice()
    }
  },
  props: ['finish', 'data'],
  watch: {
    currentWord: function (newWord, oldVal) {
      var wordId = newWord.verse + '-' + newWord.index
      var wordElement = $('.bucket-word[data-word=' + wordId + ']')
      this.scrollToWord(wordElement)
      var selection = this.findContainerAndWordSelection(newWord)
      if (selection) {
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

        var result = this.findContainerAndWordSelection()
        if (result) {
          result.wordSelection.words.forEach(function (w) {
            var wordId = w.verse + '-' + w.index
            var $wordElement = $('.bucket-word[data-word=' + wordId + ']')
            $wordElement.addClass('current')
          })
        }
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
    joinLeft () {
      $('.current:first').prev().addClass('current')
    },
    joinRight () {
      $('.current:last').next().addClass('current')
    },
    buildWordSelectionFromCurrentSelection () {
      var self = this
      var selectedWords = $('.current').map(function () {
        var index = parseInt(this.dataset.index)
        if (typeof index === 'number') {
          return self.words[index]
        }
      }).get()
      return new WordSelection(selectedWords)
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
            container.add(self.buildWordSelectionFromCurrentSelection())
          }
        } else if (wordSelection !== undefined) {
          container.remove(wordSelection)
        }
      })

      var $currentSelection = $('.current')
      $currentSelection.removeClass('orange purple red')
      $currentSelection.addClass(self.bucketClass(bucketIndex))

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
    setupData () {
      var self = this
      $('.bucket-word').removeClass('orange purple red')
      this.data.containers.forEach(function (container, cIndex) {
        container.items.forEach(function (wordSelection) {
          wordSelection.words.forEach(function (word) {
            var wordId = word.verse + '-' + word.index
            var $wordElement = $('.bucket-word[data-word=' + wordId + ']')
            $wordElement.addClass(self.bucketClass(cIndex))
          })
        })
      })
    },
    setupTextViewDragging () {
      if (!isTouchDevice()) {
        var self = this
        var $textView = $('.text-view')
        $textView.on('mousemove', function (e) {
          if (self.curDown) {
            $textView.scrollLeft(self.startScrollPosition + (self.startXPos - e.pageX))
          }
        })

        $textView.on('mousedown', function (e) {
          self.startScrollPosition = $textView.scrollLeft()
          self.startXPos = e.pageX
          self.curDown = true
        })

        $textView.on('mouseup', function (e) {
          self.curDown = false
          if ($textView.scrollLeft() !== self.startScrollPosition) {
            $('.scroll-tip').fadeOut()
          }
        })
      }
    },
    willAppear () {
      this.setupData()
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

    this.setupData()

    var $textView = $('.text-view')
    this.textViewNode = $textView[0]

    $textView.scroll(function () {
      clearTimeout($.data(this, 'scrollTimer'))
      $('.indicator').addClass('active')
      $textView.addClass('scrolling')
      self.showWordPreview()
      $.data(this, 'scrollTimer', setTimeout(function () {
        $textView.removeClass('scrolling')
        self.hideWordPreview()
        self.determineCurrentWord()
      }, 250))
    })

    self.setupTextViewDragging()

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
  text-align: center;
  letter-spacing: 2px;
  font-size: 20px;
  font-weight: bold;
  user-select: none;
  transition: all 0.2s;
  p {
    margin-bottom: 0px;
  }
  &:hover {
    font-size: 21px;
    border: solid 1px @color-highlight-contrast;
  }
  .bubble {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding-bottom: 1px;
    padding-left: 5px;
    padding-right: 5px;
    font-size: 13px;
    letter-spacing: normal;
  }
}
#current-word {
  z-index: 100;
  position: absolute;
}
.text-view {
  position: relative;
  font-size: 20px;
  overflow-x: scroll;
  padding: 15px;
  white-space: nowrap;
  z-index: 10;
  user-select: none;
  transition: opacity 0.3s;
  &.scrolling {
    opacity: 0.8;
  }
}
.join-container {
  z-index: 11;
}
.join-button {
  z-index: 11;
  padding: 8px;
  font-size: 13px;
  font-family: 'Arial';
  display: inline-block;
  &.left {
    border-top-right-radius: 6px;
    padding-right: 12px;
  }
  &.right {
    border-top-left-radius: 6px;
    padding-left: 12px;
  }
  .glyphicon {
    transform: translateY(2px);
  }
}
.word-viewer-container {
  padding-bottom: 10px;
  text-align: center;
  #word-viewer {
    opacity: 0;
    padding: 5px;
    border-radius: 5px;
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
  }
}
.image-button {
  max-height: 30px;
  max-width: 30px;
  margin: auto;
  margin-top: 10px;
}
.scroll-tip {
  text-align: center;
  margin-top: 8px;
}
</style>
