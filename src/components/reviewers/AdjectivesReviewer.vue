<template>
  <div v-if="data !== undefined" class="flex-v">
    <div class="flex-1">
      <div class="container" :class="{collapsed: hidePairings}">
        <button class="hide-show" @click="hidePairings = !hidePairings">
          <i v-if="hidePairings" class="fa fa-eye"></i>
          <i v-else class="fa fa-eye-slash"></i>
        </button>
        <div v-for="adjective in data.collection.items" class="adjective-item">
          <span class="adjective">{{ adjectiveText(adjective.wordSelection) }}</span>
          <span v-if="adjective.target" class="target">{{ targetText(adjective.target) }}</span>
        </div>
        <div v-if="hidePairings" class="shader"></div>
      </div>

      <div class="adjective-words">
        <span :key="index" v-for="(word, index) in words" :class="wordClass(word)">{{ word.text }} </span>
      </div>
    </div>


    <div class="actionbar-flex">
      <button @click="donePressed()" class="btn btn-lg btn-primary btn-block">DONE</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import activities from '../../js/activity'

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
  methods: {
    adjectiveText (wordSelection) {
      return wordSelection ? wordSelection.toString() : ''
    },
    targetText (wordSelection) {
      return wordSelection ? wordSelection.toString() : ''
    },
    wordClass (word) {
      var found = this.adjectiveWords.find(w => word.verse === w.verse && word.index === w.index)
      return found ? ['selected'] : []
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
  border: solid 1px @color-back-raised2;
  border-radius: 3px;
}
.adjective, .target {
  padding: 4px;
  border-radius: 3px;
  text-shadow: 1px 0px 1px black;
}
.adjective {
  background-color: @color-highlight-red;
}
.target {
  background-color: @color-highlight-purple;
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

.adjective-words {
  margin-top: 10px;
  border-top: solid 1px @color-back-raised2;
  padding: 10px 15px;
  font-size: 18px;
  .selected {
    color: @color-highlight-red;
  }
}
</style>
