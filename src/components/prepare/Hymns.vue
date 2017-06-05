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

      <div class="list-group hymns">
        <div v-for="hymn in hymns" @click="hymnSelected(hymn)" class="list-group-item">
          <span class="badge">{{ hymn["scripture references"] }}</span>
          <p class="title">{{ hymn.title }}</p>
          <p class="author">{{ hymn.author}}</p>
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
    hymnSelected (hymn) {
      this.$router.push({ name: 'Hymn', query: { title: hymn.title, author: hymn.author, textLink: hymn['text link'] } })
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
</style>
