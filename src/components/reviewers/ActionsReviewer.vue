<template>
  <div v-if="data !== undefined" class="flex-column vfull">
    <div class="flex-one substance">
      <div class="container">
        <div class="actions">
          <div v-for="action in data.collection.items" class="action clearfix">
            <div v-if="action.actor" class="action-item list-item theme-mid">
              <p class="action-label muted">ACTOR</p>
              <div>{{action.actor ? action.actor.toString() : '?'}}</div>
            </div>
            <div class="action-item list-item theme-mid">
              <p class="action-label muted">ACTION</p>
              <div class="blue">{{action.action ? action.action.toString() : '?'}}</div>
            </div>
            <div v-if="action.target" class="action-item list-item theme-mid">
              <p class="action-label muted">TARGET</p>
              <div>{{action.target ? action.target.toString() : '?'}}</div>
            </div>
            <div v-if="action.result" class="action-item list-item theme-mid">
              <p class="action-label muted">RESULT</p>
              <div>{{action.result ? action.result.toString() : '?'}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottombar flex-zero">
      <button @click="donePressed()" class="btn btn-lg callout-light btn-block">DONE</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import activities from '../../js/activity'

export default {
  data () { return { } },
  computed: {
    ...mapGetters({
      words: 'getCurrentWords',
      getCurrentActivity: 'getCurrentActivity'
    }),
    title: function () {
      return activities.manager.titleForType(this.getCurrentActivity)
    }
  },
  props: ['data'],
  methods: {
    donePressed: function () {
      this.$router.replace('/activities')
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors';
@import '../../../static/less/flex';

.actions {
  display: table;
  margin-left: auto;
  margin-right: auto;
  padding: 0px 10px;
  .action {
    padding-bottom: 12px;
    .action-item:first-child {
      padding-left: 15px;
    }
  }
  .action-item {
    padding: 5px 8px 5px 8px;
    float: left;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }
}
.action-label {
  font-size: 12px;
  margin-bottom: 0px;
}
</style>
