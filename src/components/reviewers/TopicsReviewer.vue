<template>
  <div class="flex-column vfull">
    <div class="flex-one scrolly topics-view">
      <div class="container">
        <drawer :expanded="true">
          <div slot="title">{{ topics.length }} TOPICS</div>
          <div slot="content" v-for="topic in topics" class="theme-mid shadow-light topic">
            <span class="muted hi-right topic-order">{{ topic.order + 1 }}</span><i class="fa fa-tag callout-light alt"></i> {{ topic.text }}
          </div>
        </drawer>
      </div>

      <div class="container">
        <div v-for="verse in getCurrentStudy.verses" class="verse">
          <span class="verse-number"><span v-if="verse.number === 1">{{verse.chapter}}:</span>{{ verse.number }}</span> <span class="verse-text">{{ verse.text }}</span>
        </div>
      </div>
    </div>

    <div class="bottombar flex-zero">
      <button @click="donePressed()" class="btn btn-lg btn-clear btn-block">DONE</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Drawer from '../common/Drawer'

export default {
  data () {
    return {
    }
  },
  props: ['data'],
  computed: {
    ...mapGetters(['getCurrentStudy']),
    topics () {
      return this.data.collection.items
    }
  },
  components: { Drawer },
  methods: {
    donePressed: function () {
      this.$router.replace('/activities')
    }
  }
}
</script>

<style lang="less" scoped>
.topics-view {
  padding-top: 10px;
  padding-bottom: 30px;
  .container {
    padding-bottom: 10px;
  }
}
.topic {
  display: inline-block;
  padding: 5px 8px;
  margin-right: 5px;
  margin-bottom: 3px;
  border-radius: 4px;
  .topic-order {
    padding-right: 5px;
    margin-right: 5px;
  }
}

.verse {
  display: inline;
  padding: 5px;
  font-size: 18px;
  .verse-number {
    color: #999;
    vertical-align: super;
    font-size: 12px;
  }
}
</style>
