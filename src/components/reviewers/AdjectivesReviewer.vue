<template>
  <div v-if="data !== undefined" class="flex-column vfull">
    <div class="flex-one scrolly">
      <div class="container">
        <drawer :expanded="true">
          <div slot="title">{{ data.collection.items.length }} ADJECTIVES</div>
          <div slot="content" v-for="adjective in data.collection.items" class="adjective-item">
            <span class="adjective back-red">{{ adjectiveText(adjective.wordSelection) }}</span><span v-if="adjective.target">-</span><span v-if="adjective.target" class="target back-purple">{{ targetText(adjective.target) }}</span>
          </div>
        </drawer>
      </div>

      <div class="adjective-words">
        <span :key="index" v-for="(word, index) in words" :class="wordClass(word)">{{ word.text }} </span>
      </div>
    </div>


    <div class="bottombar flex-zero">
      <button @click="donePressed()" class="btn btn-lg btn-clear btn-block">DONE</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import activities from '../../js/activity'
import Drawer from '../common/Drawer'

export default {
  data () {
    return {
      adjectiveWords: [],
      hidePairings: false
    }
  },
  computed: {
    ...mapGetters({
      words: 'getCurrentWords',
      getCurrentActivity: 'getCurrentActivity'
    }),
    title: function () {
      return activities.manager.titleForType(this.getCurrentActivity)
    }
  },
  props: ['data'],
  components: { Drawer },
  methods: {
    adjectiveText (wordSelection) {
      return wordSelection ? wordSelection.toString() : ''
    },
    targetText (wordSelection) {
      return wordSelection ? wordSelection.toString() : ''
    },
    wordClass (word) {
      var found = this.adjectiveWords.find(w => word.verse === w.verse && word.index === w.index)
      return found ? ['red'] : []
    },
    donePressed: function () {
      this.$router.replace('/activities')
    }
  },
  mounted () {
    this.adjectiveWords = []
    this.data.collection.items.forEach(adj => adj.wordSelection.words.forEach(w => this.adjectiveWords.push(w)))
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors.less';

.container {
  position: relative;
  padding-top: 5px;
  overflow: hidden;
  &.collapsed {
    height: 28px;
  }
}
.adjective-item {
  padding: 6px;
  float: left;
  border-radius: 3px;
}
.adjective, .target {
  padding: 4px;
  border-radius: 3px;
}

.hide-show {
  position: absolute;
  top: 0;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  color: black;
  outline: none;
  border: none;
  border-radius: 4px;
  z-index: 101;
}
.shader {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 15px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
  z-index: 100;
}
.spacer {
  float:right;
  width:25px;
  height:36px;
}

.adjective-words {
  padding: 10px 15px;
  font-size: 18px;
}
</style>
