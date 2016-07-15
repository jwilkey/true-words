<template>
  <titlebar title="ACTIVITIES"></titlebar>

  <div class="container">
    <p class="text-center accent">Choose an Activity to begin</p>

    <table>
      <thead><tr>
        <th>Observe</th>
        <th class="text-right accent">What does it say?</th>
      </tr></thead>
      <tbody>
        <tr v-for="type in activity.observationActivities()" @click="activitySelected(type)">
          <td>{{ activity.titleForType(type) }}</td>
          <td class="text-right">{{ activity.subtitleForType(type) }}</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead><tr>
        <th>Interpret</th>
        <th class="text-right accent">What does it mean?</th>
      </tr></thead>
      <tbody>
        <tr v-for="type in activity.interpretationActivities()" @click="activitySelected(type)">
          <td>{{ activity.titleForType(type) }}</td>
          <td class="text-right">{{ activity.subtitleForType(type) }}</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead><tr>
        <th>Apply</th>
        <th class="text-right accent">What should I do?</th>
      </tr></thead>
      <tbody>
        <tr v-for="type in activity.applicationActivities()" @click="activitySelected(type)">
          <td>{{ activity.titleForType(type) }}</td>
          <td class="text-right">{{ activity.subtitleForType(type) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import activity from '../js/activity'
import Titlebar from '../components/Titlebar'
import { setCurrentActivity } from '../../vuex/actions.js'

export default {
  data () {
    return {
      activity
    }
  },
  components: {
    Titlebar
  },
  props: ['data'],
  methods: {
    activitySelected: function (type) {
      this.setCurrentActivity(type)
      this.$router.go('activity')
    }
  },
  ready () {
  },
  vuex: {
    actions: {
      setCurrentActivity
    }
  }
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
