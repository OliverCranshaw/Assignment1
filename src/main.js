import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';
import App from './App.vue';
import Events from "./events.vue";

const app = createApp(App);

app.mount('#app');

const routes = [
    {
        path: "/",
        component: Events
    },
    {
        path: "/users",
        component: Users
    }
];
