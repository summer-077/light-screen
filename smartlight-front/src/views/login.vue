<template>
    <div class="login-container">
        <div class="login">
        <div class="header">登录</div>
        <div class="container">
            <input type="text" placeholder="请输入用户名" v-model="loginForm.username">
            <span class="left"></span>
            <span class="right"></span>
            <span class="top"></span>
            <span class="bottom"></span>
        </div>
        <div class="container1">
            <input type="password" placeholder="请输入密码" v-model="loginForm.password">
            <span class="left"></span>
            <span class="right"></span>
            <span class="top"></span>
            <span class="bottom"></span>
        </div>
        <div class="btn" @click="handleLogin">管理登录</div>
        <div class="btn_skip" @click="handleSkip">游客登录</div>
    </div>
    </div>
</template>
  
  <script>
  export default {
    data() {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
        handleLogin() {
            let that = this;
            if(that.loginForm.username=='lion' && that.loginForm.password=='smartlight@0701'){
                sessionStorage.setItem("username",that.loginForm.username)
                this.$message.success("登陆成功")
                window.location = '/'
            
            }else{
                this.$message.error("用户名或密码不正确")
            }
        },
        handleSkip(){
            let that = this;
            if(that.loginForm.username=='guest'&&that.loginForm.password=='smartlight@000'){
                sessionStorage.setItem("username","guestMode")
                this.$message.success("登陆成功")
                window.location = '/'
            }else{
                this.$message.error("用户名或密码不正确")
            }
            
        }
    }
  };
  </script>
  
  <style scoped>
    * {
        margin: 0;
        padding: 0;
    }
    .login-container{
        width:100%;
        height:100%;
    
    }

    .login {
        width: 358px;
        height: 588px;
        border-radius: 15px;
        padding: 0 50px;
        position: relative;
        left: 50%;
        top: 400px;
        transform: translate(-50%, -50%);
        background-color: #282c34;
    }
    .header {
        font-size: 38px;
        font-weight: bold;
        text-align: center;
        line-height: 200px;
        color: #61dafb;
    }
    .container {
        height: 30px;
        width: 250px;
        position: absolute;
        left: 50%;
        top: 40%;
        transform: translate(-50%, -50%);
    }

    input {
        width: 100%;
        height: 100%;
        position: relative;
        outline: none;
        border: none;
        box-sizing: border-box;
        padding-left: 5px;
        background-color: #282c34;
        color: #61dafb;
        caret-color: #61dafb;
    }
    input::placeholder {
        color: #61dafb;
    }

    span {
        position: absolute;
        content: "";
        display: block;
        background-color: #61dafb;
        transition: transform .1s ease-in-out;
    }
    .top,
    .bottom {
        left: 0px;
        right: 0px;
        height: 2px;
    }
    .left,
    .right {
        top: 0px;
        bottom: 0px;
        width: 2px;
        transform: scaleY(0);
    }
    .top {
        top: 0px;
        transform: scaleX(0);
        transform-origin: left center;
        transition-delay: .2s;
    }
    .left {
        left: 0px;
        transform-origin: bottom center;
        transition-delay: .3s;
    }
    .bottom {
        bottom: 0px;
    }
    .right {
        right: 0px;
        transform-origin: top center;
        transition-delay: .1s;
    }
    input:focus ~ .right {
        transform: scaleY(1);
        transform-origin: bottom center;
    }
    input:focus ~ .left {
        transform: scaleY(1);
        transform-origin: top center;
    }
    input:focus ~ .top {
        transform: scaleY(1);
        transform-origin: right center;
    }
    .container1 {
        height: 30px;
        width: 250px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    
    .btn{
        top: 54%;

    }
    .btn,.btn_skip {
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        padding: 5px;
        width: 52%;
        margin-top: 40px;
        background-color: #61dafb;
        color: #fff;
        cursor: pointer;
    }
    .btn:hover,.btn_skip:hover{
        opacity: 0.8;
    }
    .btn:active,.btn_skip:active{
        opacity: 0.4;
    }
    .btn_skip{
        top: 62%;
    }
</style>