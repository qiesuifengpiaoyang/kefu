import { createRouter, createWebHashHistory } from "vue-router";
import qs from "qs";
import axios from "@/tool/axios.js";
import { apiDomain } from "@/tool/path.js";

const routes = [
  {
    //登录
    path: "/",
    name: "login",
    meta: { title: '登录' },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/login.vue"),
  },
  // {
  //   //在线访客
  //   path: "/service",
  //   name: "service",
  //   meta: { verify: true, title: '在线访客' },
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/service.vue"),
  // },
  // {
  //   //管理
  //   path: "/admin",
  //   name: "admin",
  //   meta: { verify: true, title: '管理' },
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/admin.vue"),
  // },
  // {
  //   //聊天室
  //   path: "/chatRoom/:uid",
  //   name: "chatRoom",
  //   meta: { verify: true, title: '聊天室' },
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/chatRoom.vue"),
  // },
  {
    //客服整合
    path: "/kefu",
    name: "kefu",
    meta: { verify: true, title: '客服' },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/kefu.vue"),
  },
  // {
  //   //历史记录
  //   path: "/history/:uid/:type_id",
  //   name: "history",
  //   meta: {  title: '历史记录' },
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/history.vue"),
  // },
  {
    //用户端
    path: "/chat/:uid/:username/:mobile",
    name: "chat",
    meta: { title: '联系客服' },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/chat.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  if (to.matched.some(record => record.meta.verify)) {
    if (sessionStorage.getItem('token')) {
      next();
    } else {
      next({
        path: '/',//login
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
})


export default router;

