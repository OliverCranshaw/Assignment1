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
                <div align="left" class="pad-top">
                  <h6>Fee: {{eventData.fee}}</h6>
                </div>
                <div align="left" class="pad-top">
                  <h6>Categories: {{categoriesNames}}</h6>
                </div>
                <div align="left" class="pad-top">
                  <h6 class="image-inline">Organizer: {{eventData.organizerFirstName}} {{eventData.organizerLastName}}</h6>
                  <img v-if="defaultNeeded" src="../../assets/defaultProfile.jpg" height="30" width="30" style="display:inline"/>
                  <img v-else :src="eventData.organizerImage" height="30" width="30" style="display:inline"/>
                </div>
                <div class="bottom" align="end">
                  <el-button type="text" class="button">Edit Event</el-button>
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="6" align="center">
          <div>
            <el-card :body-style="{ padding: '0px' }">
              <div style="padding: 14px;">
                <h3>Attendees:</h3>
                <div v-if="eventData.requiresAttendanceControl" align="center">
                  <h5 class="smaller-heading">Capacity: {{ eventData.attendeeCount }}/{{eventData.capacity}}</h5>
                </div>
                <div v-for="(attendee) in attendeeList" v-bind:key="attendee">
                  <div align="left" class="pad-top">
                    <h6 class="image-inline">{{attendee.firstName}} {{attendee.lastName}} ({{attendee.type}})</h6>
                    <img :src="attendeeImageList[attendee.attendeeId]" height="30" width="30">
                  </div>
                </div>
                <div class="bottom" align="end">
                  <el-button type="text" class="button">Manage Attendees</el-button>
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="9" align="center">
          <div class="similarTable">
            <el-card :body-style="{ padding: '0px' }">
              <div style="padding: 14px;">
                <div>
                  <h3> Similar Events: </h3>
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

    </el-main>
  </el-container>
  </div>
</template>

<script>

import Header from "@/components/Header";
import api from '@/Api'
import {onMounted, ref} from 'vue'
import {useRoute, useRouter} from "vue-router";

export default {
  name: "Event",
  components: {
    Header
  },

  setup() {

    const dataReady = ref(false)

    const router = useRouter()
    const route = useRoute()

    const eventData = ref({})
    const similarEvents = ref([])
    const catList = ref([])
    const categoriesNames = ref('')

    const hasEventUrl = ref(true)
    const hasEventVenue = ref(true)

    const defaultNeeded = ref(true)

    const attendeeList = ref([])
    const attendeeImageList = ref({})


    const getEventData = () => {

      api.getEvent(route.params.id)
        .then((response) => {

          eventData.value = response.data
          
          eventData.value.date = eventData.value.date.slice(0, -8)
          eventData.value.date = eventData.value.date.replace("T", ", ")

          for (const cat in eventData.value.categories) {
            for (const catId in catList.value)
              if (catList.value[catId].id == eventData.value.categories[cat]) {
                categoriesNames.value += catList.value[catId].name + ", "
              }
          }
          if (eventData.value.fee == 0) {
            eventData.value.fee = 'Free'
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
            }
          }
          console.log(attendeeImageList)
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

    const eventRouter = (row) => {
      router.push({ name: 'EventView', params: { id: `${row.eventId}`}})

    }

    const pageReady = () => {
      dataReady.value = true
    }

    // onMounted(getCategories)
    // onMounted(getEventData)
    // onMounted(getEventImage)
    // onMounted(getAttendees)

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
      attendeeImageList
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

</style>