<template>
  <div>
    <titlebar :title="'HYMNS'" :left-items="['back']" :on-back="goBack"></titlebar>

    <div class="container substance">
      <p class="inspired-by font-large muted">Inspired by {{ passage }}</p>
      <p v-if="isLoading" class="hymns-loading font-larger blue"><i class="fa fa-circle-o-notch fa-spin"/> Loading</p>
      <div v-if="error">
        Error loading hymns...
      </div>
      <p v-if="hymns.length === 0" class="text-center">no hymns found for this passage</p>

      <div class="hymns">
        <div v-for="(hymn, title) in hymns" @click="hymnSelected(hymn, title)" class="list-item shadow-light theme-mid">
          <p class="title">{{ hymn.title || title }}</p>
          <p class="author muted hi-bottom">{{ hymn.author}}</p>
          <p class="font-small callout-light alt text-right">{{ hymn["scripture references"] }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Titlebar from '../Titlebar'
import Hymn from './Hymn'
import $ from 'jquery'

export default {
  data () {
    return {
      isLoading: true,
      passage: '',
      hymns: {},
      text: '',
      error: undefined
    }
  },
  components: {
    Titlebar, Hymn
  },
  methods: {
    goBack () {
      this.$router.back()
    },
    hymnSelected (hymn, title) {
      this.$router.push({ name: 'Hymn', query: { title: hymn.title || title, author: hymn.author, textLink: hymn['text link'] } })
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
  text-align: center;
  padding-bottom: 10px;
}
.hymns-loading {
  text-align: center;
  margin-top: 30px;
}
.hymns {
  .list-item {
    margin-bottom: 8px;
  }
  .author {
    padding-bottom: 3px;
  }
}
</style>
