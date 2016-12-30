<template>
  <div v-if="data !== undefined" class="flex-v">
    <div class="flex-1">
      <div class="container">
        <div>
          <table class="actions-table">
            <tbody>
              <tr v-for="action in data.collection.items">
                <td>
                  <p class="action-label">ACTOR</p>
                  <div>{{action.actor ? action.actor.toString() : '?'}}</div>
                </td>
                <td class="arrow-cell"></td>
                <td>
                  <p class="action-label">ACTION</p>
                  <div>{{action.action ? action.action.toString() : '?'}}</div>
                </td>
                <td class="arrow-cell"></td>
                <td>
                  <p class="action-label">TARGET</p>
                  <div>{{action.target ? action.target.toString() : '?'}}</div>
                </td>
                <td class="arrow-cell"></td>
                <td>
                  <p class="action-label">RESULT</p>
                  <div>{{action.result ? action.result.toString() : '?'}}</div>
                </td>
              </tr>
            </tbody>
          </table>
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
.actions-table {
  border-collapse:separate;
  border-spacing:5px;
  margin-left: auto;
  margin-right: auto;
  tr {
  }
  td {
    background-color: @color-back-raised;
    padding: 10px;
    vertical-align: top;
    border-bottom: solid 2px @color-back-raised2;
    &:first-child {
      border-top-left-radius: 7px;
    }
    &:last-child {
      border-bottom-right-radius: 7px;
    }
    &.arrow-cell {
      width: 10px;
      padding: 0px;
      background-color: @color-actionable;
      background-image: url('../../assets/arrow.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      color: white;
      border-bottom: none;
    }
  }
}
.action-label {
  font-size: 12px;
  color: @color-actionable;
  margin-bottom: 0px;
}
</style>
