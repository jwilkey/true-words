<template>
  <div id="content" class="container">
    <div class="row">
      <div id="text" class="col-sm-12">
        <span track-by="$index" v-for="word in words" id='word-{{ $index }}' @click='setSelected($event.target)' class='word'>{{ word }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentWords } from '../../vuex/getters'
import $ from 'jquery'

export default {
  methods: {
    setSelected (element) {
      $(element).toggleClass('selected')
    }
  },
  ready () {
    var selectedWordIndex
    var initialSelection
    $('#content').on('touchstart mousedown', function (e) {
      var point = getPoint(e)
      var element = document.elementFromPoint(point.x, point.y)
      if ($(element).hasClass('word') && !$(element).hasClass('multi')) {
        // e.preventDefault()
        initialSelection = element
      }
    })
    $('#content').on('touchmove mousemove', function (e) {
      if (initialSelection !== undefined) {
        var point = getPoint(e)
        var element = document.elementFromPoint(point.x, point.y)
        if ($(element).hasClass('word')) {
          e.preventDefault()
          var elementIndex = parseInt(element.id.substring(5))
          if (selectedWordIndex === undefined) {
            $(element).before(createMultitool(true))
            selectedWordIndex = elementIndex
            $(element).addClass('multi')
            $(element).removeClass('selected')
          } else if (elementIndex === selectedWordIndex + 1) {
            selectedWordIndex = elementIndex
            $(element).addClass('multi')
            $(element).removeClass('selected')
          }
        }
      }
    })
    $('#content').on('touchend touchleave mouseup mouseleave', function (e) {
      if (selectedWordIndex !== undefined) {
        $('#word-' + selectedWordIndex).after(createMultitool(false))
      }
      selectedWordIndex = undefined
      initialSelection = undefined
    })
  },
  vuex: {
    getters: {
      words: getCurrentWords
    }
  }
}

$(document).ready(function () {
})

function getPoint (e) {
  return {
    x: e.pageX ? e.pageX : e.originalEvent.pageX,
    y: e.pageY ? e.pageY : e.originalEvent.pageY
  }
}

function createMultitool (isStart) {
  var multitool = $('<p class="multitool ' + (isStart ? 'start' : 'end') + ' pull-left"><span class="glyphicon glyphicon-menu-' + (isStart ? 'left' : 'right') + '" /></p>')
  multitool.on('touchmove mousemove', function (event) {

  })
  return multitool
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../static/less/colors.less';
@import '../../static/less/selectable-text.less';
</style>
