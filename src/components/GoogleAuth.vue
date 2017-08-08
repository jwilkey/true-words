<template>
  <div id="authorize-div" class="clearfix theme-mid shadow" @click="signInToDrive(event)">
    <img class="drive-logo" src="../assets/drive.png" />
    <div class="drive-text">
      <p class="drive-connect">Sign in using Google</p>
      <p class="drive-connect-label muted">Save your studies in Google Drive</p>
    </div>
  </div>
</template>

<script>
import container from '../js/container'

export default {
  data () {
    return { }
  },
  methods: {
    signInToDrive () {
      container.authHandler.signIn('GOOGLE_DRIVE')
    }
  }
}
</script>

<style lang="less">
@import '../../static/less/colors.less';

#authorize-div {
  display: table;
  @media screen and (max-width: 767px) {
    padding-left: 10px;
  }
  @media (min-width: 768px) {
    padding-left: 20px;
  }
  padding: 10px;
  padding-right: 20px;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 0px 15px rgba(250, 240, 230, 0.5);
  }
}
.drive-text {
  display: table-cell;
  vertical-align: middle;
  width: 100%;
}
.drive-logo {
  @media screen and (max-width: 767px) {
    width: 50px;
    height: 50px;
    margin-right: 15px;
  }
  @media (min-width: 768px) {
    width: 80px;
    height: 80px;
    margin-right: 25px;
  }
  display: table-cell;
  float: left;
}
.drive-connect-label {
  margin-bottom: 0px;
}
.drive-connect {
  font-size: 23px;
  margin-bottom: 0px;
}
</style>
