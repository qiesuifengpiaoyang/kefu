<template>
  <div class="box">
    <div class="inpBox">
      <h1>登录</h1>
      <input type="text" v-model="account" placeholder="请输入您的账号" />
      <input type="password" v-model="password" placeholder="请输入您的密码" />
      <button @click="registerBtn">登录</button>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import qs from "qs";
import axios from "@/tool/axios.js";
import { apiDomain } from "@/tool/path.js";

export default {
  data() {
    return {
      text: "",
      account: "",
      password: "",
      js: 1,
    };
  },
  created() {
    document.title = "登录";
  },
  methods: {
    registerBtn() {
      if (!this.js) {
        this.$toast("请稍后再试");
        return;
      }
      this.js = 0;
      setTimeout(() => {
        this.js = 1;
      }, 1500);
      if (!this.account || !this.password) {
        this.$toast("账号密码不能为空");
        return;
      }
      const toast1 = this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      let date = new Date();
      let h = date.getHours();
      let i = date.getMinutes();
      if (h < 10) {
        h = "0" + h;
      }
      if (i < 10) {
        i = "0" + i;
      }
      axios
        .post(
          `${apiDomain}/login`,
          qs.stringify({
            accept: this.account,
            pwd: this.password,
            code: "txt" + h + i,
          })
        )
        .then((res) => {
          toast1.clear();
          if (res.data.status != 1) {
            this.$toast(`${res.data.msg}`);
            return;
          }
          sessionStorage.setItem("id", res.data.data.id);
          // sessionStorage.setItem('online', res.data.data.online);//客服在线状态
          // sessionStorage.setItem('create_time', res.data.data.create_time);//客服账号创建时间
          sessionStorage.setItem("identity", res.data.data.identity); //客服身份1管理员2客服
          sessionStorage.setItem("token", res.data.data.token);
          sessionStorage.setItem("type_id", res.data.data.type_id); //客户类型
          sessionStorage.setItem("username", res.data.data.username);
          if (!!this.$route.query && this.$route.query.redirect) {
            this.$router.replace(this.$route.query.redirect);
          } else {
            // this.$router.push("/service");
            this.$router.push("/kefu");
          }
        });
      //
    },
  },
  setup() {
    const active = ref(0);
    return { active };
  },
};
</script>
<style lang='scss' scoped>
.box {
  background-color: #fbbb5f;
  // font-size: 0.4rem;
  font-size: 0.24rem;
  width: 100%;
  min-height: 100vh;
  & > .inpBox {
    display: flex;
    flex-direction: column;
    padding: 30px;
    & > h1 {
      text-align: center;
      line-height: 300%;
      // padding-top: 15%;
      // padding-bottom: 30px;
    }
    input {
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 20px;
      border-left: 3px solid rgb(81, 255, 0);
    }
    button {
      padding: 10px;
      margin-top: 30px;
      background-color: #35bffd;
      border: none;
      border-radius: 10px;
      font-size: 0.3rem;
    }
  }
}
@media screen and (min-width: 1200px) {
  /*当屏幕尺寸小于600px时，应用下面的CSS样式*/
  .box {
    background-color: #f5f5f5;
    position: relative;
    font-size: 0.18rem;
    padding-top: 200px;
    .inpBox {
      background-color: #fff;
      width: 500px;
      border: 1px solid #999;
      margin: 0 auto;
      border-radius: 15px;
      // padding-top: 100px;
      // position: absolute;
      // top: 30%;
      // left: 50%;
      // transform: translate(-50%, -50%);
      h1 {
        font-size: 0.3rem;
      }
      button {
        padding: 10px;
        color: #fff;
        background-color: #fbbb5f;
        font-size: 0.2rem;
      }
    }
  }
}
</style>