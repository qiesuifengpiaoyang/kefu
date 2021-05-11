<template>
  <div>
    <!-- 在线访客 -->
    <div class="service-box" v-if="zt == 1">
      <div class="service-headline">
        <span>{{ title }}</span>
        <span v-if="service_SH" class="service-me" @click="service_adminBtn"
          >管</span
        >
        <span v-else class="service-me" @click="service_quitBtn">关</span>
      </div>
      <div class="service-memberBox">
        <br />
        <!-- 在线访客 -->
        <ul>
          <li
            @click="toChatRoomBtn(item.id)"
            v-for="(item, index) in service_visitor"
            :key="'service_visitor' + index"
          >
            <span>{{ item.username }}</span>
            <span
              v-show="messageNotification.indexOf(item.id) != -1"
              class="service-unread"
            >
              未
            </span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 聊天室 -->
    <div class="chatBoxB" v-if="zt == 2">
      <div class="chatBox-headline">
        <span>聊天室</span>
        <span class="chatBox-me" @click="returnBtn"> 《 </span>
        <span class="chatBox-adm" @click="managementSH = !managementSH"
          >管</span
        >
        <!-- <span class="history" @click="toHistoryBtn">历</span> -->
      </div>
      <ul class="chatBox">
        <li
          v-for="(item, index) in chatList"
          :key="index"
          :class="item.identity == 1 ? 'chatBox-service' : 'chatBox-user'"
        >
          <!-- type为'reply_msg'表示客服；2表示用户 -->
          <template v-if="item.identity == 1">
            <!-- 头像 -->
            <img class="chatBox-portrait" src="../assets/logo.png" alt="" />
            <!-- 聊天信息 -->
            <div class="chatBox-service-content chatBox-contentBox">
              <p class="chatBox-urseName">
                {{ item.username === null ? "客服" : item.username }}
              </p>
              <!-- <p class="urseName">客服</p> -->
              <div class="chatBox-content">
                {{ item.content }}
              </div>
            </div>
          </template>
          <!-- <template v-else> -->
          <template v-if="(item.id == uid || item.uid == uid) && item.identity !== 1">
            <!-- 头像 -->
            <img class="chatBox-portrait" src="../assets/logo.png" alt="" />
            <div class="chatBox-user-content chatBox-contentBox">
              <p class="chatBox-urseName">{{ item.username }}</p>
              <div class="chatBox-content">
                {{ item.content }}
              </div>
            </div>
          </template>
        </li>
      </ul>
      <!-- 用户管理 -->
      <!-- <div class="chatBox-managementBox" v-show="managementSH">
      <div class="chatBox-management">
        <p>
          <span>转移访客</span>
          <span @click="managementSH = !managementSH">×</span>
        </p>
        <select v-model="type">
          <option value="">-请选择转移的类型-</option>
          <option
            v-for="(item, index) in classify"
            :key="'classify' + index"
            :value="index"
          >
            {{ item }}
          </option>
        </select>
        <button @click="transferBtn">确定</button>
      </div>
    </div> -->
      <!-- 下方输入框 -->
      <div class="chatBox-inpBox">
        <div class="chatBox-inp">
          <input type="chatBox-text" v-model="text" @keyup.enter="sendBtn" />
        </div>
        <button @click="sendBtn">发送</button>
      </div>
    </div>

    <!-- 管理员 -->
    <div class="adminBox" v-if="zt == 3">
      <div class="adminBox-headline">
        <span>管理</span>
        <span class="adminBox-me" @click="adminReturnBtn"> 《 </span>
      </div>
      <ul class="adminBox-shortcut">
        <li v-for="(item, index) in list" :key="index" @click="cjBtn(index)">
          <span>^_^</span>
          <span>{{ item }}</span>
          <span>></span>
        </li>
      </ul>
      <!-- 账号管理 -->
      <ul class="adminBox-accountList">
        <p>账号管理</p>
        <li
          v-for="(item, index) in accountList"
          :key="'accountList' + index"
          @click="accountAdmBtn(index)"
        >
          <span>{{ item.username }}</span>
          <span
            :class="item.online ? 'adminBox-online' : 'adminBox-offline'"
          ></span>
        </li>
      </ul>
      <button @click="quitBtn">退出登录</button>
      <!-- 创建部门 -->
      <div class="adminBox-departmentBox" v-if="departmentSH">
        <div class="adminBox-department">
          <p>
            创建部门
            <!-- <span @click="departmentSH = !departmentSH">×</span> -->
            <span @click="closeBtn">×</span>
          </p>
          <div>
            <p>部门名称：</p>
            <input type="text" v-model="name" placeholder="部门名称" />
            <p>部门描述：</p>
            <input type="text" v-model="describe" placeholder="部门描述" />
          </div>
          <button @click="confirmBtn">确定</button>
        </div>
      </div>
      <!-- 创建账号 -->
      <div class="adminBox-departmentBox" v-if="accountSH">
        <div class="adminBox-department">
          <p>
            创建账号
            <!-- <span @click="accountSH = !accountSH">×</span> -->
            <span @click="closeBtn">×</span>
          </p>
          <div>
            <p>账号：</p>
            <input type="text" v-model="account" placeholder="账号" />
            <p>密码：</p>
            <input type="text" v-model="password" placeholder="密码" />
          </div>
          <button @click="confirmBtn">确定</button>
        </div>
      </div>
      <!-- 账号管理 -->
      <div class="adminBox-departmentBox" v-if="accountListSH">
        <div class="adminBox-department">
          <p>
            修改账号信息
            <!-- <span @click="accountListSH = !accountListSH">×</span> -->
            <span @click="closeBtn">×</span>
          </p>
          <div>
            <p>账号：</p>
            <input type="text" v-model="serviceAccount" placeholder="账号" />
            <p>新密码：</p>
            <input type="text" v-model="newPassword" placeholder="新密码" />
            <p>旧密码：</p>
            <input type="text" v-model="oldPassword" placeholder="旧密码" />
          </div>
          <button @click="ascertainBtn">确定</button>
        </div>
      </div>
    </div>
    <p v-if="!linkStatus" class="linkStatusC">{{ hint }}</p>
  </div>
</template>
<script>
import qs from "qs";
import axios from "@/tool/axios.js";
import { apiDomain, wsuri } from "@/tool/path.js";
import { Dialog } from "vant";
import { onUnmounted, ref, reactive, onUpdated } from "vue";
import { useRouter } from "vue-router";
import { Toast } from "vant";
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
  },
  setup() {
    onUnmounted(() => {
      // quit();
      let data = {
        type: "offline",
        id: aid.value,
      };
      console.log(JSON.stringify(data), "退出时传参");
      ws.send(JSON.stringify(data));
      toast1.clear();
      //清除时间
      clearTimeout(timeoutObj);
      clearTimeout(serverTimeoutObj);
      clearTimeout(timeoutnum);
      lockReconnect.value = true;
      // console.log(lockReconnect.value);
      ws.close();
    });
    const router = useRouter();
    let toast1 = reactive(null); //
    let toast2 = reactive(null); //
    let toast3 = reactive(null); //
    let linkStatus = ref(true); //连接状态
    let hint = ref(""); //异常的提示信息
    //用户列表
    let service_SH = ref(false); //管理员还是普通客服
    let zt = ref(1); //管理页面状态,1用户列表2聊天室3管理界面
    let title = ref("在线访客"); //标题
    let service_visitor = reactive([]); //在线的访客列表
    // let ls = reactive([]); //临时的
    let messageNotification = reactive([]); //消息通知
    //聊天室
    let chatList = reactive([]); //聊天信息数组
    let text = ref(""); //输入框编辑的消息
    let aid = ref(sessionStorage.getItem("id")); //管理员
    let type_id = ref(sessionStorage.getItem("type_id")); //客服类型
    let uid = ref(0);
    let classify = ["电销类", "互帮类", "市场类"]; //分类
    let managementSH = ref(false);
    //管理
    let list = reactive(["创建部门", "创建账号"]); //创建的类型
    let accountList = reactive([]); //所有的客服账号
    let serviceAccount = ref(""); //客服账号
    let newPassword = ref(""); //客服输入的的新密码
    let oldPassword = ref(""); //客服输入的旧密码
    let accountListSH = ref(false); //【账号管理】
    let departmentSH = ref(false); //【创建部门】
    let accountSH = ref(false); //【创建账号】
    let account = ref(""); //创建的账号
    let password = ref(""); //创建的账号的密码
    let name = ref(""); //部门名称
    let describe = ref(""); //部门描述
    let index = ref(0); //创建的索引

    // let identity2 = reactive([]); //用户列表时用户发送的数据
    toast1 = Toast.loading({
      message: "加载中...",
      forbidClick: true,
      duration: 0,
    });
    let ws = reactive(null);
    let lockReconnect = ref(false); //是否真正建立连接
    let timeoutObj = reactive(null); //心跳心跳倒计时
    let readyState = ref(1); //
    let timeout = ref(5000); //28 * 1000  ——30秒一次心跳
    let serverTimeoutObj = reactive(null); //心跳超时定时器
    let timeoutnum = reactive(null); //断开 重连倒计时

    if (sessionStorage.getItem("identity") == 1) {
      service_SH.value = true;
    }

    initWebpack();
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
      // console.log("WebSocket连接成功");
      //管理员登录
      let login_msg = {
        type: "admin_login",
        aid: aid.value,
      };
      // console.log(JSON.stringify(login_msg), "连接成功时传参客服身份");
      ws.send(JSON.stringify(login_msg));
      // //开启心跳
      start();
    }
    //接收数据
    function onmessage(e) {
      //收到服务器信息，心跳重置
      reset();
      let res = JSON.parse(e.data);
      // console.log(res, "接收");

      let { status, data, type, msg } = res;
      if (status != 1) {
        linkStatus.value = false; //连接状态
        hint.value = `${msg}`;
        Toast(`${msg}`);
        return;
      }
      linkStatus.value = true;
      if (zt.value != 2 && type === "send_msg") {
        // console.log(data.id, "有人来消息了");
        if (messageNotification.indexOf(data.id) === -1) {
          messageNotification.push(data.id);
        }
      }
      //在线访客
      if (type === "user_status_update") {
        console.log(data, "在线访客");
        // if (!data.length) {
        //   linkStatus.value = false; //连接状态
        //   hint.value = `当前已经掉线`;
        // } else {
        //   linkStatus.value = true; //连接状态
        //   service_visitor.splice(0, service_visitor.length);
        //   for (const item of data) {
        //     service_visitor.push(item);
        //   }
        // }
        service_visitor.splice(0, service_visitor.length);
        for (const item of data) {
          service_visitor.push(item);
        }
        return;
      }
      //客服不在聊天室时接收到的消息
      // if (data.identity == 2 && zt.value != 2) {
      //   // chatList.push(data);
      //   identity2.push(data);
      //   return;
      // }
      //客服回复的消息&&用户发送的消息
      // chatList.push(data);
      console.log(data, "其他情况", type);
      if (Array.isArray(data)) {
        for (const items of data) {
          chatList.push(items);
        }
      } else {
        chatList.push(data);
      }
      // //收到服务器信息，心跳重置
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
        if (readyState.value == 1) {
          //如果连接正常
          // let data = { type: "heartbeat" };
          // console.log(JSON.stringify(data), "心跳传参");
          //心跳——改
          let login_msg = {
            type: "admin_login",
            aid: aid.value,
          };
          console.log(JSON.stringify(login_msg), "心跳传参——改");
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
    // //获取用户列表
    // function userList() {
    //   let data = {
    //     type: "user_status_update",
    //     aid: aid.value,
    //   };
    //   ws.send(JSON.stringify(data));
    // }

    //进入聊天室
    function toChatRoomBtn(id) {
      // console.log(id, "这是ID，进入聊天室");
      zt.value = 2; //更改状态
      title.value = "聊天室";
      uid.value = id;
      console.log("id:", id, "uid:", uid);
      // console.log(messageNotification.indexOf(id), "下标");
      messageNotification.splice(messageNotification.indexOf(id), 1);
      // console.log(messageNotification, "删除之后的messageNotification");
      chatList.splice(0, chatList.length);
      let data = {
        type: "read_record",
        type_id: type_id.value,
        uid: uid.value,
      };
      console.log(
        JSON.stringify(data),
        "进入聊天室的时候获取用户的历史信息传参"
      );
      ws.send(JSON.stringify(data));
      // for (const item of identity2) {
      //   if (item.id == id) {
      //     console.log(item, "用户在此之前发送的消息");
      //     chatList.push(item);
      //   }
      // }
    }
    //发送消息
    function sendBtn() {
      text.value = text.value.replace(/(^\s*)|(\s*$)/g, "");
      if (!text.value) {
        Toast("发言不能为空");
        return;
      }
      if (text.value.length >= 180) {
        Toast("每次发送消息不得超过180个字符");
        return;
      }
      let data = {
        type: "reply_msg",
        aid: aid.value,
        content: text.value,
        uid: uid.value,
      };
      text.value = "";
      console.log(JSON.stringify(data), "发送消息传参");
      ws.send(JSON.stringify(data));
      //滚动页面
      setTimeout(function () {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 150);
    }
    //确认转移用户
    function transferBtn() {
      Toast("待开发");
    }
    //返回到用户列表
    function returnBtn() {
      zt.value = 1;
      title.value = "在线访客";
    }
    //普通客服的退出按钮
    function service_quitBtn() {
      Dialog.confirm({
        title: "是否确认退出登录！",
      })
        .then(() => {
          router.push("/"); //login
          window.sessionStorage.clear();
        })
        .catch(() => {
          // on cancel
        });
    }
    //管理员
    function service_adminBtn() {
      zt.value = 3; //更改状态
      title.value = "聊天室";
      toast3 = Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      axios.post(`${apiDomain}/admin`).then((res) => {
        toast3.clear();
        // console.log(res, "admin");
        // accountList = [].concat(res.data.data);
        for (const item of res.data.data) {
          accountList.push(item);
        }
      });
    }
    //创建
    function cjBtn(indexs) {
      Toast("等待后续开发");
      // index.value = indexs;
      // index.value ? (accountSH.value = true) : (departmentSH.value = true);
    }
    //确定创建
    function confirmBtn() {
      // console.log(index.value, "确定创建");
      if (index.value) {
        //创建账号
        if (!account.value || !password.value) {
          Toast("创建的账号密码不能为空");
          return;
        }
        account.value = "";
        password.value = "";
        accountSH.value = false;
      } else {
        //创建部门
        if (!name.value || !describe.value) {
          Toast("创建的部门名称及描述不能为空");
          return;
        }
        name.value = "";
        describe.value = "";
        departmentSH.value = false;
      }
    }
    //账号管理
    function accountAdmBtn(indexs) {
      // console.log(indexs, "账号管理");
      accountListSH.value = true;
      serviceAccount.value = accountList[indexs].username;
    }
    //修改账号信息——确定
    function ascertainBtn() {
      if (!serviceAccount.value || !newPassword.value || !oldPassword.value) {
        $toast("请认真填写信息");
        return;
      }
      const toast4 = Toast.loading({
        message: "修改中...",
        forbidClick: true,
        duration: 0,
      });
      axios
        .post(
          `${apiDomain}/accept`,
          qs.stringify({
            accept: serviceAccount.value,
            pwd: newPassword.value,
            old_pwd: oldPassword.value,
          })
        )
        .then((res) => {
          toast4.clear();
          Toast(`${res.data.msg}`);
          accountListSH.value = false;
          serviceAccount.value = "";
          newPassword.value = "";
          oldPassword.value = "";
        });
    }
    //关闭弹窗
    function closeBtn() {
      accountListSH.value = false;
      departmentSH.value = false;
      accountSH.value = false;

      serviceAccount.value = "";
      newPassword.value = "";
      oldPassword.value = "";
      account.value = "";
      password.value = "";
      name.value = "";
      describe.value = "";
    }
    // //关闭页面||退出登录
    // function quit() {
    //   let data = {
    //     type: "offline",
    //     id: aid.value,
    //   };
    //   console.log(JSON.stringify(data), "退出时传参");
    //   ws.send(JSON.stringify(data));
    //   toast1.clear();
    //   //清除时间
    //   clearTimeout(timeoutObj);
    //   clearTimeout(serverTimeoutObj);
    //   clearTimeout(timeoutnum);
    //   lockReconnect.value = true;
    //   console.log(lockReconnect.value);
    //   ws.close();
    // }
    //退出登录
    function quitBtn() {
      Dialog.confirm({
        title: "是否确认退出登录！",
      })
        .then(() => {
          router.push("/"); //login
          // quit();
          window.sessionStorage.clear();
        })
        .catch(() => {
          // on cancel
        });
    }
    //从【管理】返回到【在线访客】
    function adminReturnBtn() {
      zt.value = 1;
    }

    return {
      aid,
      linkStatus, //连接状态
      hint, //异常的提示信息
      service_SH, //管理员还是普通客服
      zt, //状态
      title, //标题
      service_quitBtn, //普通客服的退出按钮
      service_visitor, //在线访客列表
      messageNotification, //来消息的通知数组
      toChatRoomBtn, //进入聊天室
      managementSH, //管理用户
      transferBtn, //确认转移用户
      classify,
      uid, //用户的身份ID
      sendBtn, //聊天室中发送消息
      returnBtn, //返回到用户列表
      chatList, //聊天数组
      text, //输入框中的文字
      //管理员
      service_adminBtn, //管理员
      list, //
      cjBtn, //创建按钮
      confirmBtn, //确定创建
      accountAdmBtn, //账号管理
      ascertainBtn, //修改账号信息——确定
      quitBtn, //退出登录
      adminReturnBtn, //从【管理】返回到【在线访客】
      accountList, //所有的客服账号
      serviceAccount, //客服账号
      newPassword, //客服输入的的新密码
      oldPassword, //客服输入的旧密码
      accountListSH, //【账号管理】
      departmentSH, //【创建部门】
      accountSH, //【创建账号】
      account, //创建的账号
      password, //创建的账号的密码
      name, //部门名称
      describe, //部门描述
      index, //创建的索引
      closeBtn, //关闭弹窗
    };
  },
};
</script>
<style lang='scss' scoped>
$gauge: 55px; //聊天信息盒子向左（右）的margin
$headGauge: 15px; //聊天信息盒子与头像的距离
$headImg: 40px; //头像的宽高
//service——在线用户列表
.service-box {
  background-color: #fbbb5f;
  width: 100vw;
  // min-height: calc(100vh - 50px);
  min-height: 100vh;
  .service-headline {
    // position: fixed;
    // top: 0;
    width: 100vw;
    font-size: 0.3rem;
    background-color: #e48e0b;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #fff;
    .service-me {
      position: absolute;
      // width: 0.4rem;
      padding: 0 10px;
      right: 10px;
      font-size: 0.3rem;
    }
  }
  //成员
  .service-memberBox {
    width: 100vw;
    padding: 10px;
    font-size: 0.3rem;
    line-height: 0.3rem;
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    width: 100vw;
    // margin-top: 50px;
    .van-dropdown-menu {
      width: 100%;
    }
    /deep/.van-dropdown-menu__item,
    /deep/.van-dropdown-menu__bar,
    /deep/.van-dropdown-item__option {
      background-color: #fbbb5f;
    }
    /deep/.van-dropdown-item__option--active {
      background-color: #e2b069;
    }
    & > ul {
      flex-shrink: 0;
      & > li {
        padding: 0 8px;
        height: 0.7rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e2b069;
        color: #333;
        & > span:nth-child(1) {
          display: inline-block;
          width: 85%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        & > .service-unread {
          background-color: rgb(255, 73, 73);
          border-radius: 10px;
          padding: 5px;
          line-height: 0.2rem;
          color: #fff;
        }
      }
    }
  }
}
.chatBoxB {
  background-color: #f4f4f4;
  font-size: 0.24rem;
  width: 100vw;
  min-height: calc(100vh - 50px);
  .chatBox-headline {
    position: fixed;
    top: 0;
    width: 100vw;
    font-size: 0.3rem;
    background-color: #e48e0b;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #fff;
    .chatBox-me {
      position: absolute;
      padding: 0 5px;
      left: 10px;
      //   font-size: 0.4rem;
    }
    //管理图标
    .chatBox-adm {
      position: absolute;
      right: 35px;
      padding: 0 5px;
      //   font-size: 0.4rem;
    }
    //历史记录
    .chatBox-history {
      position: absolute;
      right: 10px;
      padding: 0 5px;
    }
  }
  .chatBox {
    padding: 0.2rem;
    width: 100%;
    margin-top: 50px;
    & > li {
      display: flex;
      // margin-top: 0.3rem;
      word-break: break-word;
      &:last-child {
        margin-bottom: 55px;
      }
    }
    //头像.img
    .chatBox-portrait {
      width: $headImg;
      height: $headImg;
      border: 1px solid yellowgreen;
      border-radius: 5px;
      margin-top: 0.3rem;
    }
    //聊天信息-公共
    .chatBox-contentBox {
      margin-top: 0.3rem;
      //   flex-grow: 1;
      .chatBox-content {
        background-color: #fff;
        padding: 8px;
        margin-top: 5px;
        border-radius: 5px;
      }
    }
    //客服
    .chatBox-service {
      flex-direction: row-reverse;
      text-align: right;
      margin-left: $gauge;
      //聊天
      .chatBox-service-content {
        margin-right: $headGauge;
        .chatBox-content {
          text-align: left;
        }
      }
    }
    //用户
    .chatBox-user {
      margin-right: $gauge;
      flex-direction: row;
      //聊天
      .chatBox-user-content {
        margin-left: $headGauge;
      }
    }
  }
  //用户管理
  .chatBox-managementBox {
    position: fixed;
    top: 50px;
    width: 100vw;
    height: 100vh;
    background-color: rgba($color: #000000, $alpha: 0.4);
    .chatBox-management {
      width: 80vw;
      background-color: #fff;
      padding: 20px;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      & > P {
        text-align: center;
        font-size: 0.4rem;
        line-height: 0.4rem;
        position: relative;
        & > span:nth-child(2) {
          position: absolute;
          right: -10px;
          top: -10px;
          padding: 3px;
        }
      }
      & > select {
        //   appearance:none;
        margin-top: 20px;
        padding: 8px;
      }
      & > button {
        padding: 10px;
        border-radius: 8px;
        margin-top: 30px;
        border: none;
        font-size: 0.3rem;
        color: #fff;
        background-color: #fb932b;
      }
    }
  }
  //输入框盒子
  .chatBox-inpBox {
    width: 100vw;
    position: fixed;
    bottom: 0;
    padding: 10px;
    justify-content: space-between;
    background-color: #fff;
    display: flex;
    .chatBox-inp {
      width: 80%;
      & > input {
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
//管理员
.adminBox {
  user-select: none;
  width: 100vw;
  min-height: calc(100vh);
  background-color: #fbbb5f;
  position: relative;
  .adminBox-headline {
    position: fixed;
    top: 0;
    width: 100vw;
    font-size: 0.3rem;
    background-color: #e48e0b;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #fff;
    .adminBox-me {
      position: absolute;
      width: 0.4rem;
      left: 10px;
      font-size: 0.3rem;
    }
  }
  .adminBox-shortcut {
    padding-top: 50px;
    color: #fff;
    width: 100vw;
    overflow: hidden;
    & > li {
      width: 100vw;
      background-color: #6b431c;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      & > span {
        flex-shrink: 0;
      }
      & > span:nth-child(2) {
        // flex-grow: 1;
        margin: 0 10px;
        width: 80vw;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  //账号列表
  .adminBox-accountList {
    color: #fff;
    width: 100vw;
    & > p {
      margin: 0.5rem 0 0.1rem;
      color: #000000;
      font-weight: bolder;
      font-size: 0.4rem;
      text-align: center;
    }
    & > li {
      border-bottom: 1px solid #f7c784;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      & > span:nth-child(1) {
        width: 90%;
        flex-shrink: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      & > span:nth-child(2) {
        flex-grow: 0;
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }
      & > .offline {
        background-color: rgb(182, 182, 182);
      }
      & > .online {
        background-color: yellowgreen;
      }
    }
  }
  //退出登录
  & > button {
    position: absolute;
    width: 80vw;
    margin: 0 10vw;
    bottom: 6vh;
    padding: 10px;
    border: none;
    background-color: #fb932b;
    color: #fff;
  }
  //创建部门
  .adminBox-departmentBox {
    position: fixed;
    top: 50px;
    width: 100vw;
    height: calc(100vh - 50px);
    background-color: rgba($color: #000000, $alpha: 0.4);
    .adminBox-department {
      position: absolute;
      padding: 20px;
      border-radius: 10px;
      background-color: #fff;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      & > div {
        position: relative;
        padding-top: 20px;
        & > p {
          line-height: 0.5rem;
          color: #000000;
        }
      }
      & input {
        width: 80vw;
        margin-bottom: 15px;
        padding: 10px;
        border-radius: 5px;
      }
      & > button {
        margin: 20px 0 0 0;
        border-radius: 10px;
        padding: 10px;
        border: none;
        background-color: #fb932b;
        color: #fff;
      }
      & > p {
        font-size: 0.5rem;
        line-height: 0.5rem;
        font-weight: bold;
        margin-bottom: 0.8rem;
        text-align: center;
        position: relative;
        & > span {
          font-weight: 100;
          width: 0.5rem;
          position: absolute;
          right: -5px;
          top: -10px;
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
  border-radius: 5px;
}

@media screen and (min-width: 1200px) {
  // service——在线用户列表
  .service-box {
    position: relative;
    width: 1200px;
    background-color: #fff;
    margin: 0 auto;
    position: relative;
    font-size: 0.18rem;
    .service-headline {
      position: relative;
      font-size: 0.18rem;
      width: 100%;
      background-color: #fff;
      color: #000;
      box-shadow: 0 2px 8px #ccc;
      & > .service-me {
        font-size: 0.15rem;
        &:hover {
          cursor: pointer;
          color: #333;
        }
      }
    }
    .service-memberBox {
      font-size: 0.16rem;
      width: 100%;
      & > ul {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        & > li {
          width: 48%;
          height: 0.5rem;
          border-bottom: 1px solid #d8d8d8;
          & > .service-unread {
            background-color: rgb(255, 73, 73);
            border-radius: 50%;
            width: 23px;
            height: 23px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            color: #fff;
          }
          &:hover {
            cursor: pointer;
            color: red;
            background-color: #ffe3bb;
          }
        }
      }
    }
  }
}
</style>