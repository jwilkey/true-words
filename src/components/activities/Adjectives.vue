<template>
  <div class="flex-column vfull">
    <div class="flex-one scrolly adjectives-content">
      <selectable-text ref="selectableText" :delegate="selectionDelegate"></selectable-text>
    </div>

    <div class="flex-zero bottombar">
      <p v-if="isMode('start')" class="instruction">Select an adjective</p>
      <button v-if="isMode('selecting') && !isMode('detailing')" @click="helpSelectingPressed" class="btn btn-primary"><i class="fa fa-question-circle-o"></i> How to select...</button>
      <button v-if="isMode('selected')" @click="nextPressed" class="btn btn-actionable btn-block">NEXT</button>

      <div v-if="isMode('detailing')">
        <div class="detailing-label">
          <span class="current-adjective">{{ currentAdjective.toString() }}</span>
          <i class="fa fa-long-arrow-right" />
          {{ currentTarget ? currentTarget.toString() : 'Select who or what is described.' }}
        </div>
        <div class="detailing flex-row">
          <div @click="previousAdjectivePressed" class="navigate-adjective"><i class="fa fa-chevron-left" /></div>
          <div @click="skipDetailing" class="flex-two finish-button">DONE</div>
          <div @click="nextAdjectivePressed" class="navigate-adjective"><i class="fa fa-chevron-right" /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SelectableText from '../SelectableText'
import { mapGetters } from 'vuex'
import { Adjective } from '../../js/models/ActivityData'
import activities from '../../js/activity'

export default {
  data () {
    return {
      mode: 'start',
      selection: undefined,
      selectionDelegate: {
        onSelect: undefined,
        onFocus: undefined,
        onChange: undefined
      },
      isSelecting: false,
      finishedSelecting: false,
      detailingAdjectiveIndex: 0
    }
  },
  props: ['finish', 'data'],
  computed: {
    ...mapGetters({words: 'getCurrentWords'}),
    adjectives () {
      return this.data.collection.items
    },
    currentAdjective () {
      return this.adjectives[this.detailingAdjectiveIndex].wordSelection
    },
    currentTarget () {
      return this.adjectives[this.detailingAdjectiveIndex].target
    },
    showStartText () {
      return !this.isSelecting && this.adjectives && this.adjectives.length === 0
    },
    showFinishButton () {
      return this.adjectives && this.adjectives.length > 0 && !this.isSelecting
    }
  },
  components: {
    SelectableText
  },
  methods: {
    isMode (mode) {
      switch (mode) {
        case 'detailing': return this.finishedSelecting
        case 'selecting': return this.isSelecting
        case 'start': return !this.isSelecting && this.adjectives.length === 0
        case 'selected': return !this.isSelecting && !this.finishedSelecting && this.adjectives.length > 0
        default: return false
      }
    },
    selectedWords () {
      return this.$refs.selectableText.selectedWords()
    },
    onSelect (word, index, attributes) {
      this.selection = this.selectedWords()
    },
    onSelectionChange (wordSelection, operation) {
      if (this.isMode('detailing')) {
        this.$refs.selectableText.clearFill(wordSelection.words)
        this.adjectives[this.detailingAdjectiveIndex].target = wordSelection
        this.highlighCurrentAdjective()
      } else if (operation === 'SELECT') {
        this.data.collection.items.push(new Adjective(wordSelection))
      } else if (operation === 'DESELECT') {
        this.adjectives.every((adj, i) => {
          if (adj.wordSelection.equals(wordSelection)) {
            this.data.collection.items.splice(i, 1)
            return false
          }
          return true
        })
      }
    },
    onSelectionFocus (isFocused) {
      this.isSelecting = isFocused
    },
    helpSelectingPressed () {
      this.alert('Swipe right to extend the end of your selection\nSwipe left to decrease the end of your selection.\nSwipe up to extend the beginning of your selection\nSwipe down to decrease the beginning. \nTap once to finish selecting. \nTap twice to remove selection.', 'ok')
    },
    highlighCurrentAdjective () {
      this.$refs.selectableText.clearHighlight()
      this.$refs.selectableText.highlightWords(this.currentAdjective.words)
      if (this.currentTarget) {
        this.$refs.selectableText.highlightWords(this.currentTarget.words)
      }
      this.$refs.selectableText.scrollTo(this.currentAdjective.words)
    },
    nextPressed () {
      this.finishedSelecting = true
      this.highlighCurrentAdjective()
    },
    nextAdjectivePressed () {
      this.detailingAdjectiveIndex += 1
      if (this.detailingAdjectiveIndex === this.adjectives.length) {
        this.detailingAdjectiveIndex = 0
      }
      this.highlighCurrentAdjective()
    },
    previousAdjectivePressed () {
      this.detailingAdjectiveIndex -= 1
      if (this.detailingAdjectiveIndex === -1) {
        this.detailingAdjectiveIndex = this.adjectives.length - 1
      }
      this.highlighCurrentAdjective()
    },
    skipDetailing () {
      this.finish(activities.types.Adjectives, this.data)
    },
    setupData () {
      if (this.data && this.$refs.selectableText) {
        var self = this
        this.data.collection.items.forEach(adjectiveEntry => {
          self.$refs.selectableText.setSelected(adjectiveEntry.wordSelection.words)
        })
      }
    },
    willAppear () {
      this.setupData()
      this.finishedSelecting = false
    },
    finishedPressed () {
      this.finish(activities.types.Adjectives, this.data)
    }
  },
  mounted () {
    this.selectionDelegate.onSelect = this.onSelect
    this.selectionDelegate.onChange = this.onSelectionChange
    this.selectionDelegate.onFocus = this.onSelectionFocus
    this.setupData()
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors.less';
@import '../../../static/less/flex.less';
@import '../../../static/less/common.less';

.instruction {
  text-align: center;
  color: @color-deemphasize;
  font-size: 17px;
  margin: 0px;
}
.adjectives-content {
  height: 100%;
  padding-top: 5px;
  padding-bottom: 5px;
}
.detailing {
  .noselect;
  border-radius: 6px;
  overflow: hidden;
  text-align: center;
  font-size: 18px;
  margin-bottom: 5px;
  .finish-button {
    padding: 7px 10px;
    background-color: @color-actionable;
    text-shadow: 1px 0px 1px black;
    margin: 0 3px;
    font-weight: bolder;
    letter-spacing: 1.5px;
    cursor: pointer;
    &:hover {
      background-color: @color-actionable-focus;
    }
  }
  .navigate-adjective {
    min-width: 90px;
    background-color: @color-actionable;
    text-shadow: 1px 0px 1px black;
    padding: 7px 10px;
    cursor: pointer;
    .hint {
      font-size: 14px;
    }
    &:hover {
      background-color: @color-actionable-focus;
    }
  }
}
.detailing-label {
  padding: 0px 5px;
  margin-bottom: 15px;
  text-align: center;
}
.current-adjective {
  background-color: @color-highlight-red;
  padding: 2px 4px;
  border-radius: 4px;
  text-shadow: 1px 0px 1px black;
}

.actionable-panel {
  display: table;
  width: 100%;
  min-height: 80px;
  background-color: @color-actionable;
  background: linear-gradient(@color-actionable-focus 0px, @color-actionable 20px, @color-actionable);
  .actionable-label {
    display: table-cell;
    width: 100%;
    vertical-align: middle;
    text-align: center;
    font-size: 24px;
    text-shadow: 1px 0px 1px rgba(50,50,50,0.8);
    letter-spacing: 1px;
  }
}

</style>
