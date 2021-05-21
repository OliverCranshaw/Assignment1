<template>
  <el-menu v-if="!authenticated" class="el-menu-demo" mode="horizontal">
    <img src="../assets/eventsLogo.png" class="pad-right-more">
    <el-menu-item index="1" @click="routeToSearchEvents">Search Events</el-menu-item>
    <el-menu-item index="2" @click="registerRedirect">Register</el-menu-item>
    <el-menu-item index="3" @click="loginRedirect">Login</el-menu-item>
  </el-menu>
  <el-menu v-else class="el-menu-demo" mode="horizontal">
    <img src="../assets/eventsLogo.png" class="pad-right">
    <el-menu-item index="1" @click="routeToCreateEvent">Create Event</el-menu-item>
    <el-menu-item index="2" @click="routeToSearchEvents">Search Events</el-menu-item>
    <el-menu-item index="3" @click="routeToProfile">Profile</el-menu-item>
    <el-menu-item index="4" @click="logoutRequest">Logout</el-menu-item>
  </el-menu>
  <div class="line"></div>
</template>

<script>
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import api from "@/Api";

export default {
name: "Header",
  setup() {
    const store = useStore()
    const router = useRouter()

    const authenticated = store.getters.isAuthenticated

    const routeToProfile = () => {
      router.push(`/users/${store.state.user_id}`)
    }
    const routeToCreateEvent = () => {
      router.push('/events/create')
    }

    const routeToSearchEvents = () => {
      router.push('/events')
    }

    const loginRedirect = () => {
      router.push("/users/login")
    }

    const registerRedirect = () => {
      router.push("/users/register")
    }

    const logoutRequest = () => {
      api.logout()
          .then(() => {
            store.commit("updateToken", "")
            store.commit("updateUser", null)
            router.push({name: 'Login'})

          }, (err) => {

            console.log(err.response.statusText)
            store.commit("updateToken", "")
            store.commit("updateUser", null)
            router.push({name: 'Login'})

          });
    }

    return {
      authenticated,
      routeToProfile,
      routeToCreateEvent,
      routeToSearchEvents,
      loginRedirect,
      logoutRequest,
      registerRedirect
    }

  }
}
</script>

<style scoped>
.el-menu-demo {
  width: auto;
  justify-content: flex-end;
  display: flex;
}

.pad-right {
  padding-right: 200px;
}

.pad-right-more {
  padding-right: 320px;
}

</style>