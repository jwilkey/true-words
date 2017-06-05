<template>
  <div>
    <titlebar :title="'HYMN'" :left-items="['back']" :on-back="goBack"></titlebar>

    <div class="container" :class="{blur: videoId}">
      <div class="hymn-text">
        <div class="hymn-header">
          <p class="title">{{ title }}</p>
          <p class="author">{{ author}}</p>
        </div>

        <div class="text-center" v-if="isLoadingText">
          <i class="fa fa-circle-o-notch fa-spin fa-2x"></i>
        </div>

        <div v-if="text === undefined" class="text-center muted">
          no lyrics for this hymn
        </div>
        <div class="text">
          {{ text }}
        </div>
      </div>

      <hr />

      <div class="video-results">
        <div v-for="video in videos" class="video-result clearfix" @click="videoId = video.id">
          <img :src="video.thumbnail" />
          <p class="video-title">{{ video.title }}</p>
          <p class="video-description">{{ video.description }}</p>
        </div>
      </div>
    </div>

    <div class="video-embed" v-if="videoId">
      <div class="video-close" @click="videoId = undefined">
        <i class="fa fa-close"></i> CLOSE
      </div>
      <youtube-player :video-id="videoId"></youtube-player>
    </div>
  </div>
</template>

<script>
import Titlebar from '../Titlebar'
import YoutubePlayer from '../YoutubePlayer'
import $ from 'jquery'

export default {
  data () {
    return {
      text: '',
      isLoadingText: false,
      isLoadingVideos: false,
      error: undefined,
      videos: undefined,
      videoId: undefined
    }
  },
  computed: {
    title () {
      return this.$route.query.title
    },
    author () {
      return this.$route.query.author
    },
    textLink () {
      return this.$route.query.textLink
    }
  },
  components: {
    Titlebar, YoutubePlayer
  },
  methods: {
    goBack () {
      this.$router.back()
    },
    loadHymn () {
      this.text = ''
      var textLink = this.textLink.replace('/text/', '/api/fulltext/')
      const self = this
      this.isLoadingText = true
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
      .always(() => { self.isLoadingText = false })
    },
    fetchVideos (hymnTitle) {
      const self = this
      this.isLoadingVideos = true
      $.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${hymnTitle}&safeSearch=strict&type=video&key=AIzaSyCTgUetspdVufPqikWDBuhR6j9zvPeYdTg`)
      .done(data => {
        self.videos = data.items.map(v => {
          return {
            id: v.id.videoId,
            thumbnail: v.snippet.thumbnails.default.url,
            title: v.snippet.title,
            description: v.snippet.description
          }
        })
      })
      .fail(err => {
        self.vids = err
      })
      .always(() => { self.isLoadingVideos = false })
    }
  },
  mounted () {
    this.loadHymn()
    this.fetchVideos(this.title)
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors.less';
@import '../../../static/less/app.less';

.hymn-text {
  white-space: pre-line;
  margin-bottom: 20px;
  .hymn-header {
    white-space: normal;
    background-color: @color-back-raised;
    padding: 10px;
    margin-bottom: 10px;
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

.search-button {
  margin-bottom: 20px;
}
.video-results {
  overflow: hidden;
  .video-result {
    border-bottom: solid 2px @color-back-raised2;
    margin-bottom: 5px;
    padding: 5px;
    cursor: pointer;
    &:hover {
      background-color: rgba(230, 230, 230, 0.3);
    }
  }
  img {
    float: left;
    margin-right: 8px;
    margin-bottom: 8px;
  }
  .video-title {
    color: @color-highlight-blue;
    font-size: 18px;
  }
}
.video-embed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.8);
  padding: calc(@titlebar-height + 20) 10px;
  .video-close {
    margin-bottom: 15px;
    font-size: 18px;
    cursor: pointer;
    &:hover {
      color: @color-highlight-red;
    }
  }
}
.blur {
  filter: blur(3px);
}
</style>
