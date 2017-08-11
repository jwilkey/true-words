<template>
  <div v-if="data !== undefined" class="flex-column vfull">
    <div class="flex-row shadow">
      <div class="flex-one bucket-label back-orange" @click="toggle(0)"><i class="fa fa-user-circle-o"></i> {{ container(0).name }}</div>
      <div class="flex-one bucket-label back-purple" @click="toggle(1)"><i class="fa fa-institution"></i> {{ container(1).name }}</div>
      <div class="flex-one bucket-label back-red" @click="toggle(2)"><i class="fa fa-tree"></i> {{ container(2).name }}</div>
    </div>

    <div class="flex-one substance">
      <div class="container">
        <drawer :expanded="true">
          <div slot="title">
            {{container(0).items.length}} {{container(0).name}},
            {{container(1).items.length}} {{container(1).name}},
            {{container(2).items.length}} {{container(2).name}}</div>
          <div slot="content" class="row">
            <div class="col-sm-4">
              <ul class="word-list">
                <li class="orange list-item" v-for="(count, selection) in containerOne">{{ selection }} <span class="badge">{{ count | limit }}</span></li>
              </ul>
            </div>
            <div class="col-sm-4">
              <ul class="word-list">
                <li class="purple list-item" v-for="(count, selection) in containerTwo">{{ selection }} <span class="badge">{{ count | limit }}</span></li>
              </ul>
            </div>
            <div class="col-sm-4">
              <ul class="word-list">
                <li class="red list-item" v-for="(count, selection) in containerThree">{{ selection }} <span class="badge">{{ count | limit }}</span></li>
              </ul>
            </div>
          </div>
        </drawer>
      </div>
      <br />

      <div id="buckets-reviewer-words" class="container">
        <span :key="index" v-for="(word, index) in words" :class="wordClass(word)">{{ word.text }} </span>
      </div>
    </div>

    <div class="flex-zero">
      <div class="bottombar">
        <button @click="donePressed()" class="btn btn-lg callout-light btn-block">DONE</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import activities from '../../js/activity'
import Drawer from '../common/Drawer'

function reduceContainer (container) {
  var items = {}
  container.forEach(selection => {
    let word = selection.toString().replace(/[,."?;:]/g, '')
    items[word] = items[word] ? items[word] + 1 : 1
  }, {})
  return items
}

export default {
  data () {
    return {
      active: [true, true, true]
    }
  },
  computed: {
    ...mapGetters({
      words: 'getCurrentWords',
      getCurrentActivity: 'getCurrentActivity'
    }),
    title: function () {
      return activities.manager.titleForType(this.getCurrentActivity)
    },
    containerOne () {
      return reduceContainer(this.data.containers[0].items)
    },
    containerTwo () {
      return reduceContainer(this.data.containers[1].items)
    },
    containerThree () {
      return reduceContainer(this.data.containers[2].items)
    }
  },
  props: ['data'],
  components: { Drawer },
  filters: {
    limit (val) {
      return val > 1 ? val : ''
    }
  },
  methods: {
    container (index) {
      return this.data.containers[index]
    },
    wordClass (word) {
      if (this.data !== undefined) {
        return {
          orange: this.active[0] && this.container(0).search(word),
          purple: this.active[1] && this.container(1).search(word),
          red: this.active[2] && this.container(2).search(word)
        }
      } else {
        return { }
      }
    },
    toggle (container) {
      this.active.splice(container, 1, !this.active[container])
    },
    donePressed () {
      this.$router.replace('/activities')
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../static/less/colors.less';
@import '../../../static/less/flex.less';

#buckets-reviewer-words {
  padding-bottom: 20px;
}
.bucket-label {
  text-align: center;
  float: left;
  letter-spacing: 2px;
  padding: 5px;
  cursor: pointer;
}
.word-list {
  padding-left: 0px;
  margin-bottom: 0px;
  li {
    display: inline-block;
    padding-left: 3px;
    padding-right: 5px;
  }
  li:last-child {
    border-right: none;
  }
  .badge {
    vertical-align: super;
  }
  .orange > .badge {
    background-color: darken(@color-highlight-orange, 20%);
  }
  .purple > .badge {
    background-color: darken(@color-highlight-purple, 20%);
  }
  .red > .badge {
    background-color: darken(@color-highlight-red, 20%);
  }
}
</style>
