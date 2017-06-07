<template>
  <div class="flex-column themes text-center">
    <div class="flex-two back"> BACK </div>
    <div class="flex-two back-raised"> RAISED </div>
    <div class="flex-two back-raised2"> RAISED 2 </div>
    <div class="flex-one callout"> CALLOUT </div>
    <div class="flex-one callout-light"> CALLOUT LIGHT </div>

    <div class="themes-overlay">
      <div class="actionable"> <p>ACTIONABLE</p> </div>
      <div class="actionable-focused"> </div>
      <div class="actionable-disabled"> </div>
      <div class="highlights">
        <div class="back-red"> </div>
        <div class="back-blue"> </div>
        <div class="back-orange"> </div>
        <div class="back-purple"> </div>
        <div class="back-green"> </div>
      </div>
      <div class="highlights2">
        <div class="back-red"> </div>
        <div class="back-purple"> </div>
        <div class="back-orange"> </div>
        <div class="back-blue"> </div>
        <div class="back-green"> </div>
      </div>
    </div>
  </div>
</template>

<script>
</script>

<style lang="less" scoped>
@import '../../../static/less/colors.less';
@import '../../../static/less/flex.less';
@import '../../../static/less/common.less';

.themes {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  color: @color-text;
}
.themes-overlay {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .actionable {
    position: absolute;
    top: 10%;
    left: 40px;
    background-color: @color-actionable;
    width: 40px;
    height: 80%;
    color: @color-text;
    padding-top: 20px;
    p {
      transform: rotate(90deg);
      transform-origin: right top 80;
    }
  }
  .actionable-focused {
    position: absolute;
    top: 10%;
    left: 90px;
    width: 20px;
    height: 40%;
    background-color: @color-actionable-focus;
  }
  .actionable-disabled {
    position: absolute;
    top: 50%;
    left: 90px;
    width: 20px;
    height: 40%;
    background-color: @color-actionable-disabled;
  }

  .highlights, .highlights2 {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 25%;
    left: 50%;
    padding: 30px;
    div {
      height: 40px;
      width: 40px;
      margin: 30px;
      border-radius: 4px;
    }
  }
  .highlights2 {
    left: 75%;
    padding: 0px;
    padding-top: 80%
  }
}

.back {
  background-color: @color-back;
}
.back-raised {
  background-color: @color-back-raised;
}
.back-raised2 {
  background-color: @color-back-raised2;
}
.callout {
  background-color: @color-callout;
}
.callout-light {
  background-color: @color-callout-light;
}

</style>
