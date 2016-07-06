<template>
  <div class="container">
    <ul class="nav nav-pills" role="tablist">
      <li role="presentation">
        <a id="ot-tab" href="#ot-chooser" aria-controls="ot-chooser" role="tab" data-toggle="tab">Old Testament</a>
      </li>
      <li role="presentation">
        <a id="nt-tab" href="#nt-chooser" aria-controls="nt-chooser" role="tab" data-toggle="tab">New Testament</a>
      </li>
      <a href="#chapter-chooser" aria-controls="chapter-chooser" role="tab" data-toggle="tab"></a>
    </ul>

    <div id="passageChooser" class="tab-content">
      <div id="ot-chooser" role="tabpanel" class="tab-pane fade clearfix">
        <div class="col-xs-6 col-sm-3 col-md-5c book" v-for="book in otBooks">
          <div track-by="$index" @click='bookSelected($event.target)' class='book-name' data-book="{{book.identifier}}">{{ book.name }}</div>
        </div>
      </div>

      <div id="nt-chooser" role="tabpanel" class="tab-pane fade clearfix">
        <div class="col-xs-6 col-sm-3 col-md-5c book" v-for="book in ntBooks">
          <div track-by="$index" @click='bookSelected($event.target)' class='book-name' data-book="{{book.identifier}}">{{ book.name }}</div>
        </div>
      </div>

      <div id="chapter-chooser" role="tabpanel" class="tab-pane fade clearfix">
        <p class="selected-book text-center">{{ selectedBookName }}</p>
        <div class="col-xs-2 col-md-1 chapter" v-for="n in chapterCount">
          <div class="chapter-sizer"></div>
          <div track-by="$index" @click='chapterSelected($event.target)' class='chapter-label-container' data-chapter="{{ n + 1 }}">
            <p class="chapter-label">{{ n + 1 }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import bible from '../js/bible.js'
import PassageViewer from '../components/PassageViewer'
export default {
  data () {
    return {
      otBooks: bible.otBooks,
      selectedBook: 'MATTHEW',
      selectedBookName: bible.bookName(this.selectedBook),
      selectedChapter: 1,
      chapterCount: 0,
      ntBooks: bible.ntBooks
    }
  },
  components: {
    PassageViewer
  },
  ready () {
    this.$route.query.t === 'ot' ? $('#ot-tab').tab('show') : $('#nt-tab').tab('show')
  },
  methods: {
    bookSelected (element) {
      this.selectedBook = $(element).data('book')
      this.selectedBookName = bible.bookName(this.selectedBook)
      this.chapterCount = bible.chapters(this.selectedBook)
      $('.nav-pills > a[href="#chapter-chooser"]').tab('show')
    },
    chapterSelected (element) {
      this.selectedChapter = -1
      this.selectedChapter = $(element).closest('.chapter-label-container').data('chapter')
      this.$router.go('viewpassage?book=' + this.selectedBook + '&chapter=' + this.selectedChapter)
      // $('.nav-pills > a[href="#passage-viewer"]').tab('show')
    }
  },
  vuex: {
    actions: {
    }
  }
}
</script>

<style lang="less">
@import '../../static/less/colors.less';
@import '../../static/less/bootstrap-overrides.less';
.nav>li {
  width: 49.6%;
  padding-right: 5px;
  padding-left: 5px;
  a {
    text-align: center;
    color: #fdd;
    padding: 5px;
    padding-left: 15px;
    padding-right: 15px;
    border-radius: 16px;
    border: solid 1px @color-callout;
  }
}
.nav-pills>li>a:hover {
  color: @color-back;
  background-color: #fdd;
}
.nav-pills>li.active>a, .nav-pills>li.active>a:focus, .nav-pills>li.active>a:hover {
  background-color: @color-callout;
}
.tab-pane {
  padding-top: 10px;
}
.book {
  padding: 4px;
}
.book-name {
  background-color: @color-back-raised;
  padding: 5px;
  text-align: center;
  border-radius: 2px;
  box-shadow: @shadow;
}
.book-name:hover {
  background-color: @color-back-raised2;
}
.selected-book {
  font-size: 18px;
  background-color: @color-back-raised;
  padding: 5px;
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
  background-color: @color-back-raised;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 1px;
  text-align: center;
  font-size: 18px;
  box-shadow: @shadow;
}
.chapter-label:hover {
  background-color: @color-back-raised2;
}
</style>
