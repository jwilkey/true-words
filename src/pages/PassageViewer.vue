<template>
  <div>
    <titlebar :left-items="['back']" :on-back="goBack">
      <div slot="center" class="btn-group" role="group" aria-label="chapter-nav">
        <button type="button" @click="chapterBack()" class="btn theme-mid shadow"><span class="glyphicon glyphicon-chevron-left"></span></button>
        <button type="button" @click="bookNavSelected()" class="btn theme-mid shadow off">{{ bible.bookName(bookIdentifier) }} {{ chapter }}</button>
        <button type="button" @click="chapterForward()" class="btn theme-mid shadow"><span class="glyphicon glyphicon-chevron-right"></span></button>
      </div>
      <div slot="right">
        <span class="verses-style glyphicon" :class="readingModeButtonClass" @click="toggleTextStyle()"></span>
      </div>
    </titlebar>

    <div class="flex-column vfull">
      <div class="flex-one substance">
        <div class="container verses" :class="{loading: loading, inline: readingMode === 'inline'}">

          <p class="text-center muted" v-if="!verses"><i class="fa fa-circle-o-notch fa-2x fa-spin" /></p>

          <div v-for="verse in verses" class="verse theme-mid" :class="{ hover: !readOnly, selected: isSelected(verse) }" :data-verse="verse.number" @click="verseSelected($event.target)">
            <span class="verse-number font-smaller muted">{{ verse.number }}</span><span class="verse-text">{{ verse.text }}</span>
          </div>
        </div>

        <div class="navigation">
          <button @click="chapterBack()" class="btn btn-navigate callout-light alt hover">PREV</button>
          <button @click="chapterForward()" class="btn btn-navigate callout-light alt hover">NEXT</button>
        </div>

        <div class="copyright muted-more font-small hi-top">
          {{ copyright }}
        </div>
      </div>

      <div v-if="!readOnly" class="bottombar flex-zero">
        <p class="text-center passage-instruction pulse">{{ actionText }}</p>
        <button @click="beginPressed()" class="btn btn-lg callout-light btn-block study-begin" v-if="isPassageSelected">BEGIN</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Bible, Verse } from '../js/bible.js'
import bibleLoader from '../js/bibleloader.js'
import biblecopyrights from '../js/bible-copyrights.js'
import { mapActions, mapGetters } from 'vuex'
import $ from 'jquery'
import Titlebar from '../components/Titlebar'

export default {
  data () {
    return {
      bible: Bible,
      bookIdentifier: undefined,
      chapter: undefined,
      verses: undefined,
      cachedVerses: {},
      startingVerse: undefined,
      endingVerse: undefined,
      readingMode: 'list',
      readOnly: false,
      loading: false
    }
  },
  components: {
    Titlebar
  },
  computed: {
    ...mapGetters(['getCurrentBible']),
    isPassageSelected () {
      return this.startingVerse !== undefined
    },
    actionText () {
      if (this.startingVerse !== undefined && this.endingVerse !== undefined) {
        return 'BEGIN, OR TAP VERSES TO EDIT SELECTION'
      } else if (this.startingVerse !== undefined) {
        return 'SELECT AN ENDING VERSE, OR BEGIN'
      } else {
        return 'SELECT A STARTING VERSE'
      }
    },
    readingModeButtonClass () {
      return this.readingMode === 'list' ? ['glyphicon-align-center'] : ['glyphicon-list']
    },
    copyright () {
      return biblecopyrights[this.getCurrentBible] || ''
    }
  },
  watch: {
    chapter: function (value) {
      if (this.bookIdentifier !== undefined && value > 0) {
        this.loadVerses()
      }
    },
    bookIdentifier: function (value) {
      if (this.chapter !== undefined) {
        this.loadVerses()
      }
    }
  },
  methods: {
    loadVerses () {
      var cache = this.getCache(this.getCurrentBible, this.bookIdentifier, this.chapter)
      if (cache !== undefined) {
        this.verses = cache
        $('.viewer').animate({ scrollTop: 0 }, 'slow')
      } else {
        var self = this
        this.loading = true
        bibleLoader.load(this.bookIdentifier, this.chapter, this.getCurrentBible, json => {
          json.forEach(v => { v.chapter = self.chapter })
          self.cacheVerses(self.getCurrentBible, self.bookIdentifier, self.chapter, json)
          self.verses = json
          self.loading = false
          $('.viewer').animate({ scrollTop: 0 }, 'slow')
        })
      }
    },
    goBack () {
      this.$router.back()
    },
    toggleTextStyle () {
      this.readingMode = this.readingMode === 'list' ? 'inline' : 'list'
    },
    isSelected (verse) {
      if (this.readOnly) { return false }

      if (this.bookIdentifier && this.chapter) {
        var bibleVerse = new Verse(this.bookIdentifier, this.chapter, verse.number)
        return Bible.passageContains(this.startingVerse, this.endingVerse, bibleVerse)
      }
      return false
    },
    getCache (bibleVersion, book, chapter, verses) {
      if (this.cachedVerses[bibleVersion]) {
        if (this.cachedVerses[bibleVersion][book]) {
          return this.cachedVerses[bibleVersion][book][chapter]
        }
      }
      return undefined
    },
    cacheVerses (bibleVersion, book, chapter, verses) {
      if (this.cachedVerses[bibleVersion] === undefined) {
        this.cachedVerses[bibleVersion] = {}
      }
      if (this.cachedVerses[bibleVersion][book] === undefined) {
        this.cachedVerses[bibleVersion][book] = {}
      }
      this.cachedVerses[bibleVersion][book][chapter] = verses
    },
    verseSelected (element) {
      if (this.readOnly) { return }

      var verseElement = element.closest('.verse')
      var selectedVerseNumber = $(verseElement).data('verse')
      var bibleVerse = new Verse(this.bookIdentifier, this.chapter, selectedVerseNumber)
      if (this.startingVerse === undefined) {
        this.startingVerse = bibleVerse
      } else if (this.startingVerse.equals(bibleVerse)) {
        this.startingVerse = undefined
        this.endingVerse = undefined
      } else {
        if (bibleVerse.isAfter(this.startingVerse)) {
          this.endingVerse = bibleVerse
        } else {
          this.endingVerse = this.endingVerse || this.startingVerse
          this.startingVerse = bibleVerse
        }
        Vue.set(this.verses, 0, this.verses[0])
      }
    },
    chapterBack () {
      this.chapter = this.chapter === 1 ? 1 : this.chapter - 1
    },
    chapterForward () {
      this.chapter = this.chapter === Bible.chapters(this.bookIdentifier) ? this.chapter : this.chapter + 1
    },
    bookNavSelected () {
      this.cachedVerses = {}
      this.$router.push('/choosepassage')
    },
    getVerses () {
      const self = this
      var cachedBook = this.cachedVerses[this.getCurrentBible][this.bookIdentifier]
      var verses = cachedBook[this.startingVerse.chapter].filter(v => v.number >= self.startingVerse.number)
      if (this.endingVerse.chapter > this.startingVerse.chapter) {
        for (var i = this.startingVerse.chapter + 1; i <= this.endingVerse.chapter; i++) {
          if (i === this.endingVerse.chapter) {
            verses = verses.concat(cachedBook[i].filter(v => v.number <= this.endingVerse.number))
          } else {
            verses = verses.concat(cachedBook[i])
          }
        }
      } else {
        verses = verses.filter(v => v.number <= self.endingVerse.number)
      }
      return verses
    },
    beginPressed () {
      var versesArray = this.getVerses()
      var passage = Bible.buildPassage(this.startingVerse, this.endingVerse)
      var self = this
      this.alert('SAVING...')
      this.createNewStudy({passage: passage, verses: versesArray})
      .done(function () {
        self.cachedVerses = {}
        self.$router.push('/activities')
      })
      .fail(function () {
        self.alert('Failed to create study', 'ok')
      })
      .always(self.dismissAlert)
    },
    ...mapActions(['createNewStudy'])
  },
  mounted () {
    this.readOnly = this.$route.query.read_only
    this.bookIdentifier = this.$route.query.book || 'MATTHEW'
    this.chapter = parseInt(this.$route.query.chapter) || 1
  }
}
</script>

<style lang="less" scoped>
@import '../../static/less/app';
@import '../../static/less/colors';
@import '../../static/less/flex';
@import '../../static/less/common';

.navigation {
  text-align: center;
  padding: 30px 0;
  .btn-navigate {
    border: none;
    border-radius: 0px;
    &:first-child {
      border-right: solid 1px @color-deemphasize;
    }
  }
}
.fa-circle-o-notch {
  font-size: 27px;
  margin-top: 15px;
}
.passage-instruction {
  margin: 0;
}
.study-begin {
  margin-top: 8px;
}
.center-wrapper {
  height: 100%;
  text-align: center;
}
.center-wrapper:before {
  content: "";
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
.center {
  display: inline-block;
  vertical-align: middle;
}

.verses {
  transition: opacity 0.5s;
  padding: 0px 5px;
  &.loading {
    opacity: 0.5;
  }
  .verse {
    padding: 1px 15px 1px 15px;
    margin-bottom: 2px;
    transition: background-color 0.3s;
  }
  .verse.selected, .verse.selected:hover {
    background-color: @color-highlight-blue;
    color: @color-highlight-contrast;
  }
  .verse-number {
    padding-right: 2px;
    vertical-align: super;
  }
  &.inline {
    padding-left: 20px;
    padding-right: 20px;
    background-color: transparent;
    .verse {
      display: inline;
      background-color: transparent;
      padding: 0px 7px 0px 0px;
      margin-bottom: 0px;
      &.selected, &.selected:hover {
        color: @color-highlight-blue;
        background-color: transparent;
      }
    }
  }
}
.copyright {
  padding: 20px;
}
</style>
