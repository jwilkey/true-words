<template>
  <div v-if="data !== undefined" class="flex-v">
    <div class="flex-1">
      <div class="container">
        <div class="actions">
          <div v-for="action in data.collection.items" class="action clearfix">
            <div class="action-item">
              <p class="action-label">ACTOR</p>
              <div>{{action.actor ? action.actor.toString() : '?'}}</div>
            </div>
            <div class="action-item">
              <p class="action-label">ACTION</p>
              <div class="accent">{{action.action ? action.action.toString() : '?'}}</div>
            </div>
            <div class="action-item">
              <p class="action-label">TARGET</p>
              <div>{{action.target ? action.target.toString() : '?'}}</div>
            </div>
            <div class="action-item">
              <p class="action-label">RESULT</p>
              <div>{{action.result ? action.result.toString() : '?'}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="actionbar-flex">
      <button @click="donePressed()" class="btn btn-lg btn-primary btn-block">DONE</button>
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
@import '../../../static/less/colors.less';
.actions {
  display: table;
  margin-left: auto;
  margin-right: auto;
  .action {
    padding-bottom: 15px;
    .action-item:first-child {
      border-left: solid 2px @color-actionable;
      padding-left: 15px;
    }
  }
  .action-item {
    background-color: @color-back-raised;
    padding: 10px;
    padding-right: 15px;
    float: left;
    border-right: solid 1px @color-deemphasize;
    border-top-right-radius: 7px;
    border-bottom-right-radius: 7px;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    box-shadow: inset -3px 0px 8px rgba(255, 255, 255, 0.6), 3px 0px 7px #000, inset 2px 0px 5px #000;
  }
}
.action-label {
  font-size: 12px;
  color: @color-actionable;
  margin-bottom: 0px;
}
</style>
