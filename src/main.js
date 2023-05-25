import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import AudioRecorder from 'vue-audio-recorder'

createApp(App).use(router).use(store).component("AudioRecorder", AudioRecorder).mount('#app')
