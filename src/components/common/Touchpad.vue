<template>
  <div class="touchpad">
    <p>{{ totalDeltaX }} - {{ totalDeltaY }} ___ {{ tapCount }}</p>
  </div>
</template>

<script>
import $ from 'jquery'
import { isEventSupported } from '../../js/polyfill'

export default {
  data () {
    return {
      startPosition: undefined,
      position: undefined,
      totalDeltaX: 0,
      totalDeltaY: 0,
      deltaX: 0,
      deltaY: 0,
      tapCount: 0
    }
  },
  props: ['onMove', 'onTap', 'onDoubleTap'],
  methods: {
    onTouchStart (event) {
      this.startPosition = getPoint(event)
      this.position = this.startPosition
    },
    onTouchMove (event) {
      if (this.position) {
        if (event.preventDefault) { event.preventDefault() }

        var point = getPoint(event)
        this.deltaX = point.x - this.position.x
        this.deltaY = point.y - this.position.y

        this.totalDeltaX += Math.abs(this.deltaX)
        this.totalDeltaY += Math.abs(this.deltaY)

        const threshold = 25
        if (this.deltaX > threshold) {
          this.position = point
          this.moveRight()
        }
        if (this.deltaX < -(threshold)) {
          this.position = point
          this.moveLeft()
        }
        if (this.deltaY < -(threshold)) {
          this.position = point
          this.moveUp()
        }
        if (this.deltaY > threshold) {
          this.position = point
          this.moveDown()
        }
      }
    },
    onTouchEnd (event) {
      if (this.totalDeltaX < 10 && this.totalDeltaY < 10) {
        this.tapCount += 1
        const self = this
        window.setTimeout(function () {
          if (self.tapCount === 1 && self.onTap) {
            self.onTap()
          } else if (self.tapCount > 1 && self.onDoubleTap) {
            self.onDoubleTap()
          }
          self.tapCount = 0
        }, 250)
      }
      this.startPosition = undefined
      this.totalDeltaX = 0
      this.totalDeltaY = 0
      this.position = undefined
      this.deltaX = 0
      this.deltaY = 0
    },
    moveRight () {
      if (this.onMove) { this.onMove('RIGHT') }
    },
    moveLeft () {
      if (this.onMove) { this.onMove('LEFT') }
    },
    moveUp () {
      if (this.onMove) { this.onMove('UP') }
    },
    moveDown () {
      if (this.onMove) { this.onMove('DOWN') }
    }
  },
  mounted () {
    var self = this
    $('.touchpad').on(isEventSupported('touchstart') ? 'touchstart' : 'mousedown', self.onTouchStart)
    $('.touchpad').on('mousemove touchmove', self.onTouchMove)
    $('.touchpad').on(isEventSupported('touchend') ? 'touchend' : 'mouseup', self.onTouchEnd)
  }
}

function getPoint (e) {
  return {
    x: e.pageX || e.originalEvent.pageX || e.originalEvent.touches[0].pageX,
    y: e.pageY || e.originalEvent.pageY || e.originalEvent.touches[0].pageY
  }
}
</script>
