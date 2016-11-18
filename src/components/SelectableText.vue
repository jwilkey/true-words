<template>
  <div id="content" class="container">
    <div class="row">
      <div id="text" class="col-sm-12">
        <span :key="index" v-for="(word, index) in words" :id="'word-' + index" :data-index="index" @click="selected($event.target)" class="word">{{ word }}</span>
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
      initialSelection: undefined
    }
  },
  computed: {
    ...mapGetters({words: 'getCurrentWords'})
  },
  props: ['delegate'],
  methods: {
    selected (element) {
      $(element).toggleClass('selected')
      if (this.delegate && this.delegate.onSelect) {
        this.delegate.onSelect($(element).text(), $(element).data('index'))
      }
    },
    onTouchStart (e) {
      var point = getPoint(e)
      var element = document.elementFromPoint(point.x, point.y)
      var v = this
      if ($(element).hasClass('word') && !$(element).hasClass('multi')) {
        v.initialSelection = element
      }
    },
    onTouchMove (e) {
      if (this.initialSelection !== undefined) {
        var point = getPoint(e)
        var element = document.elementFromPoint(point.x, point.y)
        if ($(element).hasClass('word')) {
          e.preventDefault()
          var elementIndex = parseInt(element.id.substring(5))
          if (this.selectedWordIndex === undefined) {
            $(element).addClass('start')
            this.selectedWordIndex = elementIndex
            $(element).addClass('multi')
            $(element).removeClass('selected')
          } else if (elementIndex === this.selectedWordIndex + 1) {
            this.selectedWordIndex = elementIndex
            $(element).addClass('multi')
            $(element).removeClass('selected')
          }
        }
      }
    },
    onTouchEnd (e) {
      if (this.selectedWordIndex !== undefined) {
        $('#word-' + this.selectedWordIndex).addClass('end')
        if (this.delegate && this.delegate.onMultiSelect) {
          var startIndex = $(this.initialSelection).data('index')
          var selectedWords = $('.word').slice(startIndex, this.selectedWordIndex + 1).map(function () {
            return $(this).text()
          }).get()
          this.delegate.onMultiSelect(selectedWords, [startIndex, this.selectedWordIndex])
        }
      }
      this.selectedWordIndex = undefined
      this.initialSelection = undefined
    },
    reset () {
      $('.word').removeClass('selected multi start end')
    }
  },
  mounted () {
    $('#content').on('touchstart mousedown', this.onTouchStart)
    $('#content').on('touchmove mousemove', this.onTouchMove)
    $('#content').on('touchend touchleave mouseup mouseleave', this.onTouchEnd)
  }
}

function getPoint (e) {
  return {
    x: e.pageX ? e.pageX : e.originalEvent.pageX,
    y: e.pageY ? e.pageY : e.originalEvent.pageY
  }
}
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
}
.word:hover {
  border: solid 1px #38f;
}

.word.multi {
  background-color: @color-selection1;
  color: @color-back;
  word-wrap: normal;
  margin-left: 0px;
  margin-right: 0px;
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
</style>
