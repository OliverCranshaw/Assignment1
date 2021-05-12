<template>

  <el-input
      placeholder="Please input your first name"
      v-model="firstName"
      clearable>
  </el-input>

    <el-input
        placeholder="Please input your last name"
        v-model="lastName"
        clearable>
    </el-input>
    <el-input
        placeholder="Please input your email"
        v-model="email"
        clearable>
    </el-input>
    <el-input placeholder="Please input your password" v-model="password" show-password></el-input>
  <el-button @click="createUser" type="primary">Register</el-button>

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
    return {
      error,
      errorFlag,
      createUser,
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