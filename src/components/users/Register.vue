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
            <el-input maxlength="30"
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
            <el-input maxlength="30"
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
            <el-input maxlength="30"
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
            <el-input maxlength="30" placeholder="Password" v-model="password" show-password></el-input>
          </div>
        </el-col>
        <el-col :span="10">
          <div align="left" style="color: red">
            <span>{{passwordError}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="10">
          <div align="right">
            <h5>Upload Profile Image (Optional): </h5>
          </div>
        </el-col>
        <el-col :span="4" >
          <div>
            <input type="file" accept="image/jpeg,image/png,image/gif" id="file" @change="onChange" >
          </div>
        </el-col>
        <el-col :span="10">
          <div align="left" style="color: red">
            <span>{{imageUploadError}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="10"></el-col>
        <el-col :span="4">
          <div align="right">
            <el-button @click="createUser" type="primary">Register</el-button>
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
import {ref} from "vue";
import {useRouter} from "vue-router";
import api from "@/Api";
import {useStore} from "vuex";
import Header from "@/components/Header";

export default {
  name: 'Register',
  components: {
    Header
  },

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
    const imageUploadError = ref("");

    const store = useStore()



    let imageFile = null


    const fileTooLarge = ref(false)


    const getRegisterData = () => {

      return {
        "firstName": firstName.value,
        "lastName": lastName.value,
        "email": email.value,
        "password": password.value
      };
    }

    const getLoginData = () => {

      return {
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

      if (fileTooLarge.value) {
        valid = false
      }

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

    const onChange = (e) => {
      imageUploadError.value = ""
      const file = e.target.files[0]


      if (file.size > 20e6) {
        imageUploadError.value = "File too large"
        fileTooLarge.value = true

      } else {
        imageFile = file
        fileTooLarge.value = false
      }

    }


    const createUser = () => {

      if (checkInputs()) {
        api.register(getRegisterData())
            .then(() => {
              return api.login(getLoginData());
            })
            .then((loginResponse) => {
              store.commit("updateToken", loginResponse.data.token)
              store.commit("updateUser", loginResponse.data.userId)

              if (imageFile != null) {
                return api.modifyUserImage(loginResponse.data.userId, imageFile, imageFile.type)
              }

            }, (err) => {

              let errString = err.response.statusText.slice(err.response.statusText.indexOf(":") + 2)
              errString = errString.charAt(0).toUpperCase() + errString.slice(1);

              error.value = errString
              errorFlag.value = true;
            })
            .then(() => {
              router.push(`${store.state.user_id}`)
            })

      }

    }

    return {
      checkInputs,
      error,
      errorFlag,
      createUser,
      firstName,
      lastName,
      email,
      password,
      firstNameError,
      lastNameError,
      emailError,
      passwordError,
      imageUploadError,
      onChange,

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