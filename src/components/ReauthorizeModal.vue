<template>
  <div class="auth-modal">
    <div class="auth-modal-container theme-back">
      <div id="refresh-auth" class="auth-modal-box theme-mid shadow-long">
        <p class="muted">{{ getUser.name }}</p>
        <p>Your session has expired.</p>
        <p>Would you like to sign back in?</p>
        <br />
        <div class="row">
          <div class="col-xs-6">
            <button class="btn callout-light btn-block" @click="signIn()">YES</button>
          </div>
          <div class="col-xs-6">
            <button class="btn callout-light btn-block" @click="signOut()">NO</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import container from '../js/container'

export default {
  data () {
    return { }
  },
  props: ['onReauth'],
  computed: {
    ...mapGetters(['getPersistor', 'getUser'])
  },
  components: { },
  methods: {
    signIn () {
      this.getPersistor.refreshAuthorization()
      this.onReauth()
    },
    signOut () {
      this.getPersistor.signOut()
    }
  },
  mounted () {
    container.authHandler.checkAuth()
  }
}
</script>

<style lang="less">
@import '../../static/less/app.less';
@import '../../static/less/colors.less';

.auth-modal {
  z-index: 2000;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: table;
  height: 100%;
  width: 100%;
  p {
    margin-bottom: 0px;
  }
  .auth-modal-container {
    display: table-cell;
    vertical-align: middle;
    padding: 20px;
    .auth-modal-box {
      padding: 20px;
      text-align: center;
      max-width: 400px;
      margin: auto;
      border-radius: 4px;
    }
  }
}
</style>
