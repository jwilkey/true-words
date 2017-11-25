<template>
  <div class="">
    <titlebar title="ACTIVITIES" :left-items="['home']"></titlebar>

    <div class="container substance">
      <div class="passage-label brand-font font-larger theme-back">
        {{ getCurrentStudy.passage.description() }}
      </div>

      <div v-if="!getPersistor.isLoggedIn()" class="text-center">
        <button class="btn callout-light" @click="login()">Sign in to save your work</button>
        <hr />
      </div>

      <div class="prepare">
        <p class="prepare-label theme-mid shadow">PREPARE</p>
        <div class="flex-row">
          <div @click="goToReaderView()" class="flex-one list-item">Read the text</div>
          <div @click="goToHymnView()" class="flex-one list-item">Hymns</div>
        </div>
      </div>

      <card title="OBSERVE" subtitle="What does it say?">
        <div v-for="type in activities.manager.observationActivities" class="list-item flex-row theme-mid" @click="activitySelected(type)">
          <div class="flex-one">{{ activities.manager.titleForType(type) }}</div>
          <div class="flex-zero nowrap text-right" v-html="completionPhrase(type)"></div>
        </div>
      </card>

      <card title="INTERPRET" subtitle="What does it mean?">
        <div v-for="type in activities.manager.interpretationActivities" class="list-item flex-row theme-mid" @click="activitySelected(type)">
          <div class="flex-one">{{ activities.manager.titleForType(type) }}</div>
          <div class="flex-zero nowrap text-right" v-html="completionPhrase(type)"></div>
        </div>
      </card>

      <card title="APPLY" subtitle="What should I do?">
        <div v-for="type in activities.manager.applicationActivities" class="list-item flex-row theme-mid" @click="activitySelected(type)">
          <div class="flex-one">{{ activities.manager.titleForType(type) }}</div>
          <div class="flex-zero nowrap text-right" v-html="completionPhrase(type)"></div>
        </div>
      </card>

      <div class="delete-view">
        <button class="btn" @click="deletePressed()">DELETE STUDY</button>
      </div>
    </div>
  </div>
</template>

<script>
import activities from '../js/activity'
import Titlebar from '../components/Titlebar'
import Card from '../components/Card'
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      activities
    }
  },
  components: {
    Titlebar, Card
  },
  props: ['data'],
  computed: {
    ...mapGetters(['getCurrentStudy', 'getPersistor'])
  },
  methods: {
    goToReaderView () {
      this.$router.push('/reader')
    },
    goToHymnView () {
      var passage = encodeURIComponent(this.getCurrentStudy.passage.description())
      this.$router.push(`/hymns?passage=${passage}`)
    },
    activitySelected: function (type) {
      if (this.isEnabled(type)) {
        this.setCurrentActivity(type)
        this.$router.push('/activity')
      } else {
        this.alert(this.activities.manager.titleForType(type) + ' activity coming soon!', 'ok')
      }
    },
    login () {
      this.$router.push('login?referrer=activities')
    },
    completedActivity (type) {
      return this.getCurrentStudy.findActivity(type)
    },
    completionPhrase (type) {
      var activity = this.getCurrentStudy.findActivity(type)
      if (activity !== undefined) {
        var days = daysAgo(activity.creationDate)
        var phrase = (days === 0 ? 'today' : (days + ' days ago')) + ''
        return '<span class="muted light">' + phrase + '</span>&nbsp;&nbsp;<span class="glyphicon glyphicon-ok-circle green"></span>'
      }
      return ''
    },
    isEnabled: function (type) {
      return this.activities.manager.find(type).enabled
    },
    deletePressed () {
      var self = this
      this.setAlertCallback(function (id) {
        if (id === 'yes') {
          self.dismissAlert()
          self.alert('Deleting this study...')
          self.getPersistor.deleteStudy(self.getCurrentStudy.id)
          .done(function () {
            self.dismissAlert()
            self.$router.replace('/')
          })
          .fail(function () {
            self.alert('Failed to delete this study', 'ok')
          })
        } else {
          self.dismissAlert()
        }
      })
      this.alert('Are you sure you want to delete this study?', 'confirm')
    },
    ...mapActions(['setCurrentActivity'])
  }
}

function daysAgo (date) {
  var oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
  var now = new Date()
  return Math.round(Math.abs((date.getTime() - now.getTime()) / oneDay))
}
</script>

<style lang="less" scoped>
@import '../../static/less/colors';

.passage-label {
  text-align: center;
  margin-bottom: 10px;
  letter-spacing: 1px;
}
.prepare {
  margin-bottom: 20px;
  .prepare-label {
    padding: 5px;
  }
  .list-item {
    margin: 0 5px;
  }
}
.delete-view {
  float: right;
  padding: 10px;
  margin-top: 20px;
  button {
    color: @color-highlight-red;
    background-color: transparent;
    border: solid 2px @color-highlight-red;
    &:hover {
      box-shadow: inset 1px 0px 5px 2px @color-highlight-red;
    }
  }
}
</style>
