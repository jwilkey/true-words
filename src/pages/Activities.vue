<template>
  <div>
    <titlebar title="ACTIVITIES" :left-items="['home']"></titlebar>

    <div class="container">
      <p class="text-center accent">Choose an Activity to begin</p>

      <table>
        <thead><tr>
          <th>Observe</th>
          <th class="text-right accent">What does it say?</th>
        </tr></thead>
        <tbody>
          <tr v-for="type in activities.manager.observationActivities" @click="activitySelected(type)">
            <td>{{ activities.manager.titleForType(type) }}</td>
            <td class="text-right muted">{{ completionPhrase(type) }}</td>
          </tr>
        </tbody>
      </table>

      <table>
        <thead><tr>
          <th>Interpret</th>
          <th class="text-right accent">What does it mean?</th>
        </tr></thead>
        <tbody>
          <tr v-for="type in activities.manager.interpretationActivities" @click="activitySelected(type)">
            <td>{{ activities.manager.titleForType(type) }}</td>
            <td class="text-right muted">{{ completionPhrase(type) }}</td>
          </tr>
        </tbody>
      </table>

      <table>
        <thead><tr>
          <th>Apply</th>
          <th class="text-right accent">What should I do?</th>
        </tr></thead>
        <tbody>
          <tr v-for="type in activities.manager.applicationActivities" @click="activitySelected(type)">
            <td>{{ activities.manager.titleForType(type) }}</td>
            <td class="text-right muted">{{ completionPhrase(type) }}</td>
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
    ...mapGetters(['getCurrentStudy'])
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
    completionPhrase (type) {
      var activity = this.getCurrentStudy.findActivity(type)
      if (activity !== undefined) {
        var days = daysAgo(activity.creationDate)
        return days === 0 ? 'completed today' : 'completed ' + days + ' days ago'
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
table {
  width: 100%;
  margin-bottom: 15px;
  thead tr {
    background-color: @color-callout;
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
</style>
