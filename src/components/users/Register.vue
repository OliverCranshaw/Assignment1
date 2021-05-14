<template>
  <el-container>
    <el-header>
    </el-header>
    <el-main>
      <el-row type="flex" justify="center">
        <el-col :span="4" >
          <div>
            <el-input
                placeholder="First name"
                v-model="firstName"
                clearable>
            </el-input>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="4">
          <div>
            <el-input
                placeholder="Last name"
                v-model="lastName"
                clearable>
            </el-input>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="4">
          <div>
            <el-input
                placeholder="Email"
                v-model="email"
                clearable>
            </el-input>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="4">
          <div>
            <el-input placeholder="Password" v-model="password" show-password></el-input>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="0">
          <div>
            <el-button @click="createUser" size="medium" type="primary">Register</el-button>
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

    const getRegisterData = () => {

      return {
        "firstName": firstName.value,
        "lastName": lastName.value,
        "email": email.value,
        "password": password.value
      };
    }


    const createUser = () => {
      api.register(getRegisterData())
          .then((response) => {
            router.push(`${response.data.userId}`)
          }, (err) => {
            error.value = err;
            errorFlag.value = true;
          });
    }

    const loginRedirect = () => {
      router.push("login")
    }

    return {
      error,
      errorFlag,
      createUser,
      loginRedirect,
      firstName,
      lastName,
      email,
      password,
    }

  }
}
</script>

<style scoped>

</style>