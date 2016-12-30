<template>
  <div class="flex-v">
    <div class="flex-1">
      <div class="container">
        <ul class="list-group">
          <li v-for="verse in getCurrentStudy.verses" class="list-group-item verse-container" :data-verse="verse.number" @click="verseSelected($event.target)">
            <div class="verse">
              <span class="verse-number">{{ verse.number }}</span> <span class="verse-text">{{ verse.text }}</span>
            </div>
            <div class="paraphrase">
              <div class="paraphrase-input" contenteditable="true">
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="actionbar-flex">
      <p class="paraphrasing-summary text-center muted"></p>
      <button class="btn btn-actionable btn-block" @click="donePressed()">DONE</button>
    </div>

  </div>
</template>

<script>
import $ from 'jquery'
import { mapGetters } from 'vuex'
import activities from '../../js/activity'
import { Bible, Verse } from '../../js/bible'
import { FreeText } from '../../js/models/ActivityData'

export default {
  data () {
    return {
      activityType: activities.types.Paraphrase,
      currentVerse: undefined
    }
  },
  computed: {
    ...mapGetters(['getCurrentStudy'])
  },
  props: ['finish', 'data'],
  methods: {
    verseSelected (targetNode) {
      $('.verse-container.selected').removeClass('selected')
      $('.paraphrasing').removeClass('paraphrasing')
      var verseContainer = $(targetNode).closest('.verse-container')
      verseContainer.addClass('selected')
      var paraphraseInput = verseContainer.find('.paraphrase-input')
      var paraphrasingVerseRange = determineParaphrasingRange(verseContainer)
      paraphraseInput.focus()
      this.setParaphrasingSummaryLabel(paraphrasingVerseRange)
    },
    setParaphrasingSummaryLabel (paraphrasingVerseRange) {
      if (paraphrasingVerseRange.length === 1) {
        $('.paraphrasing-summary').text('Paraphrasing verse ' + paraphrasingVerseRange[0])
      } else {
        var endVerse = paraphrasingVerseRange[paraphrasingVerseRange.length - 1]
        $('.paraphrasing-summary').text('Paraphrasing verses ' + paraphrasingVerseRange[0] + '-' + endVerse)
      }
    },
    donePressed () {
      if ($('.paraphrase-input').last().is(':empty')) {
        window.alert('You should paraphrase all verses.')
      } else {
        var book = this.getCurrentStudy.passage.start.book
        var chapter = this.getCurrentStudy.passage.start.chapter
        var self = this
        $('.paraphrase-input:not(:empty)').each(function () {
          var verseRange = determineParaphrasingRange($(this).closest('.verse-container'))
          var startVerse = new Verse(book, chapter, verseRange[0])
          var endVerse = new Verse(book, chapter, verseRange[verseRange.length - 1])
          var passage = Bible.buildPassage(startVerse, endVerse)
          self.data.collection.add(new FreeText($(this).text(), passage))
        })
        this.finish(this.activityType, this.data)
      }
    }
  },
  components: {
  },
  mounted () {
  }
}

function determineParaphrasingRange (currentVerseContainer) {
  var range = [currentVerseContainer.data('verse')]
  currentVerseContainer.prevAll('.verse-container').each(function () {
    var pInput = $(this).find('.paraphrase-input')
    if (pInput.text().length > 0) {
      return false
    }
    $(this).addClass('paraphrasing')
    range.push(this.dataset.verse)
  })
  return range.reverse()
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

.verse-container {
  padding: 0px;
  .paraphrase {
    padding-left: 5px;
    padding-right: 5px;
  }
  .paraphrase-input {
    &:empty {
      display: none;
    }
    color: @color-text-accent;
    width: 100%;
    border-radius: 4px;
    background-color: transparent;
    margin-top: 5px;
    margin-bottom: 12px;
    padding: 5px;
    font-size: 16px;
    outline: none;
    z-index: -10;
    &:focus {
      border-color: @color-actionable;
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 1px 7px @color-actionable;
    }
  }
  &.selected {
    .paraphrase-input {
      display: block;
    }
  }
  &.selected, &.paraphrasing {
    .verse {
      border-left: solid 2px @color-callout;
    }
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
</style>
