<template>
  <div>
    <div class="box home-wrapper" ref="content" v-if="!historys">
      <div class="headline">
        <span>聊天室</span>
        <span class="me" @click="returnBtn">👈</span>
        <span class="history" @click="toHistoryBtn">历</span>
      </div>
      <div v-if="!type" class="choose">
        <div>
          <p>请选择咨询类型</p>
          <button @click="type = 1">互帮类</button>
          <button @click="type = 2">市场类</button>
          <button @click="type = 3">电销类</button>
        </div>
      </div>

      <div v-else>
        <!-- <p v-if="!linkStatus" class="notAvailableC">{{hint}}</p> -->
        <ul class="chatBox">
          <li
            v-for="(item, index) in chatList"
            :key="index"
            :class="[item.identity == 1 ? 'service' : 'user']"
          >
            <!-- identity为'1'表示客服,否则为用户 -->
            <template v-if="item.identity == 1 && item.content">
              <img class="portrait" src="../assets/logo.png" alt="" />
              <div class="service-content contentBox">
                <p class="urseName">{{ item.username }}</p>
                <div class="content">
                  {{ item.content }}
                </div>
              </div>
            </template>
            <template v-else>
              <img class="portrait" src="../assets/logo.png" alt="" />
              <div class="user-content contentBox">
                <p>{{ item.username }}</p>
                <div class="content">
                  {{ item.content }}
                </div>
              </div>
            </template>
          </li>
        </ul>
        <div class="inpBox">
          <div class="inp">
            <input type="text" v-model="text" @keyup.enter="sendBtn" />
          </div>
          <button @click="sendBtn">发送</button>
        </div>
        <!-- <div class="inpBox">
        <div class="inp">
          <van-field class="asd" v-model="text" />
        </div>
        <button @click="sendBtn">发送</button>
      </div> -->
      </div>
    </div>
    <ul class="historysBox" v-else>
      <p>
        <span @click="historys = !historys">👈</span>
        <span>历史记录</span>
      </p>
      <ul class="historysBox-chatBox">
        <p class="historysBox-none" v-show="!historyList.length">
          当前没有历史信息^_^
        </p>
        <!-- noneSH -->
        <li
          v-for="(item, index) in historyList"
          :key="'history' + index"
          :class="
            item.identity == 1 ? 'historysBox-service' : 'historysBox-user'
          "
        >
          <!-- identity为1表示客服；2表示用户 -->
          <template v-if="item.identity == 1">
            <!-- 头像 -->
            <img class="historysBox-portrait" src="../assets/logo.png" alt="" />
            <!-- 聊天信息 -->
            <div class="historysBox-service-content historysBox-contentBox">
              <p class="historysBox-urseName">{{ item.username }}</p>
              <div class="historysBox-content">
                {{ item.content }}
              </div>
            </div>
          </template>
          <template v-else>
            <!-- 头像 -->
            <img class="historysBox-portrait" src="../assets/logo.png" alt="" />
            <!-- <img :src="item.img" alt="" /> -->
            <!-- 聊天信息 -->
            <div class="historysBox-user-content historysBox-contentBox">
              <p>{{ item.username }}</p>
              <div class="historysBox-content">
                {{ item.content }}
              </div>
            </div>
          </template>
        </li>
      </ul>
    </ul>
    <p v-if="!linkStatus" class="linkStatusC">{{ hint }}</p>
  </div>
</template>
<script>
import qs from "qs";
import { wsuri } from "@/tool/path.js";
import axios from "@/tool/axios.js";
import { apiDomain } from "@/tool/path.js";
import { Dialog } from "vant";
import { Toast } from "vant";
// onMounted
import { onUnmounted, ref, reactive, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
export default {
  watch: {
    chatList: {
      handler(n) {
        setTimeout(function () {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
        }, 150);
      },
      deep: true,
    },
    type: {
      handler() {
        this.open();
      },
      deep: true,
    },
  },
  setup() {
    const router = useRouter();
    const { ctx,proxy } = getCurrentInstance();
    /**
     * 获取当前路由信息
     * ctx只能本地开发使用——打包后这东西会显示undefined
     * proxy打包后得使用这个
     * * 额~【proxy】实际上这东西本地也可以
     * * 目前只知道【ctx】只能本地使用
     * * 不清楚别的方面
     */
    let uid = ref(proxy.$router.currentRoute.value.params.uid);
    let username = ref(proxy.$router.currentRoute.value.params.username);
    let mobile = ref(proxy.$router.currentRoute.value.params.mobile);
    let datas = reactive({}); //传参
    let lockReconnect = ref(false); //是否真正建立连接
    let timeout = ref(5000); //28 * 1000——30秒一次心跳
    let timeoutObj = reactive(null); //心跳心跳倒计时
    let serverTimeoutObj = reactive(null); //心跳倒计时
    let timeoutnum = reactive(null); //断开 重连倒计时
    let type = ref(0); //类型的选择
    let linkStatus = ref(true); //连接状态
    let hint = ref(""); //异常的提示信息
    let historys = ref(false); //历史记录的状态
    let chatList = reactive([]); //聊天信息数组
    let text = ref(""); //输入框编辑的消息
    let ws = reactive(null); //创建连接
    
    
    let toast1 = reactive(null);
    //历史记录
    let historyList = reactive([]); //历史记录信息
    // let type_id = ref(ctx.$router.currentRoute.value.params.type_id);

    onUnmounted(() => {
      quit();
    });
    function quit() {
      let data = {
        type: "offline",
        id: uid.value,
      };
      // console.log(JSON.stringify(data), "退出时传参");
      ws.send(JSON.stringify(data));
      toast1.clear();
      //清除时间
      clearTimeout(timeoutObj);
      clearTimeout(serverTimeoutObj);
      clearTimeout(timeoutnum);
      lockReconnect.value = true;
      // console.log(lockReconnect.value);
      ws.close();
    }
    // onMounted(() => {
    //   setTimeout(function () {
    //     if (
    //       document.body.scrollHeight >
    //       document.documentElement.clientHeight - 55
    //     ) {
    //       window.scrollTo({
    //         top: document.body.scrollHeight,
    //         // behavior: "smooth",//平滑滚动，默认是瞬时滚动
    //       });
    //     }
    //   }, 100);
    // });
    //判断进来的时候信息是否齐全——uid、用户名、手机号
    if (!uid.value || !username.value || !mobile.value) {
      Toast("缺少用户信息，请重试");
      return;
    }
    //查询是否繁忙
    axios.get(`${apiDomain}/onlineQuantity`).then((res) => {
      if (res.data.status != 1) {
        Toast(`${res.msg}`);
        return;
      }
    });

    function open() {
      toast1 = Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      initWebpack();
    }

    //返回
    function returnBtn() {
      // router.go(-1);
      // clearTimeout(timeoutObj);
      // clearTimeout(serverTimeoutObj);
      // clearTimeout(timeoutnum);
      // lockReconnect.value = true;
      // console.log(lockReconnect.value);
      // ws.close();

      quit();
    }

    //创建连接
    function initWebpack() {
      // console.log("websocket初始化");
      ws = new WebSocket(wsuri); // 此处配置websocket地址
      ws.onopen = onopen; //连接成功
      ws.onmessage = onmessage; //接收数据
      ws.onclose = onclose; //连接断开
      ws.onerror = onerror; //连接错误
    }
    //连接成功
    function onopen() {
      //连接成功事件
      toast1.clear();
      linkStatus.value = true; //连接状态
      // let user_login_user_login = reactive({
      //   type: "user_login",
      //   uid: uid,
      //   content: text.value,
      //   type_id: type.value,
      //   username: username,
      //   mobile: mobile,
      // })
      let login_msg = {
        type: "user_login",
        uid: uid.value,
        content: text.value,
        type_id: type.value,
        username: username.value,
        mobile: mobile.value,
      };
      // console.log("WebSocket连接成功", JSON.stringify(login_msg), "传参");
      ws.send(JSON.stringify(login_msg));
      if (JSON.stringify(datas) != "{}") {
        //防止在访问历史记录的时候断开连接
        toHistoryBtn();
      }
      //开启心跳
      start();
    }
    //接收数据
    function onmessage(e) {
      console.log(JSON.parse(e.data), "接收");
      let res = JSON.parse(e.data);
      let { status, data, type, msg } = res;
      if (status != 1) {
        // Toast(`当前无客服在线，请稍后重试`);
        linkStatus.value = false; //连接状态
        hint.value = `${msg}`;
        Toast(`${msg}`);
        return;
      }
      linkStatus.value = true; //连接状态
      if (type === "read_record") {
        for (const item of data) {
          historyList.push(item);
        }
        return;
      }
      if (!data.hasOwnProperty("content")) {
        return;
      }
      chatList.push(data);
      //收到服务器信息，心跳重置
      reset();
    }
    //连接断开
    function onclose(e) {
      console.log("websocket 断开: ", e);
      //重连
      reconnect();
    }
    //连接错误
    function onerror(e) {
      toast1.clear();
      linkStatus.value = false; //连接状态
      hint.value = `连接错误`;
      console.log("连接错误", e);
      reconnect();
    }
    //重新连接
    function reconnect() {
      console.log("重连", lockReconnect.value);
      if (lockReconnect.value) {
        return;
      }
      lockReconnect.value = true;
      //没连接上会一直重连，设置延迟避免请求过多
      timeoutnum && clearTimeout(timeoutnum);
      // clearTimeout(timeoutnum);
      timeoutnum = setTimeout(() => {
        //新连接
        initWebpack();
        lockReconnect.value = false;
      }, 5000);
    }
    //重置心跳
    function reset() {
      //清除时间
      clearTimeout(timeoutObj);
      clearTimeout(serverTimeoutObj);
      //重启心跳
      start();
    }
    //开启心跳
    function start() {
      timeoutObj && clearTimeout(timeoutObj);
      serverTimeoutObj && clearTimeout(serverTimeoutObj);
      timeoutObj = setInterval(() => {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (ws.readyState == 1) {
          //如果连接正常
          // let data = {
          //   type: "heartbeat",
          // };
          // console.log(JSON.stringify(data), "心跳传参");
          let login_msg = {
            // type: "user_login",
            // uid: uid.value,
            type: "user_login",
            uid: uid.value,
            content: text.value,
            type_id: type.value,
            username: username.value,
            mobile: mobile.value,
          };
          // console.log(JSON.stringify(login_msg), "心跳传参——改");
          ws.send(JSON.stringify(login_msg));
        } else {
          //否则重连
          reconnect();
        }
        serverTimeoutObj = setTimeout(function () {
          //超时关闭
          // ws.close();
        }, timeout.value);
      }, timeout.value);
    }

    //发送消息
    function sendBtn() {
      text.value = text.value.replace(/(^\s*)|(\s*$)/g, "");
      if (!text.value) {
        Toast("发送内容不能为空");
        return;
      }
      if (text.value.length >= 180) {
        Toast("每次发送消息不得超过180个字符");
        return;
      }
      // if (!type.value) {
      //   Toast("请选择需要咨询的类型");
      //   return;
      // }
      let data = {
        type: "send_msg",
        uid: uid.value,
        content: text.value,
      };
      text.value = "";
      // console.log(JSON.stringify(data), "发送消息传参");
      ws.send(JSON.stringify(data));
      //滚动页面
      setTimeout(function () {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 150);
    }

    //获取历史记录
    function toHistoryBtn() {
      historys.value = true;
      // let data = {
      //   type: "read_record",
      //   type_id: type.value,
      //   uid: uid.value,
      // };
      datas = {
        type: "read_record",
        type_id: type.value,
        uid: uid.value,
      };
      // console.log(JSON.stringify(datas), "历史记录传参");
      ws.send(JSON.stringify(datas));
    }

    return {
      type,
      chatList,
      text,
      open,
      returnBtn,
      sendBtn,
      uid,
      toHistoryBtn, //历史记录
      historys, //状态
      historyList, //历史聊天记录
      linkStatus, //连接状态
      hint, //异常的提示信息
    };
  },
  methods: {
    // toHistoryBtn() {
    //   if (!this.type) {
    //     return;
    //   }
    //   this.$router.push({
    //     name: "history",
    //     params: { uid: this.uid, type_id: this.type },
    //   });
    // },
  },
};
</script>
<style lang='scss' scoped>
$gauge: 55px; //聊天信息盒子向左（右）的margin
$headGauge: 15px; //聊天信息盒子与头像的距离
$headImg: 40px; //头像的宽高

.box {
  min-height: 100vh;
  background-color: #f4f4f4;
  //   background-color: #fbbb5f;
  font-size: 0.24rem;
  text-align: left;
  .headline {
    position: fixed;
    top: 0;
    width: 100vw;
    font-size: 0.3rem;
    background-color: #e48e0b;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #fff;
    .me {
      position: absolute;
      padding: 0 5px;
      left: 10px;
      //   font-size: 0.4rem;
    }
    //管理图标
    .adm {
      position: absolute;
      right: 35px;
      padding: 0 5px;
      //   font-size: 0.4rem;
    }
    //历史记录
    .history {
      position: absolute;
      right: 10px;
      padding: 0 5px;
    }
  }
  .choose {
    position: fixed;
    width: 100vw;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.1);
    & > div {
      width: 80%;
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 20px;
      background-color: #fff;
      border-radius: 15px;
      p {
        text-align: center;
        font-size: 0.3rem;
      }
      & > button {
        margin-top: 10px;
        padding: 5px 0;
        border-radius: 8px;
      }
    }
  }

  .chatBox {
    padding: 0.2rem;
    padding-top: 50px;
    width: 100%;
    & > li {
      display: flex;
      margin-top: 0.3rem;
      word-break: break-word;
      &:last-child {
        margin-bottom: 55px;
      }
    }
    //头像.img
    .portrait {
      width: $headImg;
      height: $headImg;
      border: 1px solid yellowgreen;
      border-radius: 5px;
    }
    //聊天信息-公共
    .contentBox {
      //   flex-grow: 1;
      .content {
        background-color: #fff;
        padding: 8px;
        margin-top: 5px;
        border-radius: 5px;
      }
    }
    //客服
    .service {
      flex-direction: row;
      margin-right: $gauge;
      //聊天
      .service-content {
        margin-left: $headGauge;
      }
    }
    //用户
    .user {
      flex-direction: row-reverse;
      margin-left: $gauge;
      text-align: right;
      //聊天
      .user-content {
        margin-right: $headGauge;
        .content {
          text-align: left;
        }
      }
    }
  }
  //输入框盒子
  //   .inpBox {
  //     width: 100%;
  //     position: fixed;
  //     bottom: 0;
  //     padding: 10px;
  //     justify-content: space-between;
  //     background-color: #fff;
  //     display: flex;
  //     .inp {
  //       width: 80vw;
  //     }
  //     .van-cell {
  //       padding: 5px 10px;
  //       background-color: #f7f7f7f7;
  //     }
  //     & > button {
  //       margin-left: 5px;
  //       flex-grow: 1;
  //       background-color: #fbbb5f;
  //     }
  //   }
  //输入框盒子
  .inpBox {
    width: 100vw;
    position: fixed;
    bottom: 0;
    padding: 10px;
    justify-content: space-between;
    background-color: #fff;
    display: flex;
    .inp {
      width: 80%;
      input {
        width: 100%;
        padding: 5px 10px;
        background-color: #f7f7f7f7;
        border: none;
        overflow: hidden;
        color: #323233;
        font-size: 14px;
        line-height: 24px;
      }
    }
    .van-cell {
      padding: 5px 10px;
      background-color: #f7f7f7f7;
    }
    & > button {
      margin-left: 5px;
      flex-grow: 1;
      background-color: #fbbb5f;
      border: none;
    }
  }
}
//历史记录
.historysBox {
  // min-height: 100vh;
  min-height: calc(100vh - 50px);
  // height: 100vh;
  background-color: #f4f4f4;
  font-size: 0.24rem;
  text-align: left;
  & > p {
    position: fixed;
    top: 0;
    width: 100vw;
    font-size: 0.3rem;
    background-color: #e48e0b;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #fff;
    & > span:nth-child(1) {
      position: absolute;
      left: 5px;
    }
  }
  .historysBox-chatBox {
    padding: 0.2rem;
    width: 100%;
    margin-top: 50px;
    & > .none {
      text-align: center;
    }
    & > li {
      display: flex;
      margin-top: 0.3rem;
      word-break: break-word;
      &:last-child {
        margin-bottom: 55px;
      }
    }
    //头像.img
    .historysBox-portrait {
      width: $headImg;
      height: $headImg;
      border: 1px solid yellowgreen;
      border-radius: 5px;
    }
    //聊天信息-公共
    .historysBox-contentBox {
      //   flex-grow: 1;
      .historysBox-content {
        background-color: #fff;
        padding: 8px;
        margin-top: 5px;
        border-radius: 5px;
      }
    }
    //客服
    .historysBox-service {
      flex-direction: row;
      margin-right: $gauge;
      //聊天
      .historysBox-service-content {
        margin-left: $headGauge;
      }
    }
    //用户
    .historysBox-user {
      flex-direction: row-reverse;
      margin-left: $gauge;
      text-align: right;
      //聊天
      .historysBox-user-content {
        margin-right: $headGauge;
        .historysBox-content {
          text-align: left;
        }
      }
    }
  }
}
.linkStatusC {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
}
</style>