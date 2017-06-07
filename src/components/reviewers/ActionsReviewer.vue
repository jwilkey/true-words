<template>
  <div v-if="data !== undefined" class="flex-v">
    <div class="flex-1">
      <div class="container">
        <div class="actions">
          <div v-for="action in data.collection.items" class="action clearfix">
            <div v-if="action.actor" class="action-item">
              <p class="action-label">ACTOR</p>
              <div>{{action.actor ? action.actor.toString() : '?'}}</div>
            </div>
            <div class="action-item">
              <p class="action-label">ACTION</p>
              <div class="blue">{{action.action ? action.action.toString() : '?'}}</div>
            </div>
            <div v-if="action.target" class="action-item">
              <p class="action-label">TARGET</p>
              <div>{{action.target ? action.target.toString() : '?'}}</div>
            </div>
            <div v-if="action.result" class="action-item">
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
    padding-bottom: 12px;
    .action-item:first-child {
      border-left: solid 2px @color-callout-light;
      padding-left: 15px;
    }
  }
  .action-item {
    background-color: @color-back-raised;
    padding: 5px 8px 5px 8px;
    float: left;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    box-shadow: inset 1px 0px 5px #000;
  }
}
.action-label {
  font-size: 12px;
  color: @color-deemphasize;
  margin-bottom: 0px;
}
</style>
