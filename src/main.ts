import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";

setTimeout(() => {
  window.location.reload();
}, 1000 * 60 * 2);

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount("#app");
