<template>
  <div class="main_container">
    <div class="top_energy">
      <dv-border-box-1 backgroundColor="rgb(40,60,100,0.9)">
        <div class="all_energy">
          <div class="energy_consume">
            <div class="title">当日总节能(度):</div>
            <div class="consume_num" :all_consumption="all_consumption">{{ all_consumption }}</div>
          </div>
          <div class="energy_save">
            <div class="title">当日节能百分比:</div>
            <div class="save_num" :all_energy_save="all_energy_save">{{ all_energy_save }}%</div>
          </div>
        </div>
      </dv-border-box-1>
      <el-alert v-show="ifinwork" title="当前非路灯通电时段" type="warning" :closable="false" description="当前时间段路灯没有通电，处于非工作状态"
        show-icon>
      </el-alert>
    </div>

    <div class="left">
      <div class="top">
        <dv-border-box-13 backgroundColor="rgb(31,54,83,0.7)" z-index="9">
          <div class="hlvbox">
            <!-- <div class="title_video" @click="watch('consumption')">路灯监控</div> -->
            <div class="title_video">路灯监控</div>
            <div class="content">
              <test @close="close" ref="auto" ></test>
            </div>
          </div>
        </dv-border-box-13>
      </div>

      <div class="bottom">
        <dv-border-box-10 backgroundColor="rgb(31,54,83,0.7)">
          <div class="perception">
            <div class="title" @click="watch('energy')">感知设备</div>
            <div class="content">
              <ul class="ul">
                <li class="form_title">
                  <div class="title_name">感知设备</div>
                  <div class="title_name">车/人感知-有/无</div>
                  <div class="title_name">光照强度(lux)</div>
                </li>
                <li v-for="item, key in energy_list.init_sensor_msg">
                  <div class="title_name">{{ key }}</div>
                  <div class="title_name">{{ item['speed'] == 0 ? '无' : '有' }}</div>
                  <div class="title_name">{{ item['lux'] }}</div>
                </li>
              </ul>
            </div>
          </div>
        </dv-border-box-10>
      </div>
    </div>

    <div class="right">
      <div class="top">
        <dv-border-box-13 backgroundColor="rgb(31,54,83,0.7)" z-index="9">
          <div class="energy">
            <div class="title" @click="watch('consumption')">能耗图</div>
            <div class="content">
              <div id="main" class="echarts_main"></div>
            </div>
          </div>
        </dv-border-box-13>
      </div>

      <div class="bottom">
        <dv-border-box-10 backgroundColor="rgb(31,54,83,0.7)">
          <div class="light_con">
            <div class="title_con">
              <div class="title_name">
                <div class="title_light_condition"> 路灯状况</div>
                <div class="mode_choose">
                  <el-tooltip class="item" effect="dark" :content="manual_content" placement="top-start">
                    <div class="manual_mode" @click="watch('manual')" style="padding:0 10px 0 10px;">手动</div>
                  </el-tooltip>
                  <el-switch v-model="modeChoose" active-color="#13ce66" inactive-color="#ff4949" :width="60"
                    :disabled="ifGuest" @change="handleModeChoose"></el-switch>
                  <el-tooltip class="item" effect="dark" :content="auto_content" placement="top">
                    <div class="auto_mode" @click="watch('auto')" style="padding:0 10px 0 10px;">自动</div>
                  </el-tooltip>
                </div>
              </div>
              <div class="form_title">
                <div style="width:30%;">路灯</div>
                <div style="width:30%;">亮度</div>
                <div style="width:40%;">时间</div>
              </div>
            </div>
            <div id="scrollbar" class="box">
              <div :style="'transform: translateY(' + scroll + 'px);'" id="scroll" class="SCROLL">
                <div>
                  <li class="data" v-for="key in light_list">
                    <div class="form_title">
                      <div style="width:30%;">{{ key['dev_id'] }}</div>
                      <div style="width:30%;">{{ key['new_status'] }}</div>
                      <div style="width:40%;">{{ key['time'] }}</div>
                    </div>
                  </li>
                </div>
              </div>
            </div>
          </div>
        </dv-border-box-10>
      </div>
    </div>
    <routerselect @change="on_change" ref="routerselect" :z-index="-1"></routerselect>

    <transition name="fade" mode="out-in">
      <energy v-show="ifenergy" @close="close" :energy_list="energy_list"></energy>
    </transition>
    <transition name="fade" mode="out-in">
      <manual v-show="ifManual" @close="close" @ifInWork="ifInWork" ref="manual"></manual>
    </transition>

    <!-- <transition name="fade" mode="out-in"> -->
    <auto @close="close" ref="auto" ></auto>
    <!-- </transition> -->

    <transition name="fade" mode="out-in">
      <conPic v-if="ifConsump" @close="close" ref="consumption"></conPic>
    </transition>
    <!-- v-if="ifManual" -->
  </div>
</template>
  
<script>
import routerselect from "../views/routerChoose.vue";
import * as echarts from "echarts";
import energy from "../views/energy.vue";
import manual from "../views/manual.vue";
import auto from "../views/auto.vue";
import conPic from "../views/conPic.vue";
import Socket from "../websocket/websocket.js";
import test from "../views/test.vue"
export default {
  data() {
    return {
      scroll: 0,
      dataform: "",
      name: "",
      light: "",
      speed: "",
      is_op: "",
      zoom: 17,
      loading: false,
      item: 6,
      ifenergy: false,
      ifManual: false,
      ifAuto: false,
      ifConsump: false,
      sensor_msg: null,
      energy_list: { init_sensor_msg: null }, //感知设备数据展示,
      light_list: null,
      light_msg: null,
      day_new_list: null,
      day_old_list: null,
      //总节能，总耗能
      all_consumption: 0,
      all_energy_save: 0,
      myChart: null,
      light_socket: null,
      // 设置七天日期
      startDate: new Date(),
      numberOfDays: 7,
      // 手动自动控制的websocket
      case_socket: null,
      // 手动自动模式选择开关
      modeChoose: null,
      autoform: {
        // delay:null,
        low: null,
        high: null

      },
      // 路灯白天状态
      ifinwork: false,
      // 游客
      ifGuest: null,
      // 手动模式下禁止设置自动
      autoforbid: false,
      // 路灯状况模式提示文字
      manual_content: '开启手动模式后，自动模式设置被禁用，点击手动进入页面，可以控制路灯的开关以及亮度调节',
      auto_content: '开启高级模式后，手动模式被禁用，点击高级进入页面，高级模式下可以设置高亮度低亮度占比等参数'
    };
  },
  components: {
    energy,
    manual,
    routerselect,
    auto,
    conPic,
    test
  },
  methods: {
    on_change(e) {
      this.$emit("change", e)
    },

    set_options(options) {
      let that = this
      this.$nextTick(() => {

        that.$refs['routerselect'].set_options(options)
      })
    },


    watch(resp) {
      if (resp == "energy") {
        this.ifenergy = true;
      } else if (resp == "manual") {
        this.ifManual = true;
      } else if (resp == "auto") {
        this.$refs.auto.open();
      } else if (resp == "consumption") {
        this.ifConsump = true;
      }
    },
    close(resp) {
      if (resp == "energy") {
        this.ifenergy = false;
      } else if (resp == "manual") {
        this.ifManual = false;
      } else if (resp == "auto") {
        this.$refs.auto.ifAuto = false;
      } else if (resp == "consumption") {
        this.ifConsump = false;
      }
    },

    echarts_init() {
      // 基于准备好的dom，初始化echarts实例
      let that = this;
      this.myChart = echarts.init(document.getElementById("main"));
      // 绘制图表
      this.myChart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        color: ['rgb(71, 170, 191)', 'rgb(255, 73, 73)'],
        legend: {
          data: ["节能前能耗", "节能后能耗"],
          textStyle: {
            color: '#fff', // 设置图例字体的颜色,
            fontSize: 17
          }
        },
        backgroundColor: "rgb(31,54,83,0.2)",
        toolbox: {
          iconSize: 40,
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
          left: "4%",
          right: "10%",
          bottom: "15%",
          containLabel: true
        },
        xAxis: [
          {
            name: "近7天能耗量(度)",
            type: "category",
            nameGap: 40,
            offset: 10,
            boundaryGap: false,
            nameLocation: "center",
            nameTextStyle: {
              color: '#fff',
              fontSize: 18,
              lineHeight: 2
            },
            axisLabel: {
              color: '#fff', // 设置纵坐标的字体颜色
              fontSize: 15
            },

            position: "bottom",
          }
        ],
        yAxis: [
          {
            name: "度",
            offset: 15,
            nameGap: 25,
            nameTextStyle: {
              color: '#fff',
              fontSize: 18
            },
            type: "value",
            axisLabel: {
              color: '#fff', // 设置纵坐标的字体颜色
              fontSize: 15
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
              position: "bottom",
              fontSize: 15,
              color: '#fdf6ec'
            },
            areaStyle: {

            },
            emphasis: {
              focus: "series"
            },


            data: that.day_new_list,
            z: 2
          },
          {
            name: "节能前能耗",
            type: "line",
            smooth: true,
            label: {
              show: true,
              position: "top",
              fontSize: 15,
              color: '#fff'
            },
            areaStyle: {},
            emphasis: {
              focus: "series"
            },
            data: that.day_old_list,
            z: 1
          },

        ]
      });
    },
    //获取日期
    updateX() {
      const dates = [];
      for (let i = 0; i < this.numberOfDays; i++) {
        const date = new Date();
        date.setDate(this.startDate.getDate() - i);

        const formattedDate = this.formatDate(date);
        dates.unshift(formattedDate);
      }
      return dates
    },
    //格式化日期
    formatDate(date) {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
    },
    //更新echarts横坐标
    updateEchartsX() {
      const resp = this.updateX()
      this.myChart.setOption({
        xAxis: [
          {
            type: 'category',
            data: resp
          }
        ]
      });
    },
    // 处理高级设计提交
    handleAuto() {

    },


    //左边感知设备数据获取
    initEnergy() {
      let that = this;
      this.sensor_msg = new WebSocket("ws://43.139.95.60:4006/sensor_msg");

      this.sensor_msg.onmessage = function (e) {
        const resp = JSON.parse(e.data);
        const list = { ...resp };
        if (Object.keys(resp)[0] == "init_sensor_msg") {
          that.energy_list = list;
        } else {
          const keyItem = Object.keys(list["sensor_msg"])[0];
          const valueItem = list["sensor_msg"][keyItem];
          that.energy_list["init_sensor_msg"][keyItem]["lux"] =
            valueItem["lux"];
          that.energy_list["init_sensor_msg"][keyItem]["speed"] =
            valueItem["speed"];
        }
      };
    },

    //右下角路灯信息获取
    initLight() {
      let that = this;
      this.light_msg = new Socket({ url: "/light_log" });
      this.light_msg.message = resp => {
        const list = { ...resp };
        if (Object.keys(resp)[0] == "init_logs") {
          that.light_list = list["init_logs"];
          this.init_scrollLight();
          // this.$nextTick(() => {
          // });
        } else {
          this.light_list.push(list.logs);
          this.init_scrollLight();
          // this.$nextTick(() => {
          // });
        }
      };
    },
    // 处理路灯手动自动状态改变
    handleModeChoose(e) {
      this.$refs.manual.caseChoose(e)
      if (e == true) {
        this.$refs.auto.autoforbid = false
      } else if (e == false) {
        this.$refs.auto.autoforbid = true
      }
    },
    // 接受手动自动消息
    caseinit() {
      let that = this;
      //接收控制方案手动、自动
      this.case_socket = new WebSocket("ws://43.139.95.60:4006/smart_switch")
      this.case_socket.onmessage = (e) => {
        //true等于关闭手动模式，开启自动模式，所以此时手动模式禁止操作，自动模式可以操作
        let resp = JSON.parse(e.data)
        if (resp.smart_switch == true) {//false为手动模式，开启按钮
          that.modeChoose = true
          that.$refs.auto.autoforbid = false
        } else {
          that.modeChoose = false
          that.$refs.auto.autoforbid = true
        }
      }
    },
    //路灯信息开关展示滚动方法
    init_scrollLight() {
      this.$nextTick(() => {

        var scrollbar = document.getElementById("scrollbar");
        var scroll = document.getElementById("scroll");
        let h = scroll.offsetHeight - scrollbar.offsetHeight;

        this.scroll = "-" + h;
      })
    },

    scrollLight() {
      this.scroll = this.scroll -= 41;
    },
    // 判断是否属于非工作白天状态
    ifInWork(e) {
      // 没有在工作，则要显示所以true
      this.ifinwork = !e
      if (e == false) {
        this.$emit('ifInWork', "http://43.139.95.60:4009/nowork.png")
      } else {
        this.$emit('ifInWork', "http://43.139.95.60:4009/work.png")
      }

    },
    //获取总耗能总节能和echarts图的数据
    async getConsumptionSave() {
      let that = this;
      const resp = await this.$http.get("/elect");
      that.all_consumption = (resp.data.today_total_max - resp.data.today_total).toFixed(1);
      if (resp.data.today_total_max == 0) {
        that.all_energy_save = 0.0
      } else {
        that.all_energy_save = (
          ((resp.data.today_total_max - resp.data.today_total) / resp.data.today_total_max) * 100
        ).toFixed(1);
      }
      that.day_new_list = resp.data.week_total;
      that.day_old_list = resp.data.week_total_max;
      this.myChart.setOption({
        series: [
          {
            // 根据名字对应到相应的系列
            name: "节能后能耗",
            data: that.day_new_list

          },
          {
            name: "节能前能耗",
            data: that.day_old_list

          },
        ]
      });
    },
    // loading加载
    loadVisible() {
      this.$emit('loadVisible')
    }
  },
  async mounted() {

    await this.initLight();
    await this.echarts_init();
    await this.updateEchartsX();
    await this.initEnergy();
    await this.caseinit();
    await this.loadVisible()
    await this.handleModeChoose()
    if (window.sessionStorage.getItem('username') == 'guestMode') {
      this.ifGuest = true
      this.$refs.auto.ifguest = true;
    }else{
      this.ifGuest = false
      this.$refs.auto.ifguest = false;

    }


  },
  created() {


    this.getConsumptionSave();
    setInterval(() => {
      this.getConsumptionSave();
    }, 300000);
  }
};
</script>
  
<style lang="less" >
// 右下角路灯滚动播放
.light_data_scroll {
  height: 200px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}



.fade-enter,
.fade-leave-to {
  opacity: 0;
}


.el-alert--warning.is-light {
  background-color: #fdf6ec;
  color: #E6A23C;
  position: relative;
  left: auto;
  top: 20px;
  width: 100%;
}

// 单独控制路灯状况标题没有动画
.title_video,
.title_light_condition {
  font-size: 1.5rem;
  color: #fff;
  text-align: center;


}

.main_container {
  width: 100%;
  height: 100%;
  min-width: 1200px;
  background-color: #fff;

  .top_energy {
    position: absolute; //让widht30%是相对于外层盒子而不是窗口大小
    top: 100px;
    left: 35%;
    width: 30%;

    .all_energy {
      height: 140px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      .title {
        height: 30%;
        color: #fff;
        font-size: 1.25rem;
      }

      .consume_num,
      .save_num {
        width: 80%;
        font-size: 3.5rem;
        color: aliceblue;
      }

      .energy_consume {
        width: 45%;
        height: 80%;
        display: flex;
        flex-direction: column;

        .title {}

        .consume_num {}
      }

      .energy_save {
        width: 45%;
        height: 80%;

        .title {}

        .save_num {}
      }
    }
  }

  .left,
  .right {
    position: absolute; //让widht30%是相对于外层盒子而不是窗口大小
    top: 100px;
    width: 30%;
    height: 85%;

    .title {
      color: #fff;
      font-size: 1.5rem;
      text-align: center;
      cursor: pointer;
      transition: font-size 0.5s;
    }

    .title:hover {
      font-size: 2rem;
      text-shadow: 2px 2px 5px rgb(112, 133, 152);
    }
  }

  .left {
    left: 40px;
    position: absolute;
    width: 30%;
    height: 85%;
    // overflow: hidden;
    .top {
      height: 60%;
      position: relative;
      .hlvbox {
        position: absolute;
        box-sizing: border-box;
        top: 0px;
        right: 0px;
        padding: 20px 40px;
        height: 100%;
        width: 100%;
        .content {
          height:90%;
          // margin-top:5%;
          display:flex;
          justify-content:center;
          align-items:center;
          #video{
            width:100%;
            height:100%;
          }
        }
      }
    }

    .bottom {
      margin-top: 5%;
      height: 36%;
      overflow: hidden;

      .perception {
        padding: 20px 10px 10%;
        color: #fff;
        font-size: 15px;
        line-height: 10px;
        height: 90%;
        overflow: hidden;

        .content {
          .ul {
            margin-left: 0px;
            list-style: none;
            padding: 0px;
            text-align: center; //文字居中

            .title_name {
              font-size: 1rem;
            }

            li {
              line-height: 180%;
              display: flex;
              // background-color: rgba(255,255,255,0.5);
              //margin: 20px;
              padding: 5px;

              div {
                font-size: 1.25rem;
                width: 35%;
              }

              flex-direction: row;
              justify-content: space-evenly;
              color: aliceblue;
            }
          }
        }
      }

    }
  }

  .right {
    right: 40px;
    position: absolute;

    .top {
      transform: rotateY(180deg);
      height: 60%;

      .energy {
        transform: rotateY(180deg);
        position: fixed;
        box-sizing: border-box;
        top: 0px;
        left: 0px;
        padding: 20px 40px;
        height: 100%;
        width: 100%;

        .content {
          // margin-top:5%;
        }
      }
    }

    .bottom {
      margin-top: 5%;
      height: 36%;
      overflow: hidden;

      .title_name {

        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: center;



        .mode_choose {
          // width:100%;
          padding: 7px 0 0 0;
          position: absolute;
          right: 0;
          display: flex;
          float: right;
          flex-direction: row;
          float: inline-end;
          color: #fff;

          .manual_mode,
          .auto_mode {
            cursor: pointer;
          }
        }
      }

      .light {
        padding: 20px 40px;
        //height:300px;
        opacity: 0.6;

        .content {
          overflow: auto;

          ul {
            list-style: none;

            li {
              line-height: 230%;
              border-bottom: 1px solid;
              color: #fff;
              text-align: center;

              .form_title {
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                align-items: center;
              }
            }
          }
        }
      }
    }
  }

  .id-button {
    position: fixed;
    top: 150px;
    left: 40px;
    width: 300px;
  }

  .web-button {
    position: fixed;
    top: 150px;
    left: 40px;
    width: 300px;
  }
}

.energy {
  height: 100%;
}

.content {
  height: 100%;
}

#main {
  // height: 85%;
  width: 100%;
  height: 85%;
  margin-top: 5%;
  // background-color: #fff;
  // height: 400px;
}

.light_con {
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 10px;

  .title {}

  .form_title {
    padding: 10px 0;
    display: flex;
    text-align: center;
    color: #fff;
    font-size: 0.5rem;
  }

  .box {
    flex: 1;
    overflow: hidden;

    .SCROLL {
      transition: all 1s;

      li {
        list-style: none;
      }
    }
  }
}
</style>
  