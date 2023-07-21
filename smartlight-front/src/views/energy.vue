<template>
    <div class="energy_container" z-index="20">
      
        <div class="alert_energy" z-index="22"> 
                <div class="alert_content">
                    <div class="alert_title">感知设备状态查看 </div>
                    <div class="alert_form">
                      <ul class="ul">
                        <li class="li">
                          <div class="title_item">路灯市政编号</div>
                          <div class="title_item">感知设备</div>
                          <div class="title_item">车/人感知-有/无</div>
                          <div class="title_item">光照强度(lux)</div>
                        </li>
                        <li v-for="item,key in energy_list.init_sensor_msg" class="li">
                          <div class="energy_item">{{item['road_code'] }} </div>
                          <div class="energy_item">{{key }} </div>
                          <div class="energy_item">{{item['speed'] == 0 ? '无' : '有'}}</div>
                          <div class="energy_item">{{item['lux']}}</div>
                        </li>
                      </ul>
                    </div>
                </div>
        </div>
    </div>
</template>

<script>
 export default {
  props:{
    energy_list:{
      type:Object,
      default:[],
    }
  },
  data(){
    return{
      sensor_msg:'',
      tableData: []
    }
  },
  methods:{
    closeEnergy(){
      // 添加点击事件监听器到整个文档
      let that=this
    document.addEventListener('click', function(event) {
      if (event.target.className=='energy_container') {
        that.$emit('close','energy')
        
      }
    });

    },

  },
  mounted(){
    this.closeEnergy();

    

  }

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
          .alert_title{
            font-size:2.5rem;
            margin-bottom:5%;
            text-align: center;
            color: aliceblue;
            position:sticky;
          }
          .alert_form{
            
            .ul{
              .li{
                display:flex;
                flex-direction: row;
                width:100%;
                line-height:230%;
                color:aliceblue;
                margin:10px;
                  .title_item{
                    width:33%;
                    float: inline-start;
                    font-size: 1.5rem;
                    
                  }
                  .energy_item{
                    width:33%;
                    font-size: 1.25rem;
                    float: left;
                  }
              }
              .li:hover{
                background-color: rgb(106, 122, 128); 
              }
            }
          }
        }
  

    }
  
  }



</style>