import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import Home from './components/Home.vue';
import SetSpeed from './components/SetSpeed.vue';
import Logs from './components/Logs.vue';
import AnnotatedGallery from './components/AnnotatedGallery.vue';

import './assets/main.css'

// createApp(App).mount('#app')
// TODO: Add favicon

const routes = [
    { path: '/', component: Home },
    { path: '/speed/:speed', component: SetSpeed },
    { path: '/logs', component: Logs },
    { path: '/images', component: AnnotatedGallery },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
})

// 5. Create and mount the root instance.
const app = createApp(App)
// Make sure to _use_ the router instance to make the
// whole app router-aware.
app.use(router)
app.mount('#app')