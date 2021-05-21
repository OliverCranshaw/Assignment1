<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-main style="padding-top: 50px">
      <el-row :gutter="10">
        <el-col :span="10">
          <div v-if="defaultNeeded" align="right">
            <img src="../../assets/defaultProfile.jpg" height="100" width="100"/>
          </div>
          <div v-else align="right">
            <el-button @click="deleteImageRequest" type="primary" icon="el-icon-delete"></el-button>
            <img :src="imageURL" height="100" width="100"/>
          </div>
        </el-col>
        <el-col :span="4" >
          <div>
            <h2>My Details</h2>
          </div>
        </el-col>
        <el-col :span="10">
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="10">
          <div align="right">
            <h5>First Name: </h5>
          </div>
        </el-col>
        <el-col :span="4" >
          <div>
            {{firstName}}
          </div>
        </el-col>
        <el-col :span="10">
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
            {{lastName}}
          </div>
        </el-col>
        <el-col :span="10">
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
            {{email}}
          </div>
        </el-col>
        <el-col :span="10">
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="10">
        </el-col>
        <el-col :span="4" >
          <div align="center" v-if="editing">
          </div>
          <div align="center" v-else>
            <el-button @click="editRequest" type="primary">Edit Details</el-button>
          </div>
        </el-col>
        <el-col :span="10">
          <el-button v-if="editing" @click="cancelEdit" type="primary">Cancel Edit</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="editing">
        <el-col :span="10">
          <div align="right">
            <h5>New First Name:</h5>
          </div>
        </el-col>
        <el-col :span="4" >
          <div>
            <el-input maxlength="30"
                placeholder="New First name"
                v-model="newFirstName"
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
      <el-row :gutter="10" v-if="editing">
        <el-col :span="10">
          <div align="right">
            <h5>New Last Name: </h5>
          </div>
        </el-col>
        <el-col :span="4" >
          <div>
            <el-input maxlength="30"
                placeholder="New Last name"
                v-model="newLastName"
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
      <el-row :gutter="10" v-if="editing">
        <el-col :span="10">
          <div align="right">
            <h5>New Email: </h5>
          </div>
        </el-col>
        <el-col :span="4" >
          <div>
            <el-input maxlength="30"
                placeholder="New Email"
                v-model="newEmail"
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
      <el-row :gutter="10" v-if="editing">
        <el-col :span="10">
          <div align="right">
            <h5>New Password: </h5>
          </div>
        </el-col>
        <el-col :span="4" >
          <div>
            <el-input maxlength="30" placeholder="Password" v-model="newPassword" show-password></el-input>
          </div>
        </el-col>
        <el-col :span="10">
          <div align="left" style="color: red">
            <span>{{passwordError}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="editing">
        <el-col :span="10">
          <div align="right">
            <h5>Current Password: </h5>
          </div>
        </el-col>
        <el-col :span="4" >
          <div>
            <el-input maxlength="30" placeholder="Password" v-model="currentPassword" show-password></el-input>
          </div>
        </el-col>
        <el-col :span="10">
          <div align="left" style="color: red">
            <span>{{currentPasswordError}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="editing">
        <el-col :span="10">
          <div align="right">
            <h5>Upload New Profile Image (Optional): </h5>
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
            <el-button v-if="editing" @click="confirmEdit" type="primary">Save Changes</el-button>
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

import {useRoute, useRouter} from "vue-router";
import api from "@/Api";
import {useStore} from "vuex";
import {onMounted, ref} from 'vue'
import Header from "@/components/Header";

export default {
  name: 'Profile',
  components: {
    Header
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore()

    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')

    const editing = ref(false)

    const newFirstName = ref('')
    const newLastName = ref('')
    const newEmail = ref('')
    const newPassword = ref('')
    const currentPassword = ref('')

    const error = ref("");
    const errorFlag = ref(false);
    const firstNameError = ref("");
    const lastNameError = ref("");
    const emailError = ref("");
    const passwordError = ref("");
    const currentPasswordError = ref("");
    const imageUploadError = ref("")
    let imageFile = null
    const fileTooLarge = ref(false)


    const imageURL = ref('data:')
    let defaultNeeded = ref(true)

    const ownProfileCheck = () => {
      if (route.params.id != store.state.user_id) {
        router.push(`${store.state.user_id}`)
      }

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

    const deleteImageRequest = () => {
      api.deleteUserImage(store.state.user_id)
          .then(() => {
            router.go(0)
          });
    }

    const getUserImage = () => {

      api.getUserImage(store.state.user_id)
          .then((response) => {

            imageURL.value += response.headers['content-type']
            imageURL.value += ";base64,"
            imageURL.value += Buffer.from(response.data, 'binary').toString('base64')
            defaultNeeded.value = false

          }).catch((err) => {
            console.log(err.response.statusText)
          });


    }

    const getUserDetails = () => {
      api.getUser(store.state.user_id)
          .then((response) => {
            firstName.value = response.data.firstName
            lastName.value = response.data.lastName
            email.value = response.data.email

          })

    }

    const editRequest = () => {
      editing.value = true
    }

    const cancelEdit = () => {
      editing.value = false
      newFirstName.value = ""
      newLastName.value = ""
      newEmail.value = ""
      newPassword.value = ""
      currentPassword.value = ""
      firstNameError.value = ""
      lastNameError.value = ""
      emailError.value = ""
      passwordError.value = ""
      currentPasswordError.value = ""
      imageUploadError.value = ""
    }

    const getNewDetails = () => {

      return {
        "firstName": newFirstName.value,
        "lastName": newLastName.value,
        "email": newEmail.value,
        "password": newPassword.value,
        "currentPassword": currentPassword.value
      };
    }

    const checkInputs = () => {

      firstNameError.value = "";
      lastNameError.value = "";
      emailError.value = "";
      passwordError.value = "";
      currentPasswordError.value = "";
      errorFlag.value = false;
      error.value = "";

      let valid = true

      if (fileTooLarge.value) {
        valid = false
      }

      if (newFirstName.value.length < 1) {
        firstNameError.value = "First name cannot be blank"
        valid = false
      }
      if (newLastName.value.length < 1) {
        lastNameError.value = "Last name cannot be blank"
        valid = false
      }
      if (newEmail.value.length < 1) {
        emailError.value = "Email cannot be blank"
        valid = false
      }
      if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(newEmail.value))) {
        emailError.value = "Email must be a valid email"
        valid = false
      }
      if (newPassword.value.length < 8) {
        passwordError.value = "Password must be at least 8 characters"
        valid = false
      }
      if (currentPassword.value.length < 1) {
        currentPasswordError.value = "You must enter your current password"
        valid = false
      }
      return valid
    }

    const confirmEdit = () => {

      if (checkInputs()) {
        api.modifyUser(store.state.user_id, getNewDetails())
            .then(() => {
              editing.value = false;
              newFirstName.value = ""
              newLastName.value = ""
              newEmail.value = ""
              newPassword.value = ""
              currentPassword.value = ""
              getUserDetails()
              console.log(imageFile)
              if (imageFile != null) {
                return api.modifyUserImage(store.state.user_id, imageFile, imageFile.type)
              }
            })
              .then(() => {
                router.go(0)
              }, (err) => {

              let errString = err.response.statusText.slice(err.response.statusText.indexOf(":") + 2)
              errString = errString.charAt(0).toUpperCase() + errString.slice(1);

              error.value = errString
              errorFlag.value = true;
            });
      }
    }

    onMounted(ownProfileCheck)
    onMounted(getUserDetails)
    onMounted(getUserImage)

    return {
      firstName,
      lastName,
      email,
      newFirstName,
      newEmail,
      newLastName,
      newPassword,
      editRequest,
      editing,
      cancelEdit,
      confirmEdit,
      firstNameError,
      lastNameError,
      emailError,
      passwordError,
      errorFlag,
      error,
      currentPassword,
      currentPasswordError,
      imageURL,
      defaultNeeded,
      imageUploadError,
      onChange,
      deleteImageRequest,
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