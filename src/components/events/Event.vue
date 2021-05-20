<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-divider></el-divider>
    <el-main>
      <el-row>
        <el-col :span="15" align="center">
          <div>
            <h1>
              Event Data {{eventData.categories}}
            </h1>
          </div>
        </el-col>
        <el-col :span="9" align="center">
          <div>
            <h1> Similar Events: </h1>
          </div>
          <div class="similarTable">
            <el-table
                :data="similarEvents"
                stripe
                @row-dblclick="eventRouter"
                style="width: 100%">
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
        </el-col>
      </el-row>

    </el-main>
  </el-container>
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

    const router = useRouter()
    const route = useRoute()

    const eventData = ref({})
    const similarEvents = ref([])
    const catList = ref([])


    const getEventData = () => {

      api.getEvent(route.params.id)
        .then((response) => {
          eventData.value = response.data
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

    onMounted(getCategories)
    onMounted(getEventData)






    return {
      eventData,
      similarEvents,
      eventRouter,
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