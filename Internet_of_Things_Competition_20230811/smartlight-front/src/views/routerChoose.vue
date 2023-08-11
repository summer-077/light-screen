<template>
  <div class="router_container">
    <div class="router_select">
      <el-select size="mini" @change="routerSelect" v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.street_id"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      options: [],
      value: ""
    };
  },

  methods: {
    set_options(options) {
      this.options = options;

      // console.log(options);
    },

    //选择道路定位中心点
    routerSelect() {
      this.$emit("change",this.value)
    }
  },
  mounted() {},
  created() {}
};
</script>
  
  <style lang="less" scoped>
.router_container {
  width: 100%;
  height: 100%;
  min-width: 1200px;
  background-color: #fff;
  .router_select {
    position: absolute;
    top: 6%;
    right: 6%;
  }
}
</style>
  