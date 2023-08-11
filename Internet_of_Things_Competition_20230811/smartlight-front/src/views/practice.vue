<template>
  <div class="main_container">
   <div class="test"></div>

  </div>
</template>

<script>
export default {
  data() {
    return {
    
    }
  },
  computed: {
   classOption () {
     return {
      step: 0.2, // 数值越大速度滚动越快
      limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
      hoverStop: true, // 是否开启鼠标悬停stop
      direction: 1, // 0向下 1向上 2向左 3向右
      openWatch: true, // 开启数据实时监控刷新dom
      singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
      singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
      waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
    }
  }
},
  methods: {
   
 
  },
  mounted() {
    
  },
  created() {
  
  
  }

}
</script>

<style lang="less" >

.main_container {
  width: 100%;
  height: 100%;
  min-width: 1200px;
  background-color: #fff;
  .test{
     position: absolute;
      background-color: #fff;
      width:500px;
      height: 500px;
      top:0px;
      left:0px;
  }

  
}

.energy {
  height: 100%;
}

.content {
  height: 100%;
}

.echarts_main {
  height: 80%;
  // background-color: #fff;
  // height: 400px;
}
</style>
