<template>
  <div>
    <titlebar :title="passage" :left-items="['back']" :on-back="goBack"></titlebar>

    <div class="container">
      <p v-if="hymns.length === 0" class="text-center">no hymns found for this passage</p>

      <div v-if="selectedHymn === undefined" class="list-group hymns">
        <a v-for="hymn in hymns" @click="hymnSelected(hymn)" class="list-group-item">
          <span class="badge">{{ hymn["scripture references"] }}</span>
          <p class="title">{{ hymn.title }}</p>
          <p class="author">{{ hymn.author}}</p>
        </a>
      </div>

      <div v-if="selectedHymn !== undefined" class="hymn-text">
        <div class="hymn-header">
          <div class="action-button" @click="closeHymn()">
            <img class="svg close-button" src="/static/images/close.svg" />
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
        <button class="btn btn-primary btn-block" @click="closeHymn()">DONE</button>
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
      passage: '',
      hymns: {},
      selectedHymn: undefined,
      text: ''
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
    $.get(`https://www.hymnary.org/api/scripture?reference=${this.passage}`)
    .done(function (data) {
      self.hymns = data
    })
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/app.less';
@import '../../../static/less/colors.less';
@import '../../../static/less/flex.less';

.author {
  color: @color-deemphasize;
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
