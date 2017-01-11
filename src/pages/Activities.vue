<template>
  <div class="">
    <titlebar title="ACTIVITIES" :left-items="['home']"></titlebar>

    <div class="container main-background">
      <p v-if="getPersistor.isLoggedIn()" class="text-center muted">Choose an Activity to begin</p>

      <div v-if="!getPersistor.isLoggedIn()" class="text-center">
        <button class="btn btn-primary" @click="login()">Login to save your work</button>
        <hr />
      </div>

      <table>
        <thead><tr>
          <th><span class="stage-title">OBSERVE</span><span class="stage-subtitle">What does it say?</span></th>
          <th></th>
        </tr></thead>
        <tbody>
          <tr v-for="type in activities.manager.observationActivities" @click="activitySelected(type)">
            <td>{{ activities.manager.titleForType(type) }}</td>
            <td class="text-right" v-html="completionPhrase(type)"></td>
          </tr>
        </tbody>
      </table>

      <table>
        <thead><tr>
          <th><span class="stage-title">INTERPRET</span><span class="stage-subtitle">What does it mean?</span></th>
          <th></th>
        </tr></thead>
        <tbody>
          <tr v-for="type in activities.manager.interpretationActivities" @click="activitySelected(type)">
            <td>{{ activities.manager.titleForType(type) }}</td>
            <td class="text-right" v-html="completionPhrase(type)"></td>
          </tr>
        </tbody>
      </table>

      <table>
        <thead><tr>
          <th><span class="stage-title">APPLY</span><span class="stage-subtitle">What should I do?</span></th>
          <th></th>
        </tr></thead>
        <tbody>
          <tr v-for="type in activities.manager.applicationActivities" @click="activitySelected(type)">
            <td>{{ activities.manager.titleForType(type) }}</td>
            <td class="text-right" v-html="completionPhrase(type)"></td>
          </tr>
        </tbody>
      </table>
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
    activitySelected: function (type) {
      if (this.isEnabled(type)) {
        this.setCurrentActivity(type)
        this.$router.push('/activity')
      } else {
        window.alert(this.activities.manager.titleForType(type) + ' activity coming soon!')
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
    }
  }
}
.warning {
  color: @color-warning;
  border: solid 1px @color-warning;
  border-radius: 4px;
  padding: 8px;
}
</style>
