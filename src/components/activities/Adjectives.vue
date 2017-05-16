<template>
  <div class="flex-column vfull">
    <div class="flex-one scrolly actions-content">
      <selectable-text ref="selectableText" :delegate="selectionDelegate"></selectable-text>
    </div>

    <div class="flex-zero bottombar nopad">
      <p v-if="!showAddButton" class="instruction">{{ instructionText }}</p>
      <div v-if="showAddButton" class="actionable-panel">
        <div class="actionable-label">SAVE ADJECTIVE</div>
      </div>
      <button v-if="showFinishButton" class="btn btn-actionable btn-block">FINISHED</button>
    </div>
  </div>
</template>

<script>
import SelectableText from '../SelectableText'
import { mapGetters } from 'vuex'
import { WordSelection, Adjective } from '../../js/models/ActivityData'
import activities from '../../js/activity'

export default {
  data () {
    return {
      selection: undefined,
      selectionDelegate: {
        onSelect: undefined,
        onMultiSelect: undefined
      }
    }
  },
  props: ['finish', 'data'],
  computed: {
    ...mapGetters({words: 'getCurrentWords'}),
    adjectives () {
      return this.data.items
    },
    instructionText () {
      return 'Select an adjective'
    },
    showAddButton () {
      return this.selection !== undefined
    },
    showFinishButton () {
      return this.adjectives && this.adjectives.length > 0 && this.selection !== undefined
    }
  },
  watch: {
  },
  components: {
    SelectableText
  },
  methods: {
    selectedWords () {
      return this.$refs.selectableText.selectedWords()
    },
    onSelect (word, index, attributes) {
      this.selection = this.selectedWords()
    },
    onMultiSelect (words, range) {
      this.onSelect(words.join(' '), range[0])
    },
    clear (step) {
      this.$refs.selectableText.clearSelection()
    },
    actionSelected () {
      var wordSelection = new WordSelection(this.selectedWords())
      var adjective = new Adjective(wordSelection, undefined)

      this.$refs.selectableText.highlightSelection(true)
      this.$refs.selectableText.fillSelection()

      this.data.collection.add(adjective)
    },
    setupData () {
      if (this.data && this.$refs.selectableText) {
        var self = this
        this.data.collection.items.forEach(function (adjectiveEntry) {
          self.$refs.selectableText.setFilled(adjectiveEntry.wordSelection)
        })
      }
    },
    willAppear () {
      this.setupData()
    },
    finishedClicked () {
      this.finish(activities.types.Adjectives, this.data)
    }
  },
  mounted () {
    this.selectionDelegate.onSelect = this.onSelect
    this.selectionDelegate.onMultiSelect = this.onMultiSelect
    this.setupData()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../../static/less/colors.less';
@import '../../../static/less/flex.less';

.instruction {
  text-align: center;
  color: @color-deemphasize;
}
.finished-button {
  margin-top: 8px;
}
.actions-content {
  height: 100%;
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
