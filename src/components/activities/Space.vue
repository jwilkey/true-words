<template>
  <div class="flex-v">
    <div class="flex-1">
      <div class="overlay">
        <text-input ref="textInput" :title="textInputTitle" :done="textInputDone"></text-input>
      </div>
      <div class="container">
        <ul class="list-group">
          <li v-for="verse in getCurrentStudy.verses" class="list-group-item verse-container" :data-verse="verse.number" @click="verseSelected($event.target)">
            <div class="verse">
              <span class="verse-number">{{ verse.number }}</span> <span class="verse-text">{{ verse.text }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="actionbar-flex">
      <div class="col-xs-12 space-done-button">
        <button class="btn btn-primary btn-block" @click="finished()">DONE</button>
      </div>
      <div class="col-xs-5c">
        <button class="btn btn-actionable alt btn-block" @click="actionSelected('S')">S</button>
      </div>
      <div class="col-xs-5c">
        <button class="btn btn-actionable alt btn-block" @click="actionSelected('P')">P</button>
      </div>
      <div class="col-xs-5c">
        <button class="btn btn-actionable alt btn-block" @click="actionSelected('A')">A</button>
      </div>
      <div class="col-xs-5c">
        <button class="btn btn-actionable alt btn-block" @click="actionSelected('C')">C</button>
      </div>
      <div class="col-xs-5c">
        <button class="btn btn-actionable alt btn-block" @click="actionSelected('E')">E</button>
      </div>
    </div>

  </div>
</template>

<script>
import $ from 'jquery'
import { mapGetters } from 'vuex'
import activities from '../../js/activity'
import TextInput from '../TextInput'
import { FreeText } from '../../js/models/ActivityData'
// import { Bible, Verse } from '../../js/bible'

export default {
  data () {
    return {
      activityType: activities.types.Space,
      currentVerse: undefined,
      textInputTitle: 'Sin to confess',
      currentSpaceContainer: undefined
    }
  },
  computed: {
    ...mapGetters(['getCurrentStudy'])
  },
  components: { TextInput },
  props: ['finish', 'data'],
  methods: {
    verseSelected (targetNode) {
      $('.verse-container.selected').removeClass('selected')
      var verseContainer = $(targetNode).closest('.verse-container')
      verseContainer.addClass('selected')
    },
    actionSelected (action) {
      switch (action) {
        case 'S': this.textInputTitle = 'SIN TO CONFESS'
          break
        case 'P': this.textInputTitle = 'PROMISE TO CLAIM'
          break
        case 'A': this.textInputTitle = 'ACTION TO TAKE'
          break
        case 'C': this.textInputTitle = 'COMMAND TO OBEY'
          break
        case 'E': this.textInputTitle = 'EXAMPLE TO FOLLOW'
          break
        default: return
      }
      this.currentSpaceContainer = action
      $('.overlay').show()
      this.$refs.textInput.focus()
    },
    textInputDone (text) {
      $('.overlay').hide()
      if (text.length > 0) {
        var container = this.data.findContainer(this.currentSpaceContainer)
        container.add(new FreeText(text, this.getCurrentStudy.passage))
        $('.space-done-button').show()
      }
    },
    finished () {
      this.finish(this.activityType, this.data)
    }
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors.less';
@import '../../../static/less/app.less';
::-webkit-scrollbar
{
  width: 2px;
  height: 2px;
}
::-webkit-scrollbar-track
{
  background: transparent;
}
::-webkit-scrollbar-thumb
{
  background: @color-back-raised;
}

.overlay {
  display: none;
  position: absolute;
  width: 100%;
  z-index: 100;
  background-color: @color-back;
  box-shadow: @shadow-long;
}

.verse-container {
  padding: 0px;
  &.selected {
  }
}
.verse {
  color: white;
  background-color: @color-back-raised;
  padding: 5px;
  font-size: 18px;
}
.verse:hover {
  background-color: @color-back-raised2;
}
.verse-number {
  color: #999;
}
.space-done-button {
  display: none;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 10px;
  @media (max-width: 767px) {
    padding-left: 5px;
    padding-right: 5px;
  }
}
</style>
