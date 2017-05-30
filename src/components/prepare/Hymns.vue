<template>
  <div>
    <titlebar :title="'HYMNS'" :left-items="['back']" :on-back="goBack"></titlebar>

    <div class="container">
      <p class="inspired-by">Inspired by {{ passage }}</p>
      <p v-if="isLoading" class="hymns-loading"><i class="fa fa-circle-o-notch fa-spin"/> Loading</p>
      <div v-if="error">
        Error loading hymns...
      </div>
      <p v-if="hymns.length === 0" class="text-center">no hymns found for this passage</p>

      <div v-if="selectedHymn === undefined" class="list-group hymns">
        <div v-for="hymn in hymns" @click="hymnSelected(hymn)" class="list-group-item">
          <span class="badge">{{ hymn["scripture references"] }}</span>
          <p class="title">{{ hymn.title }}</p>
          <p class="author">{{ hymn.author}}</p>
        </div>
      </div>

      <div v-if="selectedHymn !== undefined" class="hymn-text">
        <div class="hymn-header">
          <div class="action-button" @click="closeHymn()">
            <i class="fa fa-chevron-left"></i>
          </div>
          <p class="title">{{ selectedHymn.title }}</p>
          <p class="author">{{ selectedHymn.author}}</p>
        </div>
        <div v-if="text === undefined" class="text-center muted">
          no lyrics for this hymn
        </div>
        <div class="text">
          {{ text }}
        </div>
        <br />
        <button class="btn btn-primary btn-block" @click="closeHymn()">BACK TO HYMNS</button>
      </div>
    </div>
  </div>
</template>

<script>
import Titlebar from '../Titlebar'
import $ from 'jquery'

export default {
  data () {
    return {
      isLoading: true,
      passage: '',
      hymns: {},
      selectedHymn: undefined,
      text: '',
      error: undefined
    }
  },
  components: {
    Titlebar
  },
  computed: {
  },
  methods: {
    goBack () {
      this.$router.back()
    },
    hymnSelected (hymn) {
      this.selectedHymn = hymn
      this.text = ''
      var textLink = hymn['text link'].replace('/text/', '/api/fulltext/')
      const self = this
      $.get(textLink).done(function (data) {
        if (data.length > 0) {
          for (var entry in data) {
            if (data[entry].text.indexOf('To view this media') !== 0) {
              self.text = data[entry].text.replace(/\r/g, '').replace(/\n\n/g, '\n')
              return
            }
          }
        }
        self.text = undefined
      })
    },
    closeHymn () {
      this.selectedHymn = undefined
      this.text = ''
    }
  },
  mounted () {
    this.passage = this.$route.query.passage
    const self = this
    $.get(`https://hymnary.org/api/scripture?reference=${this.passage}`)
    .done(data => {
      self.hymns = data
    })
    .fail(err => {
      self.error = err
    })
    .always(() => {
      self.isLoading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/app.less';
@import '../../../static/less/colors.less';
@import '../../../static/less/flex.less';

.inspired-by {
  color: @color-deemphasize;
  font-size: 18px;
  text-align: center;
  border-bottom: solid 1px @color-back-raised2;
  padding-bottom: 10px;
}
.hymns-loading {
  text-align: center;
  font-size: 20px;
  color: @color-highlight-blue;
  margin-top: 30px;
}
.author {
  color: @color-deemphasize;
}
.hymns {
  p {
    margin: 0px;
  }
  .list-group-item {
    border-bottom: solid 1px @color-back-raised2;
    cursor: pointer;
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
}
.hymn-text {
  white-space: pre-line;
  .hymn-header {
    white-space: normal;
    background-color: @color-back-raised;
    padding: 10px;
    display: table;
    width: 100%;
    .action-button {
      display: table-cell;
      vertical-align: middle;
      width: 30px;
      height: 30px;
      color: @color-deemphasize;
      cursor: pointer;
      &:hover {
        border-right: solid 2px @color-deemphasize;
      }
    }
    .title, .author {
      text-align: center;
      margin: 0px;
    }
    .title {
      font-size: 18px;
    }
  }
}
</style>
