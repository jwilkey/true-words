<template>
  <div class="flex-column vfull">
    <div class="flex-row topic-input">
      <p class="flex-zero callout-light alt"><i class="fa fa-tag"></i></p>
      <form class="flex-one" @submit="addTopic">
        <input v-model="topic" autofocus type="text" class="callout-bottom theme-back" placeholder="topic" />
      </form>
      <button :disabled="!topic" @click="addTopic"><i class="fa fa-plus-circle callout-light alt flex-zero"></i></button>
    </div>

    <div class="flex-one scrolly">

      <div v-if="!showTopics" class="container passage">
        <div v-for="verse in getCurrentStudy.verses" class="verse-container" :data-verse="verse.number">
          <div class="verse theme-mid hover">
            <span class="verse-number muted"><span v-if="verse.number === 1">{{verse.chapter}}:</span>{{ verse.number }}</span>
            <span class="verse-text">{{ verse.text }}</span>
          </div>
        </div>
      </div>

      <div v-if="showTopics" class="container topics-view">
        <p v-if="topics.length === 0" class="text-center muted"><i>You have not added any topics</i></p>
        <p v-if="topics.length > 1" class="text-center muted"><i>Drag to order topics by importance to the text</i></p>
        <draggable v-model="data.collection.items" @end="moved">
          <div v-for="(topic, index) in topics" class="flex-row topic-row theme-mid">
            <p class="topic-counter hi-right"><span>{{ topic.order + 1 }}</span></p>
            <p class="flex-one topic">#{{ topic.text }}</p>
            <div class="topic-delete hi-left" @click="deleteTopic(topic)"><i class="fa fa-close"></i></div>
          </div>
        </draggable>
      </div>

    </div>

    <div class="flex-row bottombar">
      <button class="flex-one btn callout-light" @click="toggleView"><i v-if="showTopics" class="fa fa-arrow-left"></i> {{ viewButtonLabel }}</button>
      <div class="flex-two done-button" :class="{shown: showTopics}">
        <button class="btn callout-light" @click="donePressed()">DONE</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { FreeText } from '../../js/models/ActivityData'
import activities from '../../js/activity'
import Draggable from 'vuedraggable'

export default {
  data () {
    return {
      topic: '',
      showTopics: false,
      moving: undefined,
      lastMove: undefined
    }
  },
  props: ['finish', 'data'],
  computed: {
    ...mapGetters(['getCurrentStudy']),
    topics () {
      return this.data.collection.items
    },
    viewButtonLabel () {
      return this.showTopics ? 'PASSAGE' : `TOPICS (${this.topics.length})`
    }
  },
  components: { Draggable },
  methods: {
    addTopic () {
      const self = this
      if (!this.data.collection.items.find(ft => ft.text === self.topic)) {
        this.data.collection.add(new FreeText(this.topic, this.getCurrentStudy.passage, this.topics.length))
        this.topic = ''
      }
    },
    deleteTopic (topic) {
      const index = this.topics.indexOf(topic)
      this.data.collection.items.splice(index, 1)
      this.sort()
    },
    toggleView () {
      this.showTopics = !this.showTopics
    },
    moved (event) {
      this.sort()
    },
    sort () {
      this.data.collection.items.forEach((topic, i) => {
        topic.order = i
      })
    },
    donePressed () {
      this.finish(activities.types.Topics, this.data)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors.less';
@import '../../../static/less/app.less';
@import '../../../static/less/flex.less';

.topic-input {
  align-items: center;
  margin-bottom: 8px;
  h3, p {
    padding-left: 8px;
    padding-right: 2px;
    margin: 0px;
    font-size: 12px;
  }
  input {
    width: 100%;
    min-height: 45px;
    font-size: 20px;
    border: none;
    margin-right: 15px;
    outline: none;
  }
  button {
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    outline: none;
    &:disabled {
      opacity: 0.3;
    }
  }
  i {
    padding: 0px 10px;
    font-size: 26px;
  }
}
.passage {
  padding-bottom: 30px;
}
.verse-container {
  padding: 0px;
  margin-bottom: 2px !important;
  .verse {
    padding: 0px 5px;
  }
  .verse-number {
    vertical-align: super;
    font-size: 12px;
  }
}

.topics-view {
  padding-top: 10px;
  padding-bottom: 40px;
  .topic-row {
    margin-bottom: 5px;
    align-items: center;
    p {
      margin: 0;
    }
  }
  .topic-counter {
    padding: 3px 14px;
    margin-right: 2px;
    display: table-cell;
  }
  .topic {
    position: inherit;
    top: 0;
    left: 45px;
    padding: 9px;
    border-radius: 2px;
    cursor: move;
    transition: left 0.3s;
    &.moving {
      position: fixed;
      box-shadow: 1px 1px 3px rgba(100, 100, 100, 0.7);
      z-index: 1000;
    }
  }
  .topic-delete {
    padding: 0 15px;
    cursor: pointer;
    color: @color-highlight-red;
  }
}

.bottombar {
  button {
    margin: 0px 5px;
  }
  .done-button {
    overflow: hidden;
    max-width: 0px;
    transition: max-width 0.3s, padding 0.3s;
    button {
      width: 100%;
    }
    &.shown {
      max-width: 1000px;
      padding-right: 8px;
    }
  }
}
</style>
