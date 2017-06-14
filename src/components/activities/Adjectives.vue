<template>
  <div class="flex-column vfull">
    <div class="flex-one scrolly adjectives-content">
      <selectable-text ref="selectableText" :delegate="selectionDelegate"></selectable-text>
    </div>

    <div class="flex-zero bottombar noselect">
      <p v-if="isMode('start')" class="instruction muted">Select an adjective</p>
      <div class="text-center">
        <button v-if="isMode('selecting') && !isMode('detailing')" @click="helpSelectingPressed" class="btn callout-light"><i class="fa fa-question-circle-o"></i> How to select...</button>
      </div>
      <button v-if="isMode('selected')" @click="nextPressed" class="btn callout-light btn-block">NEXT</button>

      <div v-if="isMode('detailing')">
        <div class="detailing-label">
          <span class="current-adjective back-red">{{ currentAdjective.toString() }}</span>
          <i class="fa fa-long-arrow-right" />
          {{ currentTarget ? currentTarget.toString() : 'Select who or what is described.' }}
        </div>
        <div class="detailing">
          <selector-bar :next="nextAdjectivePressed" :previous="previousAdjectivePressed" click-title="DONE" :click="skipDetailing"></selector-bar>
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
import SelectorBar from '../common/SelectorBar'

export default {
  data () {
    return {
      mode: 'start',
      selection: undefined,
      selectionDelegate: {
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
    SelectableText, SelectorBar
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
      this.$refs.selectableText.muteSelectedWords()
      this.$refs.selectableText.clearHighlight()
      this.$refs.selectableText.highlightWords(this.currentAdjective.words)
      this.$refs.selectableText.unmuteWords(this.currentAdjective.words)
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
}
.detailing-label {
  padding: 0px 5px;
  margin-bottom: 15px;
  text-align: center;
}
.current-adjective {
  padding: 2px 4px;
  border-radius: 4px;
  text-shadow: 1px 0px 1px black;
}

</style>
