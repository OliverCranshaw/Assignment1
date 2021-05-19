<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <div>
        <h1>
          Events Application
        </h1>
      </div>
    </el-col>
    <el-col :span="12" align="center">
      <el-button v-if="authenticated" @click="routeToCreateEvent" type="primary">Create Event</el-button>
      <el-button @click="routeToSearchEvents" type="primary">Search Events</el-button>
    </el-col>
    <el-col :span="6">
      <div align="right">
        <el-button v-if="authenticated" @click="routeToProfile" type="primary">Profile</el-button>
        <el-button v-else @click="registerRedirect" type="primary">Register</el-button>
        <el-button v-if="authenticated" @click="logoutRequest" type="primary">Logout</el-button>
        <el-button v-else @click="loginRedirect" type="primary">Login</el-button>
      </div>
    </el-col>
  </el-row>
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
            router.push(`login`)

          }, (err) => {

            console.log(err.response.statusText)
            store.commit("updateToken", "")
            store.commit("updateUser", null)
            router.push(`login`)


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

</style>