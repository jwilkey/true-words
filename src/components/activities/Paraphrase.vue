<template>
  <div class="flex-column vfull">
    <div id="paraphrase-container" class="flex-zero shadow-long theme-mid">
      <div class="paraphrase-input input" contenteditable="true">

      </div>
      <div class="paraphrase-menu">
        <button id="paraphrase-collapse" class="btn theme-mid shadow btn-xs" @click="toggleParaphraseCollapse()">
          <span class="glyphicon glyphicon-triangle-top"></span>
          <span class="glyphicon glyphicon-triangle-bottom"></span>
        </button>
        <p class="paraphrasing-summary muted"></p>
        <button id="paraphrase-done" class="btn callout-light btn-xs" @click="doneParaphrasing()">DONE</button>
      </div>
    </div>

    <div class="flex-one substance content">
      <div class="container">
        <div v-for="verse in getCurrentStudy.verses" class="verse-container" :data-verse="verse.number" @click="verseSelected($event.target)">
          <div class="verse theme-mid hover">
            <span class="verse-number muted"><span v-if="verse.number === 1">{{verse.chapter}}:</span>{{ verse.number }}</span> <span class="verse-text">{{ verse.text }}</span>
          </div>
          <div class="paraphrase muted">
          </div>
        </div>
      </div>
    </div>

    <div class="flex-zero bottombar">
      <button class="btn callout-light btn-block" @click="donePressed()">FINISHED</button>
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
      currentVerse: undefined,
      paraphrasingVerse: undefined
    }
  },
  computed: {
    ...mapGetters(['getCurrentStudy'])
  },
  props: ['finish', 'data'],
  methods: {
    willAppear () {
      this.setupData()
    },
    setupData () {
      this.data.collection.items.forEach(function (freeText) {
        var verse = freeText.passage.end.number
        var verseContainer = $('.verse-container[data-verse=' + verse + ']')
        verseContainer.find('.paraphrase').text(freeText.text)
      })
    },
    verseSelected (targetNode) {
      if (this.paraphrasingVerse) {
        return
      }

      var verseContainer = $(targetNode).closest('.verse-container')
      this.paraphrasingVerse = verseContainer
      $('.paraphrasing').removeClass('paraphrasing')
      $('.paraphrase-input').text(verseContainer.find('.paraphrase').text())
      $('#paraphrase-container').removeClass('collapsed')
      $('#paraphrase-container').show()
      $('.paraphrase-input').focus()
      $('.content').addClass('keyboard')
      var paraphrasingVerseRange = determineParaphrasingRange(verseContainer)
      this.setParaphrasingSummaryLabel(paraphrasingVerseRange)
      $('.verse-container').addClass('disabled')
    },
    doneParaphrasing () {
      $('#paraphrase-container').hide()
      var input = $('.paraphrase-input').text()
      $('.paraphrase-input').text('')
      $(this.paraphrasingVerse).find('.paraphrase').text(input)
      this.paraphrasingVerse = undefined
      $('.paraphrasing').removeClass('paraphrasing')
      $('.verse-container').removeClass('disabled')
      $('.content').removeClass('keyboard')
    },
    toggleParaphraseCollapse () {
      $('#paraphrase-container').toggleClass('collapsed')
      if (!$('#paraphrase-container').hasClass('collapsed')) {
        $('.paraphrase-input').focus()
      }
    },
    setParaphrasingSummaryLabel (paraphrasingVerseRange) {
      if (paraphrasingVerseRange.length === 1) {
        $('.paraphrasing-summary').text('Paraphrase v.' + paraphrasingVerseRange[0])
      } else {
        var endVerse = paraphrasingVerseRange[paraphrasingVerseRange.length - 1]
        $('.paraphrasing-summary').text('Paraphrase vs.' + paraphrasingVerseRange[0] + '-' + endVerse)
      }
    },
    donePressed () {
      if ($('.paraphrase').last().is(':empty')) {
        this.alert('You must paraphrase at least the last verse.', 'ok')
      } else {
        var book = this.getCurrentStudy.passage.start.book
        var chapter = this.getCurrentStudy.passage.start.chapter
        var self = this
        this.data.collection.clear()
        $('.paraphrase:not(:empty)').each(function () {
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
    this.setupData()
  }
}

function determineParaphrasingRange (currentVerseContainer) {
  var range = [currentVerseContainer.data('verse')]
  currentVerseContainer.addClass('paraphrasing')
  currentVerseContainer.prevAll('.verse-container').each(function () {
    var pInput = $(this).find('.paraphrase')
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
@import '../../../static/less/colors';
@import '../../../static/less/app';
@import '../../../static/less/flex';

#paraphrase-container {
  display: none;
  padding: 10px;
  z-index: 10;
  .paraphrase-input {
    border-radius: 4px;
    padding: 3px;
    margin-bottom: 10px;
    outline: none;
  }
  .paraphrase-menu {
    display: table;
    width: 100%;
    #paraphrase-collapse {
      display: table-cell;
      margin-right: 10px;
      .glyphicon {
        transform: translateY(2px);
      }
      .glyphicon-triangle-bottom {
        display: none;
      }
    }
    .paraphrasing-summary {
      display: table-cell;
      vertical-align: middle;
      width: 100%;
      margin-bottom: 0px;
      font-size: 15px;
    }
    #paraphrase-done {
      display: table-cell;
      letter-spacing: 0.5px;
    }
  }
  &.collapsed {
    .paraphrase-input {
      display: none;
    }
    #paraphrase-collapse {
      .glyphicon-triangle-bottom {
        display: inherit;;
      }
      .glyphicon-triangle-top {
        display: none;
      }
    }
  }
}
.content.keyboard {
  padding-bottom: 400px;
}
.verse-container {
  padding: 0px;
  margin-bottom: 2px !important;
  .verse {
    padding: 5px;
    transition: background-color 0.5s, padding 0.5s;
  }
  .verse-number {
    vertical-align: super;
    font-size: 12px;
  }
  .paraphrase {
    padding: 5px;
    margin-top: 5px;
    margin-bottom: 8px;
    z-index: -10;
    &:empty {
      display: none;
    }
  }
  &.selected, &.paraphrasing {
    .verse {
      border-left: solid 2px @color-highlight-red;
    }
  }
  &.disabled {
    .verse {
      background-color: transparent;
      padding-top: 1px;
      padding-bottom: 1px;
    }
  }
}
</style>
