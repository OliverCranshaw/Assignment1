import { createApp } from 'vue';
import { store } from '@/store'
import { createWebHistory, createRouter } from 'vue-router';
import ElementPlus from 'element-plus'
import axios from 'axios';
import App from './App.vue';
import EventsSearch from "@/components/events/EventsSearch";
import Register from "@/components/users/Register";
import Login from "@/components/users/Login";
import Profile from "@/components/users/Profile";
import {setAuthHeader} from "@/Api";
import CreateEvent from "@/components/events/CreateEvent";
import Event from "@/components/events/Event";
import NotFound from "@/components/NotFound";
import Landing from "@/components/Landing";

const routes = [

    {
        path: "/events",
        component: EventsSearch
    },
    {
        path: "/events/create",
        component: CreateEvent
    },
    {
        path: "/events/:id",
        component: Event,
        name: 'EventView'
    },
    {
        path: "/users/register",
        component: Register
    },
    {
        path: "/users/login",
        component: Login,
        name: 'Login'
    },
    {
        path: "/users/:id",
        component: Profile
    },
    {
        path: "/:catchAll(.*)",
        component: NotFound,
    },
    {
        path: "",
        component: Landing,
    },
];

const router = createRouter( {
    routes,
    history: createWebHistory()
});

router.beforeEach((to, _from, next) => {
    setAuthHeader(store.state.auth_token)
    const isAuthenticated = store.getters.isAuthenticated;

    if (['/users/login', '/users/register'].includes(to.path) && isAuthenticated) {
        next(`/users/${store.state.user_id}`);
    }
    const parameter = to.params.id
    if (!['/users/login', '/users/register', '/events', `/events/${parameter}`].includes(to.path) && !isAuthenticated) {
        next('/users/login');
    } else {
        next();
    }
});



const app = createApp(App);
app.use(router)
app.use(store)
app.use(ElementPlus)
app.config.globalProperties.axios = axios;
app.mount('#app');

