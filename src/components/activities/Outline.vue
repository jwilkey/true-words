<template>
  <div class="flex-v">
    <div class="flex-1">
      <div class="container content">
        <div class="row section-container" :key="sectionIndex" v-for="(section, sectionIndex) in data.collection.items">
          <div class="col-xs-12">
            <section-vue class="section-content" :section="section" :index="sectionIndex" :allows-sub-sections="true" :delete="deleteSection"></section-vue>

            <span class="word" :key="index" v-for="(word, index) in wordsBySection[section.id]" @click="wordSelected(section, index, sectionIndex)">{{ word.text }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="actionbar-flex">
      <div>
        <button id="outline-action" class="btn btn-actionable btn-block" :class="{disabled: !isOutlined()}" @click="finishedClicked()">FINISHED</button>
      </div>
    </div>
  </div>
</template>

<script>
import SelectableText from '../SelectableText'
import { mapGetters } from 'vuex'
import $ from 'jquery'
import { Section } from '../../js/models/ActivityData'
import activities from '../../js/activity'
import { WordRange } from '../../js/bible'
import images from '../../js/images'
import { arrayLast, arrayEmpty } from '../../js/polyfill'
import SectionVue from './templates/Section'

export default {
  data () {
    return {
      wordsBySection: {}
    }
  },
  props: ['finish', 'data'],
  computed: {
    ...mapGetters(['getCurrentWords']),
    paddingBottom () {
      return $('.actionbar').height() + 18
    }
  },
  components: {
    SelectableText, SectionVue
  },
  methods: {
    wordSelected (section, wordIndex, sectionIndex) {
      var currentWords = this.wordsBySection[section.id]
      var newWordSection = currentWords.splice(wordIndex, currentWords.length - wordIndex)
      var newSection = new Section('', new WordRange(newWordSection[0], arrayLast(newWordSection)))

      this.wordsBySection[newSection.id] = newWordSection

      var newIndex = sectionIndex + 1
      this.data.collection.items.splice(newIndex, 0, newSection)

      recalculateWordRanges(this.data, this.wordsBySection)

      this.$nextTick(function () {
        images.svgs()
        $('.section-title.root > .section-edit').focus()
      })
    },
    deleteSection (section, sectionIndex) {
      if (sectionIndex === 0) {
        this.alert('You must provide a section title at the beginning of the passage.', 'ok')
      } else {
        var sections = this.data.collection.items
        var previousSection = sections[sectionIndex - 1]

        this.wordsBySection[previousSection.id] = this.wordsBySection[previousSection.id].concat(this.wordsBySection[section.id])
        this.wordsBySection[section.id] = undefined

        sections.splice(sectionIndex, 1)
        previousSection.wordRange.endingWord = arrayLast(this.wordsBySection[previousSection.id])
      }
    },
    isOutlined () {
      return !arrayEmpty(this.data.collection.items) && this.data.collection.items[0].title.length > 0
    },
    finishedClicked () {
      if (this.isOutlined()) {
        this.finish(activities.types.Outline, this.data)
      } else {
        this.alert('You must provide at least one section title', 'ok')
      }
    }
  },
  watch: {
    data: function (newData, oldVal) {
      this.wordsBySection = assessWordsBySection(newData, this.getCurrentWords)
    }
  },
  mounted () {
    this.wordsBySection = assessWordsBySection(this.data, this.getCurrentWords)
    this.$nextTick(function () { images.svgs() })
  }
}

function assessWordsBySection (data, words) {
  var wordsBySection = {}
  data.collection.items.forEach(function (section) {
    var wordsForSection = words.filter(function (word) {
      return section.wordRange.includes(word)
    })
    wordsBySection[section.id] = wordsForSection
  })
  return wordsBySection
}

function recalculateWordRanges (data, wordsBySection) {
  data.collection.items.forEach(function (section) {
    var words = wordsBySection[section.id]
    section.wordRange = new WordRange(words[0], arrayLast(words))
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../../static/less/colors.less';
@import '../../../static/less/words.less';
.container.content {
  padding-bottom: 30px;
}
.section-container {
  margin-bottom: 15px;
  .section-content {
    margin-bottom: 10px;
  }
}
</style>
