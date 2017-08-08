<template>
  <div>
    <titlebar title="BIBLE" :left-items="['home']">
        <a slot="right" @click="chooseBible()">{{ getCurrentBible }}</a>
    </titlebar>

    <div class="container substance theme-back">
      <div class="flex-row testament-tabs">
        <button @click="toggleTestament('OT')" class="btn flex-one callout-light" :class="{alt: testament === 'NT'}">OLD TESTAMENT</button>
        <button @click="toggleTestament('NT')" class="btn flex-one callout-light" :class="{alt: testament === 'OT'}">NEW TESTAMENT</button>
      </div>

      <div id="passageChooser">
        <div v-if="!selectedBook">
          <div id="ot-chooser" v-if="testament === 'OT'" class="clearfix">
            <div class="col-xs-6 col-sm-3 col-md-5c book" v-for="(book, index) in otBooks">
              <div :key="index" @click='bookSelected($event.target)' class='book-name font-large shadow theme-mid hover' :data-book="book.identifier">{{ book.name }}</div>
            </div>
          </div>

          <div id="nt-chooser" v-if="testament === 'NT'" class="clearfix">
            <div class="col-xs-6 col-sm-3 col-md-5c book" v-for="(book, index) in ntBooks">
              <div :key="index" @click='bookSelected($event.target)' class='book-name font-large shadow theme-mid hover' :data-book="book.identifier">{{ book.name }}</div>
            </div>
          </div>
        </div>

        <div v-if="selectedBook" id="chapter-chooser" class="clearfix">
          <p class="selected-book font-large text-center theme-mid">{{ selectedBookName }}</p>
          <div class="col-xs-2 col-md-1 chapter" v-for="(n, index) in chapterCount">
            <div class="chapter-sizer"></div>
            <div :key="index" @click='chapterSelected($event.target)' class='chapter-label-container' :data-chapter="n">
              <p class="chapter-label font-large shadow theme-mid hover">{{ n }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { mapGetters } from 'vuex'
import Titlebar from '../components/Titlebar'
import { Bible } from '../js/bible.js'
import PassageViewer from '../pages/PassageViewer'

export default {
  data () {
    return {
      otBooks: Bible.otBooks,
      testament: 'NT',
      selectedBook: undefined,
      selectedBookName: Bible.bookName(this.selectedBook),
      selectedChapter: 1,
      chapterCount: 0,
      ntBooks: Bible.ntBooks
    }
  },
  computed: {
    ...mapGetters(['getCurrentBible'])
  },
  components: {
    Titlebar, PassageViewer
  },
  mounted () {
    this.$route.query.t === 'ot' ? this.toggleTestament('OT') : this.toggleTestament('NT')
  },
  methods: {
    toggleTestament (tm) {
      this.testament = tm
      this.selectedBook = undefined
    },
    chooseBible () {
      this.$router.push('bible_chooser')
    },
    bookSelected (element) {
      this.selectedBook = $(element).data('book')
      this.selectedBookName = Bible.bookName(this.selectedBook)
      this.chapterCount = Bible.chapters(this.selectedBook)
      $('.nav-pills > a[href="#chapter-chooser"]').tab('show')
    },
    chapterSelected (element) {
      this.selectedChapter = -1
      this.selectedChapter = $(element).closest('.chapter-label-container').data('chapter')
      this.$router.push('viewpassage?book=' + this.selectedBook + '&chapter=' + this.selectedChapter)
    }
  }
}
</script>

<style lang="less">
@import '../../static/less/colors';
@import '../../static/less/flex';
@import '../../static/less/bootstrap-overrides';

#passageChooser {
  padding-bottom: 50px;
}
.testament-tabs {
  margin-bottom: 10px;
  button:first-child {
    margin-right: 5px;
  }
  button:last-child {
    margin-left: 5px;
  }
}
.book {
  padding: 4px;
}
.book-name {
  padding: 7px 5px 7px 5px;
  text-align: center;
  border-radius: 2px;
  cursor: pointer;
}
.selected-book {
  padding: 7px 5px 7px 5px;
  border-radius: 1px;
}
.chapter {
  display: inline-block;
  position: relative;
  padding: 4px;
}
.chapter-sizer {
  margin-top: 100%;
}
.chapter-label-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2px;
}
.chapter-label {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 1px;
  text-align: center;
  cursor: pointer;
}
</style>
