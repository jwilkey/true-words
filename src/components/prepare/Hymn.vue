<template>
  <div>
    <titlebar :title="'HYMN'" :left-items="['back']" :on-back="goBack"></titlebar>

    <div class="container substance" :class="{blur: videoId}">
      <div class="hymn-text">
        <div class="hymn-header theme-mid shadow-light">
          <p class="title font-large">{{ title }}</p>
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

      <p class="font-small muted">YouTube video results for this hymn:</p>
      <div class="video-results">
        <div v-for="video in videos" class="list-item theme-mid video-result clearfix" @click="videoId = video.id">
          <p class="title hi-bottom">{{ video.title }}</p>
          <img :src="video.thumbnail" />
          <p class="video-description muted font-small">{{ video.description }}</p>
          <p v-if="!video.description" class="muted">No description</p>
        </div>
      </div>
      <br />
      <p class="font-small muted">The above videos are the result of searching YouTube for the title of this hymn. True Words in no way endorses the results or content of these videos, though reasonable measures are taken to ensure their appropriateness.</p>
    </div>

    <div class="video-embed" v-if="videoId">
      <div class="video-close red" @click="videoId = undefined">
        <i class="fa fa-close"></i> CLOSE
      </div>
      <youtube-player :video-id="videoId" class="video"></youtube-player>
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
      $.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${hymnTitle}&safeSearch=strict&type=video&key=AIzaSyCTgUetspdVufPqikWDBuhR6j9zvPeYdTg&topicId=/m/02mscn`)
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
    if (this.title) {
      this.fetchVideos(this.title)
    }
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
    padding: 10px;
    margin-bottom: 10px;
    display: table;
    width: 100%;
    .title, .author {
      text-align: center;
      margin: 0px;
    }
  }
}

.search-button {
  margin-bottom: 20px;
}
.video-results {
  overflow: hidden;
  .video-result {
    margin-bottom: 8px;
    padding: 5px;
    cursor: pointer;
    .title {
      margin-bottom: 5px;
    }
  }
  img {
    float: left;
    margin-top: 6px;
    margin-right: 8px;
    margin-bottom: 8px;
  }
}
.video-embed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.9);
  padding: 30px 5px;
  z-index: 1001;
  .video {
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.7);
  }
  .video-close {
    margin-bottom: 25px;
    padding-left: 8px;
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
