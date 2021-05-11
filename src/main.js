import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { Toast } from 'vant';
import { DropdownMenu, DropdownItem } from 'vant';
// import { Dialog } from 'vant';






const app = createApp(App);
app.use(router);
app.use(Toast);
app.use(DropdownMenu);
app.use(DropdownItem);
// app.use(Dialog);
app.config.productionTip = false;
app.mount("#app");