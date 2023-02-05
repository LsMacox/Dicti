import { createApp } from "vue"

// Plugins
import { createPinia } from "pinia"
import vClickOutside from "click-outside-vue3"
import axios from "axios"
import VueAxios from "vue-axios"

import App from "./App.vue"
import router from "./router"

import "./assets/sass/main.scss"

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vClickOutside)
app.use(VueAxios, axios)

app.mount("#app")
