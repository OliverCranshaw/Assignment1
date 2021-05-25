<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-main>
        <el-row :gutter="20">
          <el-col :span="5"></el-col>
          <el-col :span="14" align="center">
            <el-card>
              <el-table
                  :data="attendeeList"
                  :default-sort = "{prop: 'dateOfInterest', order: 'ascending'}"
                  stripe
                  @row-click="editRow"
                  style="width: 100%">
                <el-table-column
                    prop="dateOfInterest"
                    label="Date of Request"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="attendeeId"
                    label="Attendee ID"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="firstName"
                    label="First name"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="lastName"
                    label="Last name"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="Status"
                    width="100">
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
          <el-col :span="5">
            <el-button @click="backToEvent">Back To Event</el-button>
          </el-col>
        </el-row>
      <el-dialog
          title="Edit User Status"
          v-model="editDialog"
          width="30%">
        <span>Select the new status for user {{userIdBeingEdited}}</span>
        <template #footer>
    <span class="dialog-footer">
      <el-button align="left" @click="editDialog = false">Cancel</el-button>
      <el-button type="primary" @click="changeToRejected">Rejected</el-button>
      <el-button type="primary" @click="changeToPending">Pending</el-button>
      <el-button type="primary" @click="changeToAccepted">Accept</el-button>

    </span>
        </template>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import Header from "@/components/Header";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from 'vue-router'
import {useStore} from 'vuex'
import api from "@/Api";

export default {
  name: 'ManageAttendees',
  components: {
    Header
  },

  setup() {

    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const userIdBeingEdited = ref(null)

    const editDialog = ref(false)

    const attendeeList = ref([])

    const getEventData = () => {

      api.getEvent(route.params.id)
          .then((response) => {
            if (store.state.user_id != response.data.organizerId) {
              router.push({name: 'EventView', params: {id: `${route.params.id}`}})
            }
          }, (err) => {
            console.log(err)
          })
    }

    const getAttendees = () => {
      api.getAttendees(route.params.id)
        .then((response) => {
          attendeeList.value = response.data
        }, (err) => {
          console.log(err)
        })
    }

    const changeToAccepted = () => {
      api.modifyAttendee(route.params.id, userIdBeingEdited.value, {"status": "accepted"})
        .then(() => {
          router.go(0)
        }, (err) => {
          console.log(err)
        })
    }
    const changeToPending = () => {
      api.modifyAttendee(route.params.id, userIdBeingEdited.value, {"status": "pending"})
          .then(() => {
            router.go(0)
          }, (err) => {
            console.log(err)
          })
    }
    const changeToRejected = () => {
      api.modifyAttendee(route.params.id, userIdBeingEdited.value, {"status": "rejected"})
          .then(() => {
            router.go(0)
          }, (err) => {
            console.log(err)
          })
    }

    const backToEvent = () => {
      router.push({name: 'EventView', params: {id: `${route.params.id}`}})
    }

    const editRow = (row) => {
      userIdBeingEdited.value = row.attendeeId
      editDialog.value = true
    }

    onMounted(getEventData)
    onMounted(getAttendees)

    return {
      attendeeList,
      changeToAccepted,
      changeToPending,
      changeToRejected,
      editRow,
      backToEvent,
      editDialog,
      userIdBeingEdited
    }
  }
}

</script>

<style>

</style>