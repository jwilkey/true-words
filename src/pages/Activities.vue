<template>
  <div class="">
    <titlebar title="ACTIVITIES" :left-items="['home']"></titlebar>

    <div class="passage-label brand-font">
      {{ getCurrentStudy.passage.description() }}
    </div>

    <div class="container main-background">
      <div v-if="!getPersistor.isLoggedIn()" class="text-center">
        <button class="btn btn-primary" @click="login()">Login to save your work</button>
        <hr />
      </div>

      <div class="stage-heading"><span class="stage-title">PREPARE</span></div>
      <table>
        <tbody>
          <tr @click="goToReaderView()">
            <td>Read the text</td>
          </tr>
        </tbody>
      </table>

      <div class="stage-heading"><span class="stage-title">OBSERVE</span><span class="stage-subtitle">What does it say?</span></div>
      <table>
        <tbody>
          <tr v-for="type in activities.manager.observationActivities" @click="activitySelected(type)">
            <td>{{ activities.manager.titleForType(type) }}</td>
            <td class="text-right completion" v-html="completionPhrase(type)"></td>
          </tr>
        </tbody>
      </table>

      <div class="stage-heading"><span class="stage-title">INTERPRET</span><span class="stage-subtitle">What does it mean?</span></div>
      <table>
        <tbody>
          <tr v-for="type in activities.manager.interpretationActivities" @click="activitySelected(type)">
            <td>{{ activities.manager.titleForType(type) }}</td>
            <td class="text-right completion" v-html="completionPhrase(type)"></td>
          </tr>
        </tbody>
      </table>

      <div class="stage-heading"><span class="stage-title">APPLY</span><span class="stage-subtitle">What should I do?</span></div>
      <table>
        <tbody>
          <tr v-for="type in activities.manager.applicationActivities" @click="activitySelected(type)">
            <td>{{ activities.manager.titleForType(type) }}</td>
            <td class="text-right completion" v-html="completionPhrase(type)"></td>
          </tr>
        </tbody>
      </table>

      <div class="delete-view">
        <button class="btn btn-primary alt" @click="deletePressed()">DELETE STUDY</button>
      </div>
    </div>
  </div>
</template>

<script>
import activities from '../js/activity'
import Titlebar from '../components/Titlebar'
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      activities
    }
  },
  components: {
    Titlebar
  },
  props: ['data'],
  computed: {
    ...mapGetters(['getCurrentStudy', 'getPersistor'])
  },
  methods: {
    goToReaderView () {
      this.$router.push('/reader')
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
@import '../../static/less/colors.less';

.passage-label {
  text-align: center;
  padding: 10px;
  letter-spacing: 1px;
  font-size: 20px;
}
.stage-heading {
  background-color: @color-back-raised;
  padding: 10px;
}
.stage-title {
  letter-spacing: 1px;
}
.stage-subtitle {
  color: @color-deemphasize;
  margin-left: 10px;
  padding-left: 10px;
  border-left: solid 1px @color-callout-light;
}
table {
  width: 100%;
  margin-bottom: 15px;
  thead tr {
    background-color: @color-back-raised;
    th {
      padding: 10px;
    }
  }
  tbody {
    tr {
      border-bottom: solid 1px @color-back-raised;
      cursor: pointer;
      td {
        padding: 10px;
      }
      .completion {
        white-space: nowrap;
        letter-spacing: -0.5px;
      }
    }
  }
}
.delete-view {
  float: right;
  padding: 10px;
  margin-top: 20px;
}
.warning {
  color: @color-warning;
  border: solid 1px @color-warning;
  border-radius: 4px;
  padding: 8px;
}
</style>
