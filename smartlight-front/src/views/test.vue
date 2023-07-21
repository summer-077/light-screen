<template>
  <div class="energy_container" z-index="20">
    
      <div class="alert_energy" z-index="22"> 
              <div class="alert_content">
                 <div class="videobox">
                  <video id="video" controls></video>

                 </div>
              </div>
      </div>
  </div>
</template>

<script>
import Hls from 'hls.js';

export default {
  data() {
    return {
      flvPlayer: null,
    }
  },
  methods: {},
  mounted() {
  if (Hls.isSupported()) {
    const video = document.getElementById('video'); // 假设已经有一个id为video的video元素

    const hls = new Hls();
    hls.loadSource('https://cmgw-vpc.lechange.com:8890/LCO/6H0BAF7PAG6A1B8/0/0/20230720T142110/d5a0672671781989eedc482f3e4f7da8.m3u8?proto=https'); // 填写你的HLS链接地址
    hls.attachMedia(video);
  }
},

}

</script>

<style lang="less" scoped>
/* 整个滚动条 */
/* 宽高分别对应纵向滚动条和横向滚动条的宽度 */
::-webkit-scrollbar {
  display:none;
}

.energy_container{
  margin:0px;
  padding:0px;
  width:100%;
  height: 100%;
  position: absolute;
  top:0px;
  left:0px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  .alert_energy{
      width:60%;
      height:70%;
      box-sizing: border-box;
      .alert_content{
        padding:20px;
        height:100%;
        box-sizing: border-box;
        overflow: auto;
        text-align:center;
        .videobox{
          width:500px;
          height:500px;
          #video{
            width:100%;
            height:100%;
          }

        }
       
      }
  }

}



</style>