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

        <hr />

        <div v-if="data" class="space-progress">
          <div v-for="container in data.containers" v-if="container.items.length > 0">
            <p class="space-title">{{ containerLabels[container.name] }}</p>
            <div v-for="(item, index) in container.items" class="flex-row">
              <p class="flex-one space-entry" @click="editEntry(item, container)">{{ item.text }}</p>
              <img class="flex-zero" src="/static/images/close.svg" @click="deleteEntry(index, container)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="actionbar-flex">
      <div v-if="showDoneButton" class="col-xs-12 space-done-button">
        <button class="btn btn-actionable btn-block" @click="finished()">FINISHED</button>
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
      currentSpaceContainer: undefined,
      editingEntry: undefined,
      containerLabels: {
        S: 'SIN TO CONFESS',
        P: 'PROMISE TO CLAIM',
        A: 'ACTION TO TAKE',
        C: 'COMMAND TO OBEY',
        E: 'EXAMPLE TO FOLLOW'
      }
    }
  },
  computed: {
    ...mapGetters(['getCurrentStudy']),
    showDoneButton () {
      return !this.data.containers[0].isEmpty() ||
      !this.data.containers[1].isEmpty() ||
      !this.data.containers[2].isEmpty() ||
      !this.data.containers[3].isEmpty() ||
      !this.data.containers[4].isEmpty()
    }
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
      this.textInputTitle = this.containerLabels[action]
      this.currentSpaceContainer = action
      $('.overlay').show()
      this.$refs.textInput.focus()
    },
    editEntry (entry, container) {
      this.textInputTitle = this.containerLabels[container.name]
      this.currentSpaceContainer = container.name
      this.editingEntry = entry
      $('.overlay').show()
      this.$refs.textInput.focus(entry.text)
    },
    deleteEntry (index, container) {
      container.items.splice(index, 1)
    },
    textInputDone (text) {
      $('.overlay').hide()
      if (text.length > 0) {
        var container = this.data.findContainer(this.currentSpaceContainer)
        if (this.editingEntry) {
          this.editingEntry.text = text
          this.editingEntry = undefined
        } else {
          container.add(new FreeText(text, this.getCurrentStudy.passage))
        }
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
  margin-bottom: 2px !important;
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
.space-progress {
  .space-title {
    margin-top: 8px;
    margin-bottom: 0px;
    color: @color-deemphasize;
  }
  .space-entry {
    margin-bottom: 0px;
    padding: 5px;
    border: solid 1px @color-back-raised2;
    border-radius: 3px;
    margin-bottom: 5px;
    cursor: pointer;
  }
  img {
    max-height: 30px;
    margin-left: 10px;
    cursor: pointer;
  }
}
.space-done-button {
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 10px;
  @media (max-width: 767px) {
    padding-left: 5px;
    padding-right: 5px;
  }
}
</style>
