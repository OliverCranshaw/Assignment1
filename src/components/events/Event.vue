<template>
  <div v-if="dataReady">
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-main style="padding-top: 50px">
      <el-row :gutter="20">
        <el-col :span="9" align="center">
          <div>
            <el-card :body-style="{ padding: '0px' }">
              <img :src="eventData.eventImageData" class="image">
              <div style="padding: 14px;">
                <div>
                  <h2> {{ eventData.title }} </h2>
                </div>
                <div align="center">
                  <p>{{ eventData.description }}</p>
                </div>
                <div align="left" class="pad-top">
                  <h6>Date and Time: {{eventData.date}}</h6>
                </div>
                <div v-if="hasEventUrl" align="left" class="pad-top">
                  <h6>URL: <a :href="eventData.url">{{ eventData.url }}</a></h6>
                </div>
                <div v-if="hasEventVenue" align="left" class="pad-top">
                  <h6>Venue: {{eventData.venue}}</h6>
                </div>
                <div v-if="isFee" align="left" class="pad-top">
                  <h6>Fee: ${{eventData.fee}}</h6>
                </div>
                <div v-else align="left" class="pad-top">
                  <h6>Fee: Free</h6>
                </div>
                <div align="left" class="pad-top">
                  <h6>Categories: {{categoriesNames}}</h6>
                </div>
                <div align="left" class="pad-top">
                  <h6 class="image-inline">Organizer: {{eventData.organizerFirstName}} {{eventData.organizerLastName}}</h6>
                  <img v-if="defaultNeeded" src="../../assets/defaultProfile.jpg" height="30" width="30" style="display:inline"/>
                  <img v-else :src="eventData.organizerImage" height="30" width="30" style="display:inline"/>
                </div>
                <div v-if="isEventOrganizer && !isEventInPast" class="bottom" align="end">
                  <el-button type="text" @click="onEditEvent" class="button">Edit Event</el-button>
                  <el-popconfirm @confirm="onDeleteEvent"
                      title="Are you sure you want to delete this event?"
                  >
                    <template #reference>
                      <el-button type="text" class="button">Delete Event</el-button>
                    </template>
                  </el-popconfirm>

                </div>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="5" align="center">
          <div>
            <el-card :body-style="{ padding: '0px' }">
              <div style="padding: 14px;">
                <h3>Attendees:</h3>
                <div v-if="eventData.capacity" align="center">
                  <h5 class="smaller-heading">Capacity: {{ eventData.attendeeCount }}/{{eventData.capacity}}</h5>
                </div>
                <div v-else align="center">
                  <h5 class="smaller-heading">Total: {{ eventData.attendeeCount }}</h5>
                </div>
                <div v-if="canRequestAttendance && !isEventInPast" class="bottom" align="end">
                  <el-button @click="requestAttendance" type="text" class="button">Request Attendance</el-button>
                </div>
                <div v-if="isAlreadyAttending && !isEventInPast && canCancelAttendance" class="bottom" align="end">
                  <el-button @click="requestRemoval" type="text" class="button">Cancel Attendance</el-button>
                </div>
                <div v-for="(attendee) in attendeeList" v-bind:key="attendee">
                  <div align="left" class="pad-top">
                    <h6 class="image-inline">{{attendee.firstName}} {{attendee.lastName}} ({{attendee.type}})</h6>
                    <img :src="attendeeImageList[attendee.attendeeId]" height="30" width="30">
                  </div>
                </div>
                <div v-if="isEventOrganizer && !isEventInPast" class="bottom" align="end">
                  <el-button @click="manageAttendees" type="text" class="button">Manage Attendees</el-button>
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="10" align="center">
          <div class="similarTable">
            <el-card :body-style="{ padding: '0px' }">
              <div style="padding: 14px;">
                <div>
                  <h3> Similar Events </h3>
                </div>
                <el-table
                    :data="similarEvents"
                    stripe
                    @row-dblclick="eventRouter"
                    style="width: 100%"
                    max-height="700">
                  <el-table-column
                      prop="date"
                      label="Date and Time"
                      width="150">
                  </el-table-column>
                  <el-table-column
                      prop="title"
                      label="Title"
                      width="200">
                  </el-table-column>
                  <el-table-column
                      prop="categories"
                      label="Categories"
                      width="255">
                  </el-table-column>
                  <el-table-column
                      prop="numAcceptedAttendees"
                      label="Attendance"
                      width="100">
                  </el-table-column>
              </el-table>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
      <el-dialog title="Edit Event" v-model="editEventVisible">
        <el-form>
          <el-form-item>
            <p style="text-align:center;"><img :src="imageFileDisplay || eventData.eventImageData"
                                               style="width: 200px; height: 200px" fit="contain"/></p>
          </el-form-item>
          <el-form-item>
            <label><b>Title:</b></label>
            <el-input placeholder="Event name" v-model="eventEditData.title" type="text"></el-input>
            <span class="error">{{ errorMsg.title }}</span>
          </el-form-item>
          <el-form-item>
            <label style="margin-right: 10px"><b>Categories:</b></label>
            <el-select v-model="eventEditData.categories" multiple placeholder="Select Categories">
              <el-option
                  v-for="category in catList"
                  :key="category.name"
                  :label="category.name"
                  :value="category.id">
              </el-option>
            </el-select>
            <br>
            <span class="error">{{ errorMsg.categories }}</span>
          </el-form-item>
          <el-form-item>
            <label style="margin-right: 10px"><b>Date:</b></label>
            <el-date-picker
                v-model="eventEditData.date"
                type="datetime"
                placeholder="Select date and time">
            </el-date-picker>
            <br>
            <span class="error">{{ errorMsg.date }}</span>
          </el-form-item>
          <el-form-item>
            <label style="margin-right: 10px"><b>Event Image:</b></label>
            <br>
            <input type="file" accept="image/jpeg,image/png,image/gif" @change="onImageUpload">
            <br>
            <span class="error">{{ errorMsg.imageUploadError }}</span>
          </el-form-item>
          <el-form-item>
            <label><b>Description:</b></label>
            <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="Event description"
                v-model="eventEditData.description">
            </el-input>
            <span class="error">{{ errorMsg.description }}</span>
          </el-form-item>
          <el-form-item>
            <label style="margin-right: 10px"><b>Maximum Capacity:</b></label>
            <el-input id="capacityInput" v-model="eventEditData.maxCapacity" :min="1" type="number" placeholder="Enter an integer"></el-input>
            <el-checkbox v-model="eventEditData.checkedCapacity" @change="onMaxCapChange">Non-Applicable</el-checkbox>
            <br>
            <span class="error">{{ errorMsg.maxCapacity }}</span>
          </el-form-item>
          <el-form-item>
            <label style="margin-right: 10px"><b>Online or In-Person:</b></label>
            <el-switch
                v-model="eventEditData.isOnline"
                active-text="Online"
                inactive-text="In-Person"
                @change="onUrlVenueChange"
            >
            </el-switch>
            <br>
            <span>Online requires a URL, In-Person requires a venue</span>
          </el-form-item>
          <el-form-item>
            <label><b>URL:</b></label>
            <el-input id="urlInput" placeholder="Please input event URL" v-model="eventEditData.url" type="url">
              <template #prepend>https://</template>
            </el-input>
            <span class="error">{{ errorMsg.url }}</span>
          </el-form-item>
          <el-form-item v-if="!eventEditData.isOnline">
            <label><b>Venue:</b></label>
            <el-input id="venueInput" placeholder="Please input event venue" v-model="eventEditData.venue"
                      type="text"></el-input>
            <span class="error">{{ errorMsg.venue }}</span>
          </el-form-item>
          <el-form-item>
            <label style="margin-right: 10px"><b>Requires Attendance Control:</b></label>
            <el-radio v-model="eventEditData.controlAttendanceStatus" label=true>Yes</el-radio>
            <el-radio v-model="eventEditData.controlAttendanceStatus" label=false>No</el-radio>
            <span class="error">{{ errorMsg.controlAttendanceStatus }}</span>
          </el-form-item>
          <el-form-item>
            <label><b>Fee:</b></label>
            <el-input id="feeInput" placeholder="Event fee" v-model="eventEditData.fee" :min="0" type="number">
              <template #prepend>$</template>
            </el-input>
            <el-checkbox v-model="eventEditData.checkedFee" @change="onFeeChange">Non-Applicable</el-checkbox>
            <br>
            <span class="error">{{ errorMsg.fee }}</span>
          </el-form-item>
          <el-form-item>
            <span class="error" id="backendError" hidden>{{ errorMsg.backendError }}</span>
          </el-form-item>
        </el-form>
        <template #footer>
    <span class="dialog-footer">
      <el-button @click="onCancel">Cancel</el-button>
      <el-button type="primary" @click="onSaveChanges">Confirm</el-button>
    </span>
        </template>
      </el-dialog>

    </el-main>
  </el-container>
  </div>
</template>

<script>

import Header from "@/components/Header";
import api from '@/Api'
import {onMounted, ref} from 'vue'
import {useRoute, useRouter} from "vue-router";
import {useStore} from 'vuex'

export default {
  name: "Event",
  components: {
    Header
  },

  setup() {

    const dataReady = ref(false)

    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const eventData = ref({})
    const similarEvents = ref([])
    const catList = ref([])
    const categoriesNames = ref('')

    const hasEventUrl = ref(true)
    const hasEventVenue = ref(true)

    const defaultNeeded = ref(true)

    const attendeeList = ref([])
    const attendeeImageList = ref({})

    const isFee = ref(true)

    const canRequestAttendance = ref(false)
    const canCancelAttendance = ref(false)


    const editEventVisible = ref(false)

    const eventEditData = ref({
      "title": '',
      "categories": [],
      "date": null,
      "description": '',
      "maxCapacity": '',
      "isOnline": true,
      "url": null,
      "venue": null,
      "controlAttendanceStatus": 0,
      "fee": '',
    })

    const newImageChosen = ref(false)

    const isEventOrganizer = ref(false)
    const isEventInPast = ref(false)

    const checkedCapacity = ref(false)

    const isAlreadyAttending = ref(false)


    const errorMsg = ref({
      'imageUploadError': '',
      'title': '',
      'categories': '',
      'date': '',
      'description': '',
      'maxCapacity': '',
      'url': '',
      'venue': '',
      'controlAttendanceStatus': '',
      'fee': '',
      'backendError': ''
    })

    const getEventData = () => {

      api.getEvent(route.params.id)
        .then((response) => {
          eventData.value = response.data

          const now = new Date()

          if (Date.parse(response.data.date) < now) {
            isEventInPast.value = true
          }

          eventData.value.date = eventData.value.date.slice(0, -8)
          eventData.value.date = eventData.value.date.replace("T", ", ")

          if (isEventInPast.value) {
            eventData.value.date += " (Event Already Happened)"
          }

          for (const cat in eventData.value.categories) {
            for (const catId in catList.value)
              if (catList.value[catId].id == eventData.value.categories[cat]) {
                categoriesNames.value += catList.value[catId].name + ", "
              }
          }
          if (eventData.value.fee == 0) {
            isFee.value = false
          }
          if (eventData.value.url == null) {
            hasEventUrl.value = false
          }
          if (eventData.value.venue == null) {
            hasEventVenue.value = false
          }
          if (eventData.value.attendeeCount == null) {
            eventData.value.attendeeCount = 0
          }
          categoriesNames.value = categoriesNames.value.slice(0, -2)

          if (eventData.value.requiresAttendanceControl == 0) {
            eventData.value.requiresAttendanceControl = false
          } else {
            eventData.value.requiresAttendanceControl = true
          }

          if (store.state.user_id === eventData.value.organizerId) {
            isEventOrganizer.value = true
          }

          api.getUserImage(eventData.value.organizerId)
              .then((imageResponse) => {

                let imageURL = "data:"
                imageURL += imageResponse.headers['content-type']
                imageURL += ";base64,"
                imageURL += Buffer.from(imageResponse.data, 'binary').toString('base64')
                eventData.value.organizerImage = imageURL
                defaultNeeded.value = false
              }, (err) => {
                console.log(err)
              })
          return api.getSimilarEvents(response.data.categories)
        }, (err) => {
          console.log(err)
        })
          .then((response) => {

            for (const row in response.data) {
              if (!(response.data[row].eventId == route.params.id)) {
                response.data[row].date = response.data[row].date.slice(0, -8)
                response.data[row].date = response.data[row].date.replace("T", ", ")

                for (const cat in response.data[row].categories) {
                  for (const catId in catList.value)
                    if (catList.value[catId].id == response.data[row].categories[cat]) {
                      response.data[row].categories[cat] = " " + catList.value[catId].name
                    }
                }
                similarEvents.value.push(response.data[row])
              }
            }

          }, (err) => {
            console.log(err)
          })
    }

    const getEventImage = () => {
      api.getEventImage(route.params.id)
        .then((response) => {

          let imageURL = "data:"
          imageURL += response.headers['content-type']
          imageURL += ";base64,"
          imageURL += Buffer.from(response.data, 'binary').toString('base64')
          eventData.value.eventImageData = imageURL
        }, (err) => {
          console.log(err)
        })
    }

    const getAttendees = async () => {
      api.getAttendees(route.params.id)
        .then((response) => {
          for (const row in response.data) {
            if (response.data[row].status == "accepted") {

              api.getUserImage(response.data[row].attendeeId)
                .then((imageResponse) => {
                  let imageURL = "data:"
                  imageURL += imageResponse.headers['content-type']
                  imageURL += ";base64,"
                  imageURL += Buffer.from(imageResponse.data, 'binary').toString('base64')

                  attendeeImageList.value[`${response.data[row].attendeeId}`] = imageURL

              }, (err) => {
                  attendeeImageList.value[`${response.data[row].attendeeId}`]= '/img/defaultProfile.d8a851d0.jpg'
                  console.log(err)
                })

              api.getEvent(route.params.id)
                  .then((eventResponse) => {

                    if (response.data[row].attendeeId == eventResponse.data.organizerId) {
                      response.data[row].type = 'Organizer'
                    } else {
                      response.data[row].type = 'Attendee'
                    }
                  }, (err) => {
                  console.log(err)
                  })
              attendeeList.value.push(response.data[row])
            } else if (response.data[row].attendeeId == store.state.user_id) {
              isAlreadyAttending.value = true
            }
          }

          for (const row in attendeeList.value) {
            if (attendeeList.value[row].attendeeId == store.state.user_id) {
              isAlreadyAttending.value = true
              canCancelAttendance.value = true
            }
          }
          if (eventData.value.capacity == null && !isAlreadyAttending.value) {
            canRequestAttendance.value = true
          } else {
            if (eventData.value.attendeeCount < eventData.value.capacity && !isAlreadyAttending.value) {
              canRequestAttendance.value = true
            }
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

    const getEventForEdit = () => {
      api.getEvent(route.params.id)
          .then((response) => {
            console.log(response.data)
            eventEditData.value.title = response.data.title
            eventEditData.value.categories = response.data.categories
            eventEditData.value.description = response.data.description
            eventEditData.value.maxCapacity = response.data.capacity
            eventEditData.value.url = response.data.url.slice(8)
            eventEditData.value.venue = response.data.venue

            if (response.data.requiresAttendanceControl == 1) {
              eventEditData.value.controlAttendanceStatus = 'true'
            } else {
              eventEditData.value.controlAttendanceStatus = 'false'
            }

            if (response.data.isOnline == 0) {
              eventEditData.value.isOnline = false
            }

            eventEditData.value.fee = response.data.fee
        }, (err) => {
          console.log(err)
          })
    }




          let imageFile = null
    const fileTooLarge = ref(false)
    const imageFileDisplay = ref('')

    const onImageUpload = (e) => {
      errorMsg.value.imageUploadError = ""
      const file = e.target.files[0]


      if (file.size > 20e6) {
        errorMsg.value.imageUploadError = "File too large"
        fileTooLarge.value = true
        imageFile = null
        defaultNeeded.value = true

      } else {
        newImageChosen.value = true
        imageFile = file
        defaultNeeded.value = false
        imageFileDisplay.value = URL.createObjectURL(imageFile)
        fileTooLarge.value = false
      }

    }

    const checkInputs = () => {

      let valid = true

      if (eventEditData.value.title == '') {
        errorMsg.value.title = 'You must enter a title'
        valid = false
      } else {
        errorMsg.value.title = null
      }

      if (eventEditData.value.categories.length == 0) {
        errorMsg.value.categories = 'You must select at least one category'
        valid = false
      } else {
        errorMsg.value.categories = null
      }

      let currentDateTime = new Date();

      if (eventEditData.value.date == '') {
        errorMsg.value.date = 'You must provide an event date'
        valid = false
      } else if (eventEditData.value.date < currentDateTime) {
        errorMsg.value.date = 'The date must be in the future'
        valid = false
      } else {
        errorMsg.value.date = null
      }

      if (imageFile == null) {
        newImageChosen.value = false
      } else {
        newImageChosen.value = true
      }
      if (eventEditData.value.title == '') {
        errorMsg.value.description = 'You must enter an event description'
        valid = false
      } else {
        errorMsg.value.description = null
      }
      if (eventEditData.value.maxCapacity == '') {
        errorMsg.value.maxCapacity = 'You must enter a maximum capacity'
        valid = false
      } else if (eventEditData.value.maxCapacity != null && (!(Number.isInteger(Number(eventEditData.value.maxCapacity))) || Number(eventEditData.value.maxCapacity) < 1)) {
        errorMsg.value.maxCapacity = 'You must enter a positive integer'
        valid = false
      } else {
        errorMsg.value.maxCapacity = null
      }

      if (eventEditData.value.url == '') {
        errorMsg.value.url = 'You must enter an event URL'
        valid = false
      } else {
        errorMsg.value.url = null
      }

      if (eventEditData.value.venue == '') {
        errorMsg.value.venue = 'You must provide a venue'
        valid = false
      } else {
        errorMsg.value.venue = null
      }

      if (eventEditData.value.controlAttendanceStatus == '') {
        errorMsg.value.controlAttendanceStatus = 'You must select an option'
        valid = false
      } else {
        errorMsg.value.controlAttendanceStatus = null
      }

      if (eventEditData.value.fee == '') {
        errorMsg.value.fee = 'You must provide an event fee'
        valid = false
      } else {
        errorMsg.value.fee = null
      }

      return valid
    }

    const onFeeChange = () => {
      if (eventEditData.value.checkedFee == true) {
        eventEditData.value.fee = null;
        document.getElementById("feeInput").readOnly = true;
      } else {
        document.getElementById("feeInput").readOnly = false;
        eventEditData.value.fee = '';
      }
    }

    const onMaxCapChange = () => {
      if (eventEditData.value.checkedCapacity == true) {
        eventEditData.value.maxCapacity = null;
        document.getElementById("capacityInput").readOnly = true;
      } else {
        document.getElementById("capacityInput").readOnly = false;
        eventEditData.value.maxCapacity = '';
      }
    }

    const onUrlVenueChange = () => {
      if (eventEditData.value.isOnline == true) {
        eventEditData.value.venue = null;
        eventEditData.value.url = '';
      } else {
        eventEditData.value.url = null;
        eventEditData.value.venue = '';
      }
    }


    const eventRouter = (row) => {
      router.push({ name: 'EventView', params: { id: `${row.eventId}`}})

    }

    const onEditEvent = () => {
      getEventForEdit()
      editEventVisible.value = true
    }


    const onSaveChanges = () => {
      errorMsg.value.backendError = ''

      if (checkInputs()) {
        let eventData = {}
        eventData.title = eventEditData.value.title
        eventData.description = eventEditData.value.description
        eventData.categoryIds = eventEditData.value.catSelected
        eventData.date = eventEditData.value.date.setHours(eventEditData.value.date.getHours() + 24)
        eventData.date = eventEditData.value.date.toISOString().slice(0, -1).replace('T', ' ')
        eventData.isOnline = eventEditData.value.isOnline
        eventData.requiresAttendanceControl = eventEditData.value.controlAttendanceStatus == "true"
        if (eventEditData.value.maxCapacity != null) {
          eventData.capacity = Number(eventEditData.value.maxCapacity)
        }
        if (eventEditData.value.fee != null) {
          eventData.fee = Number(eventEditData.value.fee)
        }
        if (eventEditData.value.url != null) {
          eventData.url = "https://" + eventEditData.value.url
        }
        if (eventEditData.value.venue != null) {
          eventData.venue = eventEditData.value.venue
        }



        api.modifyEvent(route.params.id, eventData)
            .then(() => {
              if (newImageChosen.value) {
                api.modifyEventImage(route.params.id, imageFile, imageFile.type)
                    .then(() => {
                    })
              }
            }, (error) => {
              let errorString = error.response.statusText.slice(error.response.statusText.indexOf(":") + 2)
              errorMsg.value.backendError = errorString.charAt(0).toUpperCase() + errorString.slice(1)
            })
        router.go(0)

      }
    }

    const onDeleteEvent = () => {
      api.deleteEvent(route.params.id)
        .then(() => {
          router.push('/events')
            }, (err) => {
          console.log(err)
            })
    }



    const onCancel = () => {
      eventEditData.value = {
        "title": '',
        "categories": [],
        "date": null,
        "description": '',
        "maxCapacity": '',
        "isOnline": 1,
        "url": null,
        "venue": null,
        "controlAttendanceStatus": '',
        "fee": '',
      }
      editEventVisible.value = false
    }

    const pageReady = () => {
      dataReady.value = true
    }


    const requestAttendance = () => {
      if (store.state.auth_token == null || store.state.user_id == null) {
        router.push('/users/login')
      } else {
        api.createAttendee(route.params.id)
          .then(() => {
            router.go(0)
          }, (err) => {
            console.log(err)
          })
      }
    }

    const requestRemoval = () => {
      api.deleteAttendee(route.params.id)
          .then(() => {
            router.go(0)
          }, (err) => {
            console.log(err)
          })
    }

    const manageAttendees = () => {
      router.push({ name: 'ManageAttendees', params: { id: `${route.params.id}`}})
    }

    onMounted(() => {
          getCategories()
          getEventData()
          getEventImage()
          getAttendees()
      setTimeout(pageReady, 700)
        });

    return {
      dataReady,
      eventData,
      similarEvents,
      eventRouter,
      hasEventUrl,
      hasEventVenue,
      categoriesNames,
      defaultNeeded,
      attendeeList,
      attendeeImageList,
      isFee,
      editEventVisible,
      catList,
      onEditEvent,
      onCancel,
      onSaveChanges,
      errorMsg,
      onUrlVenueChange,
      onMaxCapChange,
      onFeeChange,
      onImageUpload,
      imageFileDisplay,
      eventEditData,
      isEventOrganizer,
      checkedCapacity,
      isEventInPast,
      onDeleteEvent,
      canRequestAttendance,
      requestAttendance,
      isAlreadyAttending,
      requestRemoval,
      manageAttendees,
      canCancelAttendance

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

.bottom {
  margin-top: 13px;
  line-height: 12px;
  justify-content: space-between;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  height: 200px;
  display: block;
  object-fit: cover;
}

p {
  margin-top: 10px;
  font-size: 14px;
  margin-left: 25px;
  margin-right: 25px;
}

.smaller-heading {
  font-size: 15px;
}

.pad-top {
  margin-top: 10px;
  margin-left: 25px;
}

.image-inline {
  display: inline-block;
  padding-right: 20px;
}

.error {
  color: red;
}


</style>