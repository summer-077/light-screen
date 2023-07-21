<template>
  <div class="light_container" z-index="20">
    <div class="alert_light" z-index="22">
      <!-- <dv-border-box-8 backgroundColor="rgb(51,91,132,0.9)" :dur="10"> -->
        <div class="alert_content">

          <div class="alert_title">路灯控制</div>
          <!-- <div class="alert_all_control">
            <div>
              <el-select  @change="caseChoose" v-model="all_control" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div> -->
          <div class="alert_form">
            <table  class="table">
              <thead>
                <tr>
                  <th style="width: 25%;">市政编号</th>
                  <th style="width: 25%;">控制设备</th>
                  <th style="width: 25%;" class="text_component">
                    <div class="luminance">
                      <div>亮度控制</div>
                      <div class="slider">
                        <el-slider
                          @change="allSlider"
                          :step="1"
                          :max="2"
                          :min="1"
                          :marks="marks"
                          :disabled="all_light_forbid || all_switch_forbid || guest_forbid"
                          v-model="all_slider"
                        ></el-slider>
                      </div>
                    </div>
                  </th>
                  <th style="width:25%;">
                    <div class="switch_con">
                      <div class="switch_label">开关控制</div>
                      <div>
                        <el-switch
                          :disabled=" all_light_forbid||guest_forbid"
                          @change="allSwitch"
                          v-model="all_switch"
                          active-color="#13ce66"
                          inactive-color="#ff4949"
                       
                          :width="60"
                        ></el-switch>
                      </div>
                    </div>

                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="key,i in lightTable" :key="i">
                  <td>{{ key['road_code'] }}</td>
                  <td>{{ key['dev_id'] }}</td>
                  <td>
                    <div class="slider_con">
                      <div class="slider">
                        <el-slider
                        :disabled="!key.type || all_light_forbid ||guest_forbid" 
                        :step="1"
                        :max="2"
                        :min="1"
                        :marks="marks"
                        @change="sendChange(key,0)"
                        v-model="key.status"></el-slider>
                      </div>
                    </div>
              
                  </td>
                  <td>
                    <div>
                      <el-switch
                        :disabled="all_light_forbid || guest_forbid"
                        v-model="key.type"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        :width="60"
                        @change="sendChange(key,1)"
                      ></el-switch>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      <!-- </dv-border-box-8> -->
    </div>
  </div>
</template>

<script>
export default {
  props:{
    marker:{
      type:Array,
      default: function() {
      return [] /* 这里是默认值对象的定义 */ 
    }
    },
  },
  data() {
    return {
      options: [
        {
          value: "1",
          label: "全手动"
        },
        {
          value: "2",
          label: "预设方案1"
        },
        {
          value: "3",
          label: "预设方案2"
        },
        {
          value: "4",
          label: "全自动"
        }
      ],
      low_high_form:{
        low:null,
        high:null
      },
      dialogVisible:false,
      all_control: "1", //自动/手动
      all_slider: 2, //总的亮度控制
      all_light_forbid: false,
      marks:{
        1:"低",
        2:"高",
      },
      // 访客禁用
      guest_forbid: false,
      all_switch: true, //总的控制开关
      all_switch_forbid: false, //开关是否禁用
      lightTable: [],
      light_socket: null,
      case_control:null,//自动、手动的值
      case_socket:null,
    };
  },
  methods: {

    closeEnergy() {
      // 添加点击事件监听器到整个文档
      let that = this;
      document.addEventListener("click", function(event) {
        if (event.target.className == "light_container") {
          that.$emit("close", "manual");
        }
      });
    },
    //点击全局开关，所有开关要保持一致，也就是所有的type和e保持一致，同时如果为关的状态，status要为0
    allSwitch(e) {
      console.log("allswitche", e);
      let that = this;
      //e为false的时候表示开关关上，此时禁用开启，所以true，！e
      this.all_switch_forbid = !e;
      for (let i = 0; i < that.lightTable.length; i++) {
        that.lightTable[i]["type"] = e;
        that.sendChange( that.lightTable[i])
      }
    },
    //全局滑块控制，所有滑块都得保持一致，当全局滑块为0，开关关上
    allSlider(e) {
      let that=this
      for (let i = 0; i < that.lightTable.length; i++) {
        that.lightTable[i]["status"] = e;
        that.sendChange( that.lightTable[i])
      }
    },
    caseinit(){
      let that = this;
      //接收控制方案手动、自动
      this.case_socket=new WebSocket("ws://43.139.95.60:4006/smart_switch")
      this.case_socket.onmessage=(e)=>{
        let resp=JSON.parse(e.data)
        console.log("e.data",e.data);
        if(resp.smart_switch==false){//false为手动模式，开启按钮
          // 让按钮可以使用
          that.all_light_forbid=false
          // that.all_control="1"    
        }else{
          that.all_light_forbid=true
          // that.all_control="4"
        }
      }
      console.log("all_light_forbid",this.all_light_forbid);
    

    },
    //路灯控制页面
    initLight() {
      let that=this
      this.caseinit()
      //接收每个路灯的数据
      
      this.light_socket=new WebSocket("ws://43.139.95.60:4006/light_ctrl")
      this.light_socket.onmessage=(e)=>{
        let resp=JSON.parse(e.data)
        let list=resp
        //只有在初始化的时候才会拿到坐标
        console.log("Object.keys(resp).length",Object.keys(resp).length);
        // 当初始化参数不为1个，就是存在inwork这个参数
        if(Object.keys(resp).length!=1){
          that.$emit('ifInWork',list['in_work_time'])
        }

        if(Object.keys(resp)[0]=='init_light_msg'){
            that.lightTable=list['init_light_msg']
            that.all_slider=that.lightTable[0]['status']
        }else if(Object.keys(resp)[0]=='light_msg'){
          //得到一个路灯改变后的数值，我需要将新的值
          for (let i=0;i<that.lightTable.length;i++){
            if(that.lightTable[i]['dev_id']==list['light_msg']['dev_id']){
              this.$set(this.lightTable[i], 'status', list.light_msg.status)
              this.$set(this.lightTable[i], 'type', list.light_msg.type)
            }
          }
        }else{
          that.$emit('ifInWork',list['in_work_time'])

        }
        this.$forceUpdate()
      }
    },
    
    //手动、自动还是方案
    caseChoose(e){
      // e打印是1，2，3，4
      let that=this
      if(e==false){
        this.all_light_forbid=false
        that.case_socket.send(JSON.stringify({"smart_switch": false}));
   
        }else if(e==true){
          this.all_light_forbid=true
        that.case_socket.send(JSON.stringify({"smart_switch": true}));
     
        }
    
    },
    // low-high表单清空
    resetFields(){
      this.low_high_form.low=null
      this.low_high_form.high=null
    },
    //关闭弹窗之前
    handleClose(){
      this.dialogVisible=false
      this.$nextTick(()=>{
        this.resetFields()
      })
    },
    // 处理亮度控制提交
    async handleUpload(){
      this.dialogVisible=false
      // const resp=await this.$http.put("/");
    },
    sendChange(item,type){
      // console.log(this.lightTable);
      let status=item.status
      if(item.type==false){
        status=0
      }
      
      console.log( "status",status)
      this.light_socket.send(JSON.stringify({
        "dev_id":item.dev_id,
        "status":status
      }))


      if (type ==0) {
        let flag = true
        this.lightTable.forEach(val=> {
          if (val.status != item.status) {
            flag = false;
          }
        })

        if (flag) {
          this.all_slider = item.status;
        }
      }
      if (type ==1) {
        let flag = true
        this.lightTable.forEach(val=> {
          if (val.type != item.type) {
            flag = false;
          }
        })

        if (flag) {
          this.all_switch = item.type;
        }
      }
    },
    ifGuest(){
      if(window.sessionStorage.getItem('username')=='guestMode'){

        this.guest_forbid=true
      }
    }
  },
  mounted() {
    this.closeEnergy();
    this.initLight();
    this.ifGuest();
  },
  created() {

  }
};
</script>

<style lang="less">
// 亮度调节的文字大小
.el-button--medium{
  font-size: 1.25rem;
}

// 设置文字在开关内部
.el-switch__label{
  color:#909399;
}


/* 整个滚动条 */
/* 宽高分别对应纵向滚动条和横向滚动条的宽度 */
.el-slider__marks-text{
  font-size:1.25rem !important;
  color:#fff !important
}

::-webkit-scrollbar {
  display: none;
}
.el-slider__runway{
  height:6px !important;
}

.light_slider{
    width:30%;
  }
  .light_slider_special{
    padding:0 20%;
  }

.light_container {
  .el-input__inner {
    background-color: none !important;
  }

  width: 100%;
  min-width: 1200px;
  height: 100%;
  min-height: 800px;
  position: absolute;
  top: 0px;
  left: 0px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  .alert_light {
    width: 80%;
    height: 70%;
    box-sizing: border-box;
    //“边框内最大盒子”
    .alert_content {
      padding: 20px;
      height: 100%;
      box-sizing: border-box;
      overflow: auto;
      text-align: center;
      .alert_title {
        font-size: 3rem;
        text-align: center;
        color: aliceblue;
        position: sticky;
      }
      //'自动手动'
      .alert_all_control {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 10px 20px;
        // justify-content: end;
        font-size: 1.5rem;
        color: aliceblue;
      }
      //包裹表格的盒子
      .alert_form {
        margin-top:10px;
        width:100%;
        justify-content: center;
        margin:0 auto;
        .table{
          width:100%;
          text-align: center;
          th,td{
            padding:20px 0px;
            color:aliceblue;
          }
          th{
            font-size: 1.5rem;
            font-weight: 500;
            // display:flex;
            // flex-direction: row;
            .luminance {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              .slider {
                width: 90px;
                padding: 0 40px;
              }
            }
            .switch_con {
              display: flex;
              justify-content: center;
              width: 100%;
              align-items: center;
              .switch_label {
                margin-right: 20px;
              }
            }
          }
          td{
            font-size: 1.5rem;
            .slider_con {
              display: flex;
              justify-content: center;
              .slider {
                width: 90px;
              }
            }
          }
          //带有文字和组件的ui控制
          .text_component{
            // display:flex;
            // flex-direction: row;
          }
          // .slider{
          //   width:50%;
          // }
        }
      }
    }
  }
}
</style>