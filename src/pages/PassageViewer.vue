<template>
  <div>
    <titlebar :left-items="['back']" :on-back="goBack">
      <div slot="center" class="btn-group" role="group" aria-label="chapter-nav">
        <button type="button" @click="chapterBack()" class="btn btn-default"><span class="glyphicon glyphicon-chevron-left"></span></button>
        <button type="button" @click="bookNavSelected()" class="btn btn-default off">{{ bible.bookName(bookIdentifier) }} {{ chapter }}</button>
        <button type="button" @click="chapterForward()" class="btn btn-default"><span class="glyphicon glyphicon-chevron-right"></span></button>
      </div>
    </titlebar>

    <div class="container">
      <ul class="list-group">
        <h1 class="text-center muted" v-if="!verses">Loading...</h1>
        <li v-for="verse in verses" class="list-group-item verse" :class="{ 'selected': isSelected(verse) }" :data-verse="verse.number" @click="verseSelected($event.target)">
          <span class="verse-number">{{ verse.number }}</span> <span class="verse-text">{{ verse.text }}</span>
        </li>
      </ul>
    </div>

    <div class="actionbar">
      <p class="text-center accent">{{ actionText }}</p>
      <button @click="actionPressed()" class="btn btn-lg btn-primary btn-block" v-if="isPassageSelected">BEGIN</button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Bible, Verse } from '../js/bible.js'
import bibleLoader from '../js/bibleloader.js'
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
      startingVerse: undefined,
      endingVerse: undefined
    }
  },
  computed: {
    ...mapGetters(['getCurrentBible']),
    isPassageSelected: function () {
      return this.startingVerse !== undefined
    },
    actionText: function () {
      if (this.startingVerse !== undefined && this.endingVerse !== undefined) {
        return 'Begin, or tap verses to edit selection'
      } else if (this.startingVerse !== undefined) {
        return 'Select an ending verse, or begin'
      } else {
        return 'Select a starting verse'
      }
    },
    selectedVerses: function () {
      if (this.startingVerse !== undefined) {
        var a = []
        $('.verse.selected').each(function () {
          a.push(parseInt($(this).data('verse')))
        })
        return a
      }
    }
  },
  props: [],
  components: {
    Titlebar
  },
  mounted () {
    this.bookIdentifier = this.$route.query.book || 'MATTHEW'
    this.chapter = parseInt(this.$route.query.chapter) || 1
  },
  methods: {
    loadVerses () {
      var self = this
      bibleLoader.load(this.bookIdentifier, this.chapter, this.getCurrentBible, function (json) {
        self.verses = json
        $('html, body').animate({ scrollTop: 0 }, 'slow')
      })
    },
    goBack () {
      this.$router.back()
    },
    isSelected (verse) {
      if (this.bookIdentifier && this.chapter) {
        var bibleVerse = new Verse(this.bookIdentifier, this.chapter, verse.number)
        return Bible.passageContains(this.startingVerse, this.endingVerse, bibleVerse)
      }
      return false
    },
    verseSelected (element) {
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
          Vue.set(this.verses, 0, this.verses[0])
        }
      }
    },
    chapterBack () {
      this.chapter = this.chapter === 1 ? 1 : this.chapter - 1
    },
    chapterForward () {
      this.chapter = this.chapter === Bible.chapters(this.bookIdentifier) ? this.chapter : this.chapter + 1
    },
    bookNavSelected () {
      this.$router.push('/choosepassage')
    },
    actionPressed () {
      var selected = this.selectedVerses
      var versesArray = this.verses.slice(selected[0] - 1, selected[0] + selected.length - 1)
      var vm = this
      var passage = Bible.buildPassage(this.startingVerse, this.endingVerse)
      this.createNewStudy({passage: passage, verses: versesArray})
      .done(function () {
        vm.$router.push('/activities')
      })
      .fail(function () {
        window.alert('Failed to create study')
      })
    },
    ...mapActions(['createNewStudy'])
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
  }
}
</script>

<style lang="less" scoped>
@import '../../static/less/app.less';
@import '../../static/less/colors.less';
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

.btn-default {
  background-color: @color-back-raised;
  color: #fff;
  border-color: @color-back;
  box-shadow: @shadow;
}
.instruction-label {
  text-align: center;
  color: #ddd;
}
.selected-book {
  font-size: 18px;
  background-color: @color-back-raised;
  padding: 5px;
  border-radius: 1px;
}
.list-group-item.verse {
  background-color: @color-back-raised;
}
.verse {
  color: white;
  padding-top: 1px;
  padding-bottom: 1px;
  font-size: 18px;
}
.verse.selected, .verse.selected:hover {
  background-color: @color-selection1;
  color: @color-back;
}
.verse:hover {
  background-color: @color-back-raised2;
}
.verse-number {
  color: #999;
}
</style>
