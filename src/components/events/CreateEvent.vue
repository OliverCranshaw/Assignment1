<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-divider></el-divider>
    <el-main>
      <el-row>
        <el-col :span="9">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content"></div>
          <el-form>
            <el-form-item>
              <h1>Create Event:</h1>
            </el-form-item>
            <el-form-item>
              <p style="text-align:center;"><img v-if="defaultNeeded" src="../../assets/defaultEvent.png"
                                                 style="width: 200px; height: 200px" fit="contain"/></p>
              <p style="text-align:center;"><img v-if="!defaultNeeded" :src="imageFileDisplay"
                                                 style="width: 200px; height: 200px" fit="contain"/></p>
            </el-form-item>
            <el-form-item>
              <label><b>Title:</b></label>
              <el-input placeholder="Event name" v-model="title" type="text"></el-input>
              <span class="error">{{ errorMsg.title }}</span>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 10px"><b>Categories:</b></label>
              <el-select v-model="catSelected" multiple placeholder="Select Categories">
                <el-option
                    v-for="category in catList"
                    :key="category.name"
                    :label="category.name"
                    :value="category.id">
                </el-option>
              </el-select>
              <br>
              <span class="error">{{ errorMsg.catSelected }}</span>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 10px"><b>Date:</b></label>
              <el-date-picker
                  v-model="date"
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
                  v-model="description">
              </el-input>
              <span class="error">{{ errorMsg.description }}</span>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 10px"><b>Maximum Capacity:</b></label>
              <el-input id="capacityInput" v-model="maxCapacity" :min="1" type="number" placeholder="Enter an integer"></el-input>
              <el-checkbox v-model="checkedCapacity" @change="onMaxCapChange">Non-Applicable</el-checkbox>
              <br>
              <span class="error">{{ errorMsg.maxCapacity }}</span>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 10px"><b>Online or In-Person:</b></label>
              <el-switch
                  v-model="isOnline"
                  active-text="Online"
                  inactive-text="In-Person"
                  @change="onUrlVenueChange"
              >
              </el-switch>
              <br>
              <span>Online requires a URL, In-Person requires a venue</span>
            </el-form-item>
            <el-form-item v-if="isOnline">
              <label><b>URL:</b></label>
              <el-input id="urlInput" placeholder="Please input event URL" v-model="eventUrl" type="url">
                <template #prepend>https://</template>
              </el-input>
              <span class="error">{{ errorMsg.eventUrl }}</span>
            </el-form-item>
            <el-form-item v-else>
              <label><b>Venue:</b></label>
              <el-input id="venueInput" placeholder="Please input event venue" v-model="venue"
                        type="text"></el-input>
              <span class="error">{{ errorMsg.venue }}</span>
            </el-form-item>
            <el-form-item>
              <label style="margin-right: 10px"><b>Requires Attendance Control:</b></label>
              <el-radio v-model="controlAttendanceStatus" label=true>Yes</el-radio>
              <el-radio v-model="controlAttendanceStatus" label=false>No</el-radio>
              <span class="error">{{ errorMsg.controlAttendanceStatus }}</span>
            </el-form-item>
            <el-form-item>
              <label><b>Fee:</b></label>
              <el-input id="feeInput" placeholder="Event fee" v-model="fee" :min="0" type="number">
                <template #prepend>$</template>
              </el-input>
              <el-checkbox v-model="checkedFee" @change="onFeeChange">Non-Applicable</el-checkbox>
              <br>
              <span class="error">{{ errorMsg.fee }}</span>
            </el-form-item>
            <el-form-item>
              <span class="error" id="backendError" hidden>{{ errorMsg.backendError }}</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" v-on:click="createEvent">Create Event</el-button>
              <el-button v-on:click="onCancel">Cancel</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="9">
          <div class="grid-content"></div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import Header from '@/components/Header'
import {onMounted, ref} from 'vue'
import api from "@/Api";
import {useRouter} from "vue-router";

export default {
  name: "EventsSearch",
  components: {
    Header
  },
  setup() {

    const router = useRouter()
    const checkedFee =  ref(false)
    const checkedCapacity = ref(false)
    const title = ref('')
    const catSelected = ref([])
    const catList = ref([])
    const date = ref('')
    const description = ref('')
    const maxCapacity = ref('')
    const isOnline = ref(true)
    const eventUrl = ref('')
    const venue = ref(null)
    const controlAttendanceStatus = ref('')
    const fee = ref('')

    const errorMsg = ref({
      'imageUploadError': '',
      'title': '',
      'catSelected': '',
      'date': '',
      'description': '',
      'maxCapacity': '',
      'eventUrl': '',
      'venue': '',
      'controlAttendanceStatus': '',
      'fee': '',
      'backendError': ''
    })

    let imageFile = null
    const fileTooLarge = ref(false)
    const imageFileDisplay = ref('')
    const defaultNeeded = ref(true)

    const getCategories = () => {
      api.getCategories()
          .then((response) => {
            catList.value = response.data
          }, (err) => {
            console.log(err)

          });

    }
    onMounted(getCategories)

    const onImageUpload = (e) => {
      errorMsg.value.imageUploadError = ""
      const file = e.target.files[0]


      if (file.size > 20e6) {
        errorMsg.value.imageUploadError = "File too large"
        fileTooLarge.value = true
        imageFile = null
        defaultNeeded.value = true

      } else {
        imageFile = file
        defaultNeeded.value = false
        imageFileDisplay.value = URL.createObjectURL(imageFile)
        fileTooLarge.value = false
      }

    }

    const checkInputs = () => {
      
      let valid = true
      
      if (title.value == '') {
        errorMsg.value.title = 'You must enter a title'
        valid = false
      } else {
        errorMsg.value.title = null
      }
      
      if (catSelected.value.length == 0) {
        errorMsg.value.catSelected = 'You must select at least one category'
        valid = false
      } else {
        errorMsg.value.catSelected = null
      }
      
      let currentDateTime = new Date();

      if (date.value == '') {
        errorMsg.value.date = 'You must provide an event date'
        valid = false
      } else if (date.value.getDate() <= currentDateTime.getDate()) {
        errorMsg.value.date = 'The date must be in the future'
        valid = false
      } else {
        errorMsg.value.date = null
      }

      if (imageFile == null) {
        errorMsg.value.imageUploadError = 'You must provide an event image'
        valid = false
      } else {
        errorMsg.value.imageUploadError = null
      }
      
      if (title.value == '') {
        errorMsg.value.description = 'You must enter an event description'
        valid = false
      } else {
        errorMsg.value.description = null
      }
      if (maxCapacity.value == '') {
        errorMsg.value.maxCapacity = 'You must enter a maximum capacity'
        valid = false
      } else if (maxCapacity.value != null && (!(Number.isInteger(Number(maxCapacity.value))) || Number(maxCapacity.value) < 1)) {
        errorMsg.value.maxCapacity = 'You must enter a positive integer'
        valid = false
      } else {
        errorMsg.value.maxCapacity = null
      }
      
      if (eventUrl.value == '') {
        errorMsg.value.eventUrl = 'You must enter an event URL'
        valid = false
      } else {
        errorMsg.value.eventUrl = null
      }
      
      if (venue.value == '') {
        errorMsg.value.venue = 'You must provide a venue'
        valid = false
      } else {
        errorMsg.value.venue = null
      }
      
      if (controlAttendanceStatus.value == '') {
        errorMsg.value.controlAttendanceStatus = 'You must select an option'
        valid = false
      } else {
        errorMsg.value.controlAttendanceStatus = null
      }
      
      if (fee.value == '') {
        errorMsg.value.fee = 'You must provide an event fee'
        valid = false
      } else {
        errorMsg.value.fee = null
      }
      
      return valid
    }

    const onFeeChange = () => {
      if (checkedFee.value == true) {
        fee.value = null;
        document.getElementById("feeInput").readOnly = true;
      } else {
        document.getElementById("feeInput").readOnly = false;
        fee.value = '';
      }
    }

    const onMaxCapChange = () => {
      if (checkedCapacity.value == true) {
        maxCapacity.value = null;
        document.getElementById("capacityInput").readOnly = true;
      } else {
        document.getElementById("capacityInput").readOnly = false;
        maxCapacity.value = '';
      }
    }

    const onUrlVenueChange = () => {
      if (isOnline.value == true) {
        venue.value = null;
        eventUrl.value = '';
      } else {
        eventUrl.value = null;
        venue.value = '';
      }
    }


    const createEvent = () => {
      errorMsg.value.backendError = ''

      if (checkInputs()) {
        
        let eventData = {}
        eventData.title = title.value
        eventData.description = description.value
        eventData.categoryIds = catSelected.value
        eventData.date = date.value.toISOString().slice(0, -1).replace('T', ' ')
        eventData.isOnline = isOnline.value
        eventData.requiresAttendanceControl = controlAttendanceStatus.value == "true"
        if (maxCapacity.value != null) {
          eventData.capacity = Number(maxCapacity.value)
        }
        if (fee.value != null) {
          eventData.fee = Number(fee.value)
        }
        if (eventUrl.value != null) {
          eventData.url = eventUrl.value
        }
        if (venue.value != null) {
          eventData.venue = venue.value
        }
        api.createEvent(eventData)
            .then((response) => {
              api.modifyEventImage(response.data.eventId, imageFile, imageFile.type)
                  .then(() => {
                    router.push(`${response.data.eventId}`)
                  })
            })
            .catch((error) => {
              let errorString = error.response.statusText.slice(error.response.statusText.indexOf(":") + 2)
              errorMsg.value.backendError = errorString.charAt(0).toUpperCase() + errorString.slice(1)
            })
      }
    }

    const onCancel = () => {
      router.push(`/events`)
    }

    return {
      checkedFee,
      checkedCapacity,
      title,
      catSelected,
      catList,
      date,
      description,
      maxCapacity,
      isOnline,
      eventUrl,
      venue,
      controlAttendanceStatus,
      fee,
      errorMsg,
      onImageUpload,
      onFeeChange,
      onMaxCapChange,
      onUrlVenueChange,
      onCancel,
      createEvent,
      imageFileDisplay,
      defaultNeeded


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

.error {
  color: red;
}

</style>