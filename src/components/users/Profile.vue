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
        <el-col :span="14">
        </el-col>
        <el-col :span="4">
          <div align="right">
            <el-button @click="logoutRequest" type="primary">Logout</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-divider></el-divider>
    <el-main>
      <el-row type="flex" justify="center">
        <div align="centre">
          <h2>
            Profile
          </h2>
        </div>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>

import {useRouter} from "vue-router";
import api from "@/Api";
import {useStore} from "vuex";

export default {
  name: 'Profile',
  setup() {
    const router = useRouter();
    const store = useStore()

    const logoutRequest = () => {
      api.logout()
          .then(() => {
            store.commit("updateToken", "")
            store.commit("updateUser", null)
            router.push(`login`)

          }, () => {

          });
    }


    return {
      logoutRequest
    }

  }
}
</script>

<style scoped>

</style>