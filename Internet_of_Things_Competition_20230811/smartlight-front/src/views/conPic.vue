<template>
  <div class="energy_container" z-index="20">
      <div class="alert_energy" z-index="22"> 
              <div class="alert_content">
                <div class="title">月能耗图</div>
                <div id="month_main" class="month_main"></div>
                  
              </div>
      </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {

data(){
  return{
    sensor_msg:'',
    tableData: [],
    month_new_list:[],
    month_old_list:[],
    monthChart:null,

  }
},
methods:{
  closeEnergy(){
    // 添加点击事件监听器到整个文档
    let that=this
    document.addEventListener('click', function(event) {
      if (event.target.className=='energy_container') {
        that.$emit('close','consumption')
      }
    });
  },
  echarts_init() {
      // 基于准备好的dom，初始化echarts实例
      let that = this;
      this.monthChart = echarts.init(document.getElementById("month_main"));
      // 绘制图表
      this.monthChart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        color:['rgb(71, 170, 191)','rgb(255, 73, 73)'],
        legend: {
          data: ["节能后能耗","节能前能耗"],
          textStyle: {
            color: '#fff', // 设置图例字体的颜色,
            fontSize: 20
          }
        },

        backgroundColor: "rgb(31,54,83,0.2)",
        toolbox: {
          iconSize:40,
          iconStyle: {
              borderColor: '#fff'
            },
          feature: {
             saveAsImage: {
              iconSize: [40, 40] // 设置数据视按钮图标大小为 20 像素
            }
          }
        },
        grid: {
          left: "3%",
          right: "10%",
          bottom: "20%",
          containLabel: true
        },
        xAxis: [
          {
            name: "月能耗量(度)",
            type: "category",
            nameGap: 40,
            offset: 5,
            boundaryGap: false,
            nameLocation: "center",
            nameTextStyle: {
              color: '#fff',
              fontSize:20,
              lineHeight: 2
            },
            axisLabel: {
              color: '#fff', // 设置纵坐标的字体颜色
              fontSize:20
            },
            position: "bottom",
            data:['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          }
        ],
        yAxis: [
          {
            name: "度",
            // offset:,
            offset: 15,
            nameGap: 25,
            nameTextStyle: {
              color: '#fff',
              fontSize:20
            },
            type: "value",
            axisLabel: {
              color: '#fff', // 设置纵坐标的字体颜色
              fontSize:20
            }
          }
        ],
        series: [
          {
            name: "节能后能耗",
            type: "line",
            smooth: true,
            label: {
              show: true,
              position: "top",
              fontSize: 20,
              color:'#fff'
            },
            areaStyle: {
              
            },
            emphasis: {
              focus: "series"
            },
            data: that.month_new_list
          },
          // {
          //   name: "节能前能耗",


          //   type: "line",
          //   smooth: true,
          //   label: {
          //     show: true,
          //     position: "top",
          //     fontSize: 20,
          //     color:'#fff'
          //   },
          //   areaStyle: {},
          //   emphasis: {
          //     focus: "series"
          //   },
          //   data:  [220, 182, 191, 234, 290, 330, 310,220, 182, 191, 234, 290, 330]
          // },
          
        ]
      });
    },

    async monthSave(){
      let that=this
      const resp= await this.$http.get("/elect_month")
      this.month_new_list=resp.data.year_total
      console.log("this.month_new_list",this.month_new_list)

      this.monthChart.setOption({
        series:[
          {
            name:"节能后能耗",
            data:that.month_new_list
          }
        ]
      })

    }

},
mounted(){
  this.closeEnergy();
  this.echarts_init();
  this.monthSave()
  setInterval(()=>{
    this.monthSave()
  },840000000)


  

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
    height:80%;
    box-sizing: border-box;
    .alert_content{
      padding:20px;
      height:100%;
      width:100%;
      box-sizing: border-box;
      // overflow: auto;
      text-align:center;
      .title{
        font-size: 2.5rem;
        color:aliceblue;
        margin-bottom: 5%;;
      }
      // echarts
      #month_main {
        // height: 85%;
        width: 100%;
        height: 100%;
        // margin-top: 5%;
        // background-color: #fff;
        // height: 400px;
      }
        
      }
  }
}



</style>