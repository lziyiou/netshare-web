import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "@/router/before.js";
import locale from 'element-plus/lib/locale/lang/zh-CN'
import uploader from 'vue-simple-uploader'
import 'vue-simple-uploader/dist/style.css'
import './assets/base.css'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(uploader)
app.use(ElementPlus, { locale })
app.mount('#app')
