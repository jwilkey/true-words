<template>
  <div class="titlebar">
    <div class="titlebar-item-group">
      <a class="titlebar-item pull-left" v-link="'choosepassage'"><span class="glyphicon glyphicon-menu-left"></span></a>
    </div>
    <div class="text-center">
      <div class="btn-group" role="group" aria-label="chapter-nav">
        <button type="button" @click="chapterBack()" class="btn btn-default"><span class="glyphicon glyphicon-chevron-left"></span></button>
        <button type="button" v-link="'choosepassage'" class="btn btn-default off">{{ bible.bookName(bookIdentifier) }} {{ chapter }}</button>
        <button type="button" @click="chapterForward()" class="btn btn-default"><span class="glyphicon glyphicon-chevron-right"></span></button>
      </div>
    </div>
    <div class="titlebar-item-group right">
      <div class="titlebar-item pull-right" onclick="window.alert('help dialog coming soon!')"><span class="glyphicon glyphicon-question-sign"></span></div>
    </div>
  </div>

  <div class="container">
    <ul class="list-group">
      <li v-for="verse in verses" class="list-group-item verse" v-bind:class="{ 'selected': isSelected(verse) }" data-verse="{{ verse.number }}" @click="verseSelected($event.target)">
        <span class="verse-number">{{ verse.number }}</span> {{ verse.text }}
      </li>
    </ul>
  </div>

  <div class="actionbar">
    <button class="btn btn-primary btn-block disabled" v-bind:class="{'disabled': !isPassageSelected}">{{ actionText }}</button>
  </div>
</template>

<script>
import store from '../../vuex/store'
import bible from '../js/bible.js'
import bibleLoader from '../js/bibleloader.js'
import $ from 'jquery'

export default {
  data () {
    return {
      bible: bible,
      bookIdentifier: undefined,
      chapter: undefined,
      verses: undefined,
      startingVerse: undefined,
      endingVerse: undefined
    }
  },
  computed: {
    isPassageSelected: function () {
      return this.startingVerse !== undefined && this.endingVerse !== undefined
    },
    actionText: function () {
      if (this.isPassageSelected) {
        return 'BEGIN'
      } else if (this.startingVerse !== undefined) {
        return 'SELECT AN ENDING VERSE...'
      } else {
        return 'SELECT A STARTING VERSE...'
      }
    }
  },
  props: [],
  components: {
  },
  ready () {
    this.bookIdentifier = this.$route.query.book || 'MATTHEW'
    this.chapter = parseInt(this.$route.query.chapter) || 1
  },
  methods: {
    loadVerses () {
      var c = this
      bibleLoader.load(this.bookIdentifier, this.chapter, function (json) {
        c.verses = json
        $('html, body').animate({ scrollTop: 0 }, 'slow')
      })
    },
    isSelected (verse) {
      var bibleReference = bible.buildReference(this.bookIdentifier, this.chapter, verse.number)
      var startingVerseComparison = bible.compareReferences(this.startingVerse, bibleReference)
      if (startingVerseComparison === 0) {
        return true
      } else if (this.endingVerse !== undefined) {
        var endingVerseComparison = bible.compareReferences(bibleReference, this.endingVerse)
        if (endingVerseComparison === 0 || (startingVerseComparison === 1 && endingVerseComparison === 1)) {
          return true
        }
        return false
      }
    },
    verseSelected (verseElement) {
      var selectedVerse = $(verseElement).data('verse')
      var bibleReference = bible.buildReference(this.bookIdentifier, this.chapter, selectedVerse)
      if (this.startingVerse === undefined) {
        this.startingVerse = bibleReference
        $(verseElement).addClass('selected')
      } else if (this.endingVerse === undefined) {
        if (bible.compareReferences(this.startingVerse, bibleReference) === 1) {
          this.endingVerse = bibleReference
          this.verses.$set(0, this.verses[0])
          $('.actionbar button').removeClass('disabled')
        }
      }
    },
    chapterBack () {
      this.chapter = this.chapter === 1 ? 1 : this.chapter - 1
    },
    chapterForward () {
      this.chapter = this.chapter === bible.chapters(this.bookIdentifier) ? this.chapter : this.chapter + 1
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
  store,
  vuex: {
    actions: {
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../static/less/app.less';
@import '../../static/less/colors.less';
.fade-transition {
  transition: opacity .3s ease;
}
.fade-enter, .fade-leave {
  opacity: 0;
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
