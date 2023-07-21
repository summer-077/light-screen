<template>
  <div class="auto_container" z-index="20">
    <!-- <dv-border-box-8 backgroundColor="rgb(51,91,132,0.9)" :dur="10"> -->
    <div class="alert_content">
      <el-dialog title="高级设置" :visible.sync="ifAuto" :before-close="handleClose">

        <div v-for="autoform, i in lightformlist" :key="i" class="formlist">
          <el-form :model="autoform" ref="autoform" label-position="left" label-width="180px" :rules="rules"
            :disabled="autoforbid">
            <el-form-item label="时间段" required>
              <el-col :span="8">
                <el-form-item prop="starttime">
                  <el-time-select placeholder="开始时间" v-model="autoform.starttime" :picker-options="{
                    start: '00:00',
                    step: '00:15',
                    end: '23:59',
                    maxTime: autoform.endtime
                  }" @change="handleTime(i,1)" style="width: 100%;"></el-time-select>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="1">-</el-col>
              <el-col :span="8">
                <el-form-item prop="endtime">
                  <el-time-select placeholder="结束时间" :picker-options="{
                    start: '00:00',
                    step: '00:15',
                    end: '23:59',
                    minTime: autoform.starttime
                  }" 
                  @change="handleTime(i,2)"
                  v-model="autoform.endtime" style="width: 100%;"></el-time-select>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="控制模式" prop="controltype">
              <el-radio-group v-model="autoform.controltype">
                <el-radio label="1">一对一</el-radio>
                <el-radio label="2">一对二</el-radio>
                <el-radio label="3">一对三</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="关灯延时(s)" prop="closetime" label-position="left">
              <el-input placeholder="关灯延时必须不小于5s" v-model.number="autoform.closetime" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="感知端上报间隔时间" prop="sensetime">
              <el-input placeholder="范围2-2500，2500是500ms，1800是300ms，2是100ms,根据测试的时间延迟计算"
                v-model.number="autoform.sensetime" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="高亮度低亮度占比" prop="lowhigh">
              <div class="lowhigh">
                <el-slider v-model="autoform.lowhigh" :marks="marks"></el-slider>
              </div>
            </el-form-item>
          </el-form>
          <div class="delete">
            <el-button v-if="i != 0" type="danger" size="mini" @click="handDel(i)" :disabled="autoforbid">删除</el-button>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="success" @click="handleAdd" :disabled="autoforbid">新增时段设置</el-button>
          <el-button type="primary" @click="handleAuto" :disabled="autoforbid">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- </dv-border-box-8> -->
  </div>
</template>

<script>
export default {
  data() {
    var validsense = (rule, value, callback) => {
      if (value > 2500 || value < 2) {
        callback(new Error('输入范围为2-2500'))
      } else {
        // this.$refs['autoform'].validateField('sensetime');
        callback()
      }
    }
    var validclose = (rule, value, callback) => {
      if (value < 5) {
        callback(new Error('输入范围为2-2500'))
      } else {
        // this.$refs['autoform'].validateField('sensetime');
        callback()
      }
    }

    return {
      lightformlist: [
        {
          endtime: "",
          starttime: "",
          controltype: "",
          closetime: "",
          sensetime: "",
          lowhigh: 0
        },
        {
          endtime: "",
          starttime: "",
          controltype: "",
          closetime: "",
          sensetime: "",
          lowhigh: 0
        }
      ],
      // 时间选择之间的占位
      autoforbid: false,
      ifAuto: false,
      autoform1: {
        // delay:null,
        lowhigh: null,
        sensetime: null,
        closetime: null,
        controltype: null,
        starttime: null,
        endtime: null
      },
      marks: {
        0: "低",
        100: "高"
      },


      rules: {
        endtime: [{ required: true, message: "请选择结束时间", trigger: "change" }],
        starttime: [{ required: true, message: "请选择开始时间", trigger: "change" }],
        lowhigh: [
          { required: true, trigger: "blur" }
        ],
        // 感知时间2-2500，进行数字校验
        sensetime: [
          { required: true, message: "请输入感知端上报时间", trigger: "blur" },
          { type: "number", message: '必须为数字', trigger: 'blur' },
          { validator: validsense, message: '范围为2-2500' }
        ],
        controltype: [
          { required: true, message: "请选择控制模式", trigger: "change" },
        ],
        closetime: [
          { required: true, message: "请输入数字设置关灯延时", trigger: "blur" },
          { type: "number", message: '必须为数字', trigger: 'blur' },
          { validator: validclose, message: '必须大于5秒' }

        ]
      }
    };
  },
  methods: {
    handleClose(done) {
      this.handleConcel()
      done();
    },
    handleConcel() {
      for (let i = 0; i < this.$refs['autoform'].length; i++) {
        this.$refs['autoform'][i].resetFields()
        this.$refs['autoform'][i]['lowhigh']=0
      }

    },
    open() {
      this.ifAuto = true;
    },
    handleAdd() {
      this.lightformlist.push({
        endtime: "",
        starttime: "",
        controltype: "",
        closetime: "",
        sensetime: "",
        lowhigh: 0
      })

    },
    handDel(i) {
      this.lightformlist.splice(i, 1)
    },
    handleTime(i,item) {
      if(item==1){
        if (i != 0) {
          let ifright = this.validTime(i)
          if (ifright == -1) {
            this.lightformlist[i]['starttime'] = ''
            this.$message.warning("当前开始时间不能小于上一时间段结束时间")
          }
        }
      }else{
        if (i != this.lightformlist.length-1) {
          let ifright = this.validTime(i+1)
          if (ifright == -1) {
            this.lightformlist[i]['endtime'] = ''
            this.$message.warning("当前结束时间不能大于下一时间段开始时间")
          }
        }

      }
    },
    async initAuto(){
      const resp=await this.$http.get('/get_advanced_setting')
      this.lightformlist=resp.data
      console.log("resp",resp.data);
      console.log('this.lightformlist',this.lightformlist);

    },
    handleAuto() {
      let that = this
      let validlength = 0
      console.log("this.lightformlist", this.lightformlist);
      for (let i = 0; i < this.$refs['autoform'].length; i++) {
        this.$refs['autoform'][i].validate((valid) => {
          if (valid) {
            validlength++;
            if (validlength == this.$refs['autoform'].length) {
              this.$http.post('/set_advanced_setting',this.lightformlist).then(resp=>{
                this.handleConcel()
                this.$message.success('设置成功')
                that.ifAuto = false
                that.initAuto()
              })
              // 这里有点问题，会先执行这个再打印上面数据，等到对接口的时候，要把这个挪到接口完成之后
            }
          }
        })
      }
    },
    validTime(i) {
      const [hour1, minute1] = this.lightformlist[i]['starttime'].split(":");
      const [hour2, minute2] = this.lightformlist[i - 1]['endtime'].split(":");

      // 将小时和分钟转换为数值类型
      const numHour1 = parseInt(hour1, 10);
      const numMinute1 = parseInt(minute1, 10);
      const numHour2 = parseInt(hour2, 10);
      const numMinute2 = parseInt(minute2, 10);

      // 比较小时部分
      if (numHour1 < numHour2) {
        return -1; // time1 小于 time2
      } else if (numHour1 > numHour2) {
        return 1; // time1 大于 time2
      } else {
        // 如果小时部分相同，则比较分钟部分
        if (numMinute1 < numMinute2) {
          return -1; // time1 小于 time2
        } else if (numMinute1 > numMinute2) {
          return 1; // time1 大于 time2
        } else {
          return 0; // time1 等于 time2
        }
      }

    },
    ifGuest() {
      if (window.sessionStorage.getItem('username') == 'guestMode') {
        this.autoforbid = true
      }
    }
  },
  mounted() {
    this.ifGuest()
    this.initAuto()
  },
  created() { }
};
</script>

<style lang="less">
/* 整个滚动条 */
/* 宽高分别对应纵向滚动条和横向滚动条的宽度 */
::-webkit-scrollbar {
  display: none;
}

.auto_container {
  .line{
    display:flex;
    justify-content: center;
  }
  .formlist {
    margin-bottom: 50px;
    border-bottom: 2px solid #dbdbdb;
    padding-bottom: 20px;

    .delete {
      display: flex;
      justify-content: end;
    }

    .el-slider__marks-text {
      font-size: 1rem !important;
      color: #606266 !important
    }

    .lowhigh {
      width: 98%;
      padding-right: 202px;
    }


  }

  // .el-input__inner {
  //   background-color: none !important;
  // }

  // width: 100%;
  // min-width: 1200px;
  // height: 100%;
  // min-height: 800px;
  // position: absolute;
  // top: 0px;
  // left: 0px;
  // background: rgba(0, 0, 0, 0.5);
  // backdrop-filter: blur(3px);
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // .alert_light {
  //   width: 80%;
  //   height: 70%;
  //   box-sizing: border-box;
  //   //“边框内最大盒子”
  //   .alert_content {
  //     padding: 20px;
  //     height: 100%;
  //     box-sizing: border-box;
  //     overflow: auto;
  //     text-align: center;
  //   }
  // }
}
</style>