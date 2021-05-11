import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';
import axios from 'axios';
import App from './App.vue';
import Events from "@/components/events/Events";
import Users from "@/components/users/Users";
import HelloWorld from "@/components/HelloWorld";


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
        path: "/users",
        component: Users
    }
];

const router = createRouter({
    routes,
    history: createWebHistory()
});


const app = createApp(App);
app.use(router);

app.config.globalProperties.axios = axios;
app.mount('#app');
