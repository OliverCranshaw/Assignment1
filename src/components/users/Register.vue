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
            <el-button @click="loginRedirect" type="primary">Login</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-divider></el-divider>
    <el-main>
      <el-row type="flex" justify="center">
        <div align="centre">
          <h2>
            Register
          </h2>
        </div>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="10">
          <div align="right">
            <h5>First Name:</h5>
          </div>
        </el-col>
        <el-col :span="4" >
          <div>
            <el-input
                placeholder="First name"
                v-model="firstName"
                clearable>
            </el-input>
          </div>
        </el-col>
        <el-col :span="10">
            <div align="left" style="color: red">
                <span>{{firstNameError}}</span>
            </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="10">
          <div align="right">
            <h5>Last Name: </h5>
          </div>
        </el-col>
        <el-col :span="4" >
          <div>
            <el-input
                placeholder="Last name"
                v-model="lastName"
                clearable>
            </el-input>
          </div>
        </el-col>
        <el-col :span="10">
          <div align="left" style="color: red">
            <span>{{lastNameError}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="10">
          <div align="right">
            <h5>Email: </h5>
          </div>
        </el-col>
        <el-col :span="4" >
          <div>
            <el-input
                placeholder="Email"
                v-model="email"
                clearable>
            </el-input>
          </div>
        </el-col>
        <el-col :span="10">
          <div align="left" style="color: red">
            <span>{{emailError}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="10">
          <div align="right">
            <h5>Password: </h5>
          </div>
        </el-col>
        <el-col :span="4" >
          <div>
            <el-input placeholder="Password" v-model="password" show-password></el-input>
          </div>
        </el-col>
        <el-col :span="10">
          <div align="left" style="color: red">
            <span>{{passwordError}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="0">
          <div v-if="errorFlag" style="color:red;">
            {{error }}
          </div>
          <div>
            <el-button @click="createUser" type="primary">Register</el-button>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>



<script>
import {ref} from "vue";
import {useRouter} from "vue-router";
import api from "@/Api";

export default {
  name: 'Register',
  setup() {
    const router = useRouter();
    const error = ref("");
    const errorFlag = ref(false);
    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')
    const password = ref('')

    const firstNameError = ref("");
    const lastNameError = ref("");
    const emailError = ref("");
    const passwordError = ref("");


    const getRegisterData = () => {

      return {
        "firstName": firstName.value,
        "lastName": lastName.value,
        "email": email.value,
        "password": password.value
      };
    }

    const checkInputs = () => {

      firstNameError.value = "";
      lastNameError.value = "";
      emailError.value = "";
      passwordError.value = "";

      let valid = true

      if (firstName.value.length < 1) {
        firstNameError.value = "First name cannot be blank"
        valid = false
      }
      if (lastName.value.length < 1) {
        lastNameError.value = "Last name cannot be blank"
        valid = false
      }
      if (email.value.length < 1) {
        emailError.value = "Email cannot be blank"
        valid = false
      }
      if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.value))) {
        emailError.value = "Email must be a valid email"
        valid = false
      }
      if (password.value.length < 8) {
        passwordError.value = "Password must be at least 8 characters"
        valid = false
      }
      return valid
    }


    const createUser = () => {

      if (checkInputs()) {
        api.register(getRegisterData())
            .then((response) => {
              router.push(`${response.data.userId}`)
            }, (err) => {

              let errString = err.response.statusText.slice(err.response.statusText.indexOf(":") + 2)
              errString = errString.charAt(0).toUpperCase() + errString.slice(1);

              error.value = errString
              errorFlag.value = true;
            });
      }

    }

    const loginRedirect = () => {
      router.push("login")
    }

    return {
      checkInputs,
      error,
      errorFlag,
      createUser,
      loginRedirect,
      firstName,
      lastName,
      email,
      password,
      firstNameError,
      lastNameError,
      emailError,
      passwordError,
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