<template>
  <div id="app">
   <baidumap class="map"></baidumap>
   <!-- <helloworld></helloworld> -->
  </div>
</template>

<script>
import baidumap from './components/BaiduMap.vue'
// import helloworld from "./components/HelloWorld.vue"
export default {
  name: 'App',
  components: {
    baidumap,

  }
}
</script>

<style>
html,body{
  height:100%;
  margin:0;
}
#app {
  height:100%;

}

.map{
  width: 100%;
  height:100%;

}
</style>


