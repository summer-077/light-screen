<template>
  <div id="app">
    
      <router-view></router-view>
      
  </div>
</template>

<script >
export default {
 


  mounted() {},

  created() {

  }
};
</script>

<style lang="less">
    html, body {
        height: 100%;
        height: 100%;
        background-color: rgb(19, 29, 47);
    } 
#app {
  width: 100%;
  height: 100%;
  min-height: 600px;
  min-width: 1450px;
  box-sizing: border-box;
  background-color: rgb(9, 18, 32);
  // overflow: hidden;
  // width: 100vw;
  // position:relative;

  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
}
</style>
