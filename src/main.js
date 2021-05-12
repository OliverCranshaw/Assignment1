import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';
import ElementPlus from 'element-plus'
import axios from 'axios';
import App from './App.vue';
import Events from "@/components/events/Events";
import Register from "@/components/users/Register";
import HelloWorld from "@/components/users/HelloWorld";





const routes = [
    {
        path: "/",
        component: HelloWorld
    },
    {
        path: "/events",
        component: Events
    },
    {
        path: "/users/register",
        component: Register
    }
];

const router = createRouter({
    routes,
    history: createWebHistory()
});


const app = createApp(App);
app.use(router);
app.use(ElementPlus)
app.config.globalProperties.axios = axios;
app.mount('#app');
