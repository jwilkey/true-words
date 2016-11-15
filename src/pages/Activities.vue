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
            <td :class="{'muted': isDisabled(type)}">{{ activities.manager.titleForType(type) }}</td>
            <td :class="{'muted': isDisabled(type)}" class="text-right">{{ activities.manager.subtitleForType(type) }}</td>
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
            <td :class="{'muted': isDisabled(type)}">{{ activities.manager.titleForType(type) }}</td>
            <td :class="{'muted': isDisabled(type)}" class="text-right">{{ activities.manager.subtitleForType(type) }}</td>
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
            <td :class="{'muted': isDisabled(type)}">{{ activities.manager.titleForType(type) }}</td>
            <td :class="{'muted': isDisabled(type)}" class="text-right">{{ activities.manager.subtitleForType(type) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import activities from '../js/activity'
import Titlebar from '../components/Titlebar'
import { mapActions } from 'vuex'

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
  methods: {
    activitySelected: function (type) {
      if (this.isEnabled(type)) {
        this.setCurrentActivity(type)
        this.$router.push('/activity')
      } else {
        window.alert(this.activities.manager.titleForType(type) + ' activity coming soon!')
      }
    },
    isDisabled: function (type) {
      return !this.activities.manager.find(type).enabled
    },
    isEnabled: function (type) {
      return this.activities.manager.find(type).enabled
    },
    ...mapActions(['setCurrentActivity'])
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
