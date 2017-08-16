<template>
  <div class="flex-column vfull">
    <div class="input-entry theme-mid shadow-long" :class="{expand: input, contract: !input}">
      <text-input ref="textInput" :title="textInputTitle" :done="textInputDone"></text-input>
    </div>

    <div class="flex-one substance">
      <div class="container">
        <div v-for="verse in getCurrentStudy.verses" class="verse-container" :data-verse="verse.number" @click="verseSelected($event.target)">
          <div class="verse theme-mid hover">
            <span class="verse-number font-smaller"><span v-if="verse.number === 1">{{verse.chapter}}:</span>{{ verse.number }}</span> <span class="verse-text">{{ verse.text }}</span>
          </div>
        </div>

        <hr />

        <div v-if="data" class="acta-progress">
          <div v-for="container in data.containers" v-if="container.items.length > 0">
            <p class="acta-title muted">{{ containerLabels[container.name] }}</p>
            <div v-for="(item, index) in container.items" class="flex-row acta-entry">
              <p class="flex-one input" @click="editEntry(item, container)">{{ item.text }}</p>
              <img src="/static/images/close.svg" @click="deleteEntry(index, container)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-zero bottombar">
      <button v-if="showDoneButton" class="btn callout-light btn-block acta-done-button" @click="finished()">FINISHED</button>
      <div class="flex-row acta-buttons">
        <button class="flex-one shadow back-purple" @click="actionSelected('Adore')">A</button>
        <button class="flex-one shadow back-red" @click="actionSelected('Confess')">C</button>
        <button class="flex-one shadow back-blue" @click="actionSelected('Thank')">T</button>
        <button class="flex-one shadow back-green" @click="actionSelected('Ask')">A</button>
      </div>
      <div class="flex-row acta-labels">
        <p class="flex-one font-smaller muted text-center">ADORE</p>
        <p class="flex-one font-smaller muted text-center">CONFESS</p>
        <p class="flex-one font-smaller muted text-center">THANK</p>
        <p class="flex-one font-smaller muted text-center">ASK</p>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import activities from '../../js/activity'
import TextInput from '../TextInput'
import { FreeText } from '../../js/models/ActivityData'

export default {
  data () {
    return {
      activityType: activities.types.Acta,
      input: false,
      currentVerse: undefined,
      textInputTitle: 'ADORE - praise God',
      currentactaContainer: undefined,
      editingEntry: undefined,
      containerLabels: {
        Adore: 'ADORE - God, I adore you for...',
        Confess: 'CONFESS - God, I have sinned by...',
        Thank: 'THANK - God, thank you for...',
        Ask: 'ASK - God, would you please...'
      }
    }
  },
  computed: {
    ...mapGetters(['getCurrentStudy']),
    showDoneButton () {
      return !this.data.containers[0].isEmpty() ||
      !this.data.containers[1].isEmpty() ||
      !this.data.containers[2].isEmpty() ||
      !this.data.containers[3].isEmpty()
    }
  },
  components: { TextInput },
  props: ['finish', 'data'],
  methods: {
    verseSelected (targetNode) {
    },
    actionSelected (action) {
      this.textInputTitle = this.containerLabels[action]
      this.currentactaContainer = action
      this.input = true
      this.$refs.textInput.focus()
    },
    editEntry (entry, container) {
      this.textInputTitle = this.containerLabels[container.name]
      this.currentactaContainer = container.name
      this.editingEntry = entry
      this.input = true
      this.$refs.textInput.focus(entry.text)
    },
    deleteEntry (index, container) {
      container.items.splice(index, 1)
    },
    textInputDone (text) {
      this.input = false
      if (text.length > 0) {
        var container = this.data.findContainer(this.currentactaContainer)
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
@import '../../../static/less/colors';
@import '../../../static/less/app';
@import '../../../static/less/flex';

.input-entry {
  max-height: 0px;
  overflow: hidden;
  z-index: 100;
}

.verse-container {
  padding: 0px;
  margin-bottom: 2px !important;
}
.verse {
  padding: 5px;
}
.verse-number {
  color: #999;
  vertical-align: super;
}
.acta-progress {
  .acta-title {
    margin-top: 8px;
    margin-bottom: 3px;
  }
  .acta-entry {
    margin-bottom: 7px;
    align-items: center;
    .input {
      margin-bottom: 0px;
      padding: 5px;
      border-radius: 3px;
      cursor: pointer;
    }
  }
  img {
    max-height: 30px;
    margin-left: 10px;
    cursor: pointer;
  }
}
.acta-done-button {
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 10px;
}
.acta-buttons {
  button {
    border: none;
    padding: 8px 5px;
    margin-left: 5px;
    text-shadow: 0px 0px 8px black;
    outline: none;
  }
  button:first-child {
    margin-left: 0;
  }
}
.acta-labels {
  p {
    margin: 0;
    padding-top: 3px;
  }
}
</style>
