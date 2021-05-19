<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-divider></el-divider>
    <el-main>
      <el-row type="flex" justify="center">
        <div align="centre">
          <h2>
            Login
          </h2>
        </div>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="10">
          <div align="right">
            <h5>Email:</h5>
          </div>
        </el-col>
        <el-col :span="4" >
          <div>
            <el-input maxlength="30"
                placeholder="Email"
                v-model="email"
                clearable>
            </el-input>
          </div>
        </el-col>
        <el-col :span="10">
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="10">
          <div align="right">
            <h5>Password:</h5>
          </div>
        </el-col>
        <el-col :span="4" >
          <div>
            <el-input maxlength="30"
                placeholder="Password"
                v-model="password"
                show-password>
            </el-input>
          </div>
        </el-col>
        <el-col :span="10">
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10"></el-col>
        <el-col :span="4">
          <div align="right">
            <el-button @click="loginRequest" type="primary">Login</el-button>
          </div>
        </el-col>
        <el-col :span="10">
          <div v-if="errorFlag" style="color:red;">
            {{error }}
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import {useRouter} from "vue-router";
import {ref} from "vue";
import api from "@/Api";
import { useStore } from 'vuex'
import Header from "@/components/Header";


export default {
  name: 'Login',
  components: {
    Header
  },

  setup() {
    const router = useRouter();
    const error = ref("");
    const errorFlag = ref(false);
    const email = ref('')
    const password = ref('')
    const store = useStore()


    const getLoginData = () => {

      return {
        "email": email.value,
        "password": password.value
      };
    }

    const checkInputs = () => {

      error.value = ""
      errorFlag.value = false;

      let valid = true

      if (password.value.length < 1) {
        valid = false
      }

      if (email.value.length < 1) {
        valid = false
      } else if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.value))) {
        error.value = "Email must be a valid email"
        errorFlag.value = true;
        valid = false
      }

      return valid
    }



    const loginRequest = () => {

      if(checkInputs()) {
        api.login(getLoginData())
            .then((response) => {
              store.commit("updateToken", response.data.token)
              store.commit("updateUser", response.data.userId)
              router.push(`${response.data.userId}`)
            }, (err) => {

              let errString = err.response.statusText.slice(err.response.statusText.indexOf(":") + 2)
              errString = errString.charAt(0).toUpperCase() + errString.slice(1);

              error.value = errString
              errorFlag.value = true;
            });
      }
    }

    return {
      loginRequest,
      error,
      errorFlag,
      email,
      password,
      store,
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