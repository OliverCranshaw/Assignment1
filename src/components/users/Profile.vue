<template>
  <div v-if="dataReady">
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-main style="padding-top: 50px">
        <el-row :gutter="20">
          <el-col :span="9">
          <el-card style="margin-bottom: 25px">
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
              <el-col :span="6" >
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
              <el-col :span="6" >
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
              <el-col :span="6" >
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
          </el-card>
          <el-card v-if="editing">
            <el-row :gutter="10" v-if="editing">
              <el-col :span="10">
                <div align="right">
                  <h5>New First Name:</h5>
                </div>
              </el-col>
              <el-col :span="6" >
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
              <el-col :span="6" >
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
              <el-col :span="6" >
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
              <el-col :span="6" >
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
              <el-col :span="6" >
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
                  <h5>New Profile Image (Optional): </h5>
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
          </el-card>
          </el-col>
          <el-col :span="15">
            <el-card align="center" style="margin-bottom: 20px">
              <div>
                <h3> Events You Are Hosting (Double click for more info)</h3>
              </div>
              <el-table
                  :data="hostingEventsData"
                  :default-sort = "{prop: 'date', order: 'ascending'}"
                  stripe
                  @row-dblclick="eventRouter"
                  style="width: 100%">
                <el-table-column
                    prop="eventImageURL"
                    label="Image"
                    width="80">
                  <template v-slot="scope">
                    <img :src="scope.row.eventImageURL" width="50" height="50"/>
                  </template>
                </el-table-column>
                <el-table-column
                    prop="date"
                    label="Date and Time"
                    width="150"
                    sortable>
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="Title"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="categories"
                    label="Categories"
                    width="350">
                </el-table-column>
                <el-table-column
                    prop="hostImageURL"
                    label="Host"
                    width="80">
                  <template v-slot="scope">
                    <img :src="scope.row.hostImageURL" width="50" height="50"/>
                  </template>
                </el-table-column>
                <el-table-column
                    prop="hostName"
                    label=""
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="numAcceptedAttendees"
                    label="Attendance"
                    width="100">
                </el-table-column>
              </el-table>
            </el-card>
            <el-card align="center">
              <div>
                <h3> Events You Are Attending (Double click for more info)</h3>
              </div>
              <el-table
                  :data="attendingEventsData"
                  :default-sort = "{prop: 'date', order: 'ascending'}"
                  stripe
                  @row-dblclick="eventRouter"
                  style="width: 100%">
                <el-table-column
                    prop="eventImageURL"
                    label="Image"
                    width="80">
                  <template v-slot="scope">
                    <img :src="scope.row.eventImageURL" width="50" height="50"/>
                  </template>
                </el-table-column>
                <el-table-column
                    prop="date"
                    label="Date and Time"
                    width="150"
                    sortable>
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="Title"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="categories"
                    label="Categories"
                    width="350">
                </el-table-column>
                <el-table-column
                    prop="hostImageURL"
                    label="Host"
                    width="80">
                  <template v-slot="scope">
                    <img :src="scope.row.hostImageURL" width="50" height="50"/>
                  </template>
                </el-table-column>
                <el-table-column
                    prop="hostName"
                    label=""
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="numAcceptedAttendees"
                    label="Attendance"
                    width="100">
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
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
    const dataReady = ref(false)

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

    const hostingEventsData = ref([])
    const attendingEventsData = ref([])

    const catList = ref([])

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

    const eventRouter = (row) => {
      router.push({ name: 'EventView', params: { id: `${row.eventId}`}})

    }

    const getAllEvents = () => {
      api.getAllEvents('DATE_ASC')
        .then((response) => {

          let allEvents = response.data


          for (const row in allEvents) {
            api.getEvent(allEvents[row].eventId)
              .then((eventResponse) => {

                let tableRow = {}

                eventResponse.data.date = eventResponse.data.date.slice(0, -8)
                eventResponse.data.date = eventResponse.data.date.replace("T", ", ")

                tableRow.eventId = eventResponse.data.id
                tableRow.date = eventResponse.data.date
                tableRow.title = eventResponse.data.title
                tableRow.categories = []
                tableRow.hostName = eventResponse.data.organizerFirstName + " " + eventResponse.data.organizerLastName
                tableRow.numAcceptedAttendees = eventResponse.data.attendeeCount

                if (tableRow.numAcceptedAttendees == null) {
                  tableRow.numAcceptedAttendees = 0
                }

                for (const cat in eventResponse.data.categories) {
                  for (const catId in catList.value)
                    if (catList.value[catId].id == eventResponse.data.categories[cat]) {
                      tableRow.categories.push(" " + catList.value[catId].name)
                    }
                }
                api.getEventImage(eventResponse.data.id)
                  .then((eventImageResponse) => {

                  let imageURL = "data:"
                  imageURL += eventImageResponse.headers['content-type']
                  imageURL += ";base64,"
                  imageURL += Buffer.from(eventImageResponse.data, 'binary').toString('base64')

                  tableRow.eventImageURL = imageURL

                }, (err) => {
                  console.log(err)
                })

                api.getUserImage(eventResponse.data.organizerId)
                    .then((userImageResponse) => {

                      let imageURL = "data:"
                      imageURL += userImageResponse.headers['content-type']
                      imageURL += ";base64,"
                      imageURL += Buffer.from(userImageResponse.data, 'binary').toString('base64')

                      tableRow.hostImageURL = imageURL

                    }, (err) => {
                      tableRow.hostImageURL = '/img/defaultProfile.d8a851d0.jpg'
                      console.log(err)
                    })

                  let attendeesList = []
                  api.getAttendees(eventResponse.data.id)
                    .then((attendeeResponse) => {
                      attendeesList = attendeeResponse.data

                      let isAttending = false

                      for (const row in attendeesList) {
                        if (store.state.user_id == attendeesList[row].attendeeId && attendeesList[row].status == "accepted") {
                          isAttending = true
                        }
                      }
                      if (isAttending) {
                        attendingEventsData.value.push(tableRow)
                      }

                  }, (err) => {
                      console.log(err)
                  })

                  if (eventResponse.data.organizerId == store.state.user_id) {
                    hostingEventsData.value.push(tableRow)
                  }


              }, (err) => {
                console.log(err)
            })
          }

        }, (err) => {
          console.log(err)
        })
    }

    const getCategories = () => {
      api.getCategories()
          .then((response) => {
            catList.value = response.data
          }, (err) => {
            console.log(err)

          });

    }





    const pageReady = () => {
      dataReady.value = true
    }

    onMounted(() => {
      getAllEvents()
      getCategories()
      ownProfileCheck()
      getUserDetails()
      getUserImage()
      setTimeout(pageReady, 800)
    });



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
      eventRouter,
      hostingEventsData,
      attendingEventsData,
      dataReady
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