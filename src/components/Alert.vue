<template>
  <div id="alert">
    <div class="alert-container">
      <div class="alert-box">
        <p id="alert-message"></p>
        <button id="ok-alert-button" class="btn btn-block btn-alert" @click="dismissAlert()">OK</button>

        <div class="row">
          <div class="col-xs-6">
            <button id="yes-alert-button" class="btn btn-block btn-alert col-xs-6" @click="confirmYes()">YES</button>
          </div>
          <div class="col-xs-6">
            <button id="no-alert-button" class="btn btn-block btn-alert alt col-xs-6" @click="confirmNo()">NO</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      app: this.$root.$children[0]
    }
  },
  components: { },
  methods: {
    confirmYes () {
      if (this.app.alertCallback) {
        this.app.alertCallback('yes')
      } else {
        console.log('Confirmation alert has no alertCallback implementation')
      }
    },
    confirmNo () {
      if (this.app.alertCallback) {
        this.app.alertCallback('no')
      } else {
        console.log('Confirmation alert has no alertCallback implementation')
      }
    }
  }
}
</script>

<style lang="less">
@import '../../static/less/app.less';
@import '../../static/less/colors.less';

#alert {
  position: fixed;
  z-index: 3000;
  display: none;
  height: 100%;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0,0,0,0.4);
  #ok-alert-button, #yes-alert-button, #no-alert-button {
    display: none;
  }
  &.ok-alert {
    #ok-alert-button {
      display: inherit;
    }
  }
  &.confirm-alert {
    #yes-alert-button, #no-alert-button {
      display: inherit;
    }
  }
  .alert-container {
    display: table-cell;
    vertical-align: middle;
    padding: 10px;
    .alert-box {
      background-color: @color-help-back;
      color: @color-help;
      max-width: 400px;
      margin: auto;
      padding: 10px;
      padding-left: 20px;
      padding-right: 20px;
      border-radius: 4px;
      box-shadow: @shadow-long;
      font-size: 18px;
      letter-spacing: 0.5px;
      #alert-message {
        text-align: center;
      }
      p {
        margin-bottom: 0px;
      }
      .btn-alert {
        background-color: @color-help;
        border-color: @color-help;
        color: @color-help-back;
        margin-top: 20px;
        &.alt {
          background-color: transparent;
          color: @color-help;
        }
        &:hover {
          background-color: @color-highlight-blue;
          color: @color-help;
        }
      }
    }
  }
}
</style>
