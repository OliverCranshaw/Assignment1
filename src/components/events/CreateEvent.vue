<template>
  <el-container>
    <el-header>
      <el-row :gutter="20">
        <el-col :span="6">
          <div>
            <h1>
              Events Application
            </h1>
          </div>
        </el-col>
        <el-col :span="12" align="center">
          <el-button @click="routeToSearchEvents" type="primary">Search Events</el-button>
        </el-col>
        <el-col :span="6">
          <div align="right">
            <el-button v-if="authenticated" @click="routeToProfile" type="primary">Profile</el-button>
            <el-button v-if="authenticated" @click="logoutRequest" type="primary">Logout</el-button>
            <el-button v-else @click="loginRedirect" type="primary">Login</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-divider></el-divider>
    <el-main>
        CREATE EVENT
    </el-main>
  </el-container>
</template>

<script>
import api from "@/Api";
import {useRouter} from "vue-router";
import {useStore} from "vuex";

export default {
  name: "EventsSearch",
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
      router.push("login")
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
      routeToSearchEvents,
      routeToCreateEvent,
      logoutRequest,
      loginRedirect
    }
  }


}
</script>

<style scoped>

.el-header {
  padding-top: 10px;
}


.el-row {
  margin-bottom: 20px;
}
:last-child {
  margin-bottom: 0;
}
</style>