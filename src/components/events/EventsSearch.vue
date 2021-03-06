<template>
  <div v-if="dataReady">
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-main style="padding-top: 50px">
      <el-row :gutter="10">
        <el-col :span="4">
        </el-col>
        <el-col :span="4" >
          <div align="left">
            <el-input maxlength="30"
                      placeholder="Search for an event"
                      v-model="searchInput"
                      clearable>
            </el-input>
          </div>
        </el-col>
        <el-col :span="3">
          <div align="left">
            <el-select
                v-model="filterOptions"
                multiple
                collapse-tags
                placeholder="Category Filter">
              <el-option
                  v-for="item in catList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="3" style="margin-top: 6px">
          <el-checkbox v-model="showAlreadyHappened">Show Already Happended</el-checkbox>
        </el-col>
        <el-col :span="2" style="margin-left: -15px">
          <div align="left">
            <el-button @click="searchRequest" type="primary">Search</el-button>
          </div>
        </el-col>
        <el-col :span="6" style="margin-top: 7px">
          <div align="left">
            <h6>Double Click an event to view further details</h6>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="2">
        </el-col>
        <el-col :span="20">
          <div align="center">
            <el-table
                :data="pagedTableData"
                :default-sort = "{prop: 'date', order: 'ascending'}"
                stripe
                @row-dblclick="eventRouter"
                @sort-change="sortOptionsSet"
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
                  width="240">
              </el-table-column>
              <el-table-column
                  prop="categories"
                  label="Categories"
                  width="450">
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
                  width="120"
                  sortable>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
        <el-col :span="2">
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="4">
        </el-col>
        <el-col :span="16" >
          <div align="center">
            <el-pagination
                @current-change="setPage"
                background
                layout="prev, pager, next"
                :total="tableData.length">
            </el-pagination>
          </div>
        </el-col>
        <el-col :span="4">
        </el-col>
      </el-row>
    </el-main>
  </el-container>
  </div>
</template>

<script>
import api from "@/Api";
import {useRouter} from "vue-router";
import {onMounted, ref, computed} from 'vue';
import Header from '@/components/Header'

export default {
  name: "EventsSearch",
  components: {
    Header,
  },
  setup() {

    const dataReady = ref(false)

    const router = useRouter()

    const searchInput = ref("")
    const tableData = ref([])
    const pageNum = ref(1)
    const pageSize = ref(10)

    const catList = ref([])

    const filterOptions = ref([])
    const sortOptions = ref('DATE_ASC')

    const showAlreadyHappened = ref(false)

    const searchRequest = () => {
      tableData.value = []

      if (searchInput.value.length < 1 && filterOptions.value.length < 1) {
        getAllEvents()
      } else if (filterOptions.value.length < 1) {
        api.searchEvents(searchInput.value, sortOptions.value)
            .then((response) => {

              for (const row in response.data) {
                if (response.data[row].title.toLowerCase().includes(searchInput.value.toLowerCase())) {
                  tableData.value.push(response.data[row])
                }
              }

              if (!showAlreadyHappened.value) {
                for (let i = 0; i < tableData.value.length; i++) {
                  const now = new Date()
                  console.log(Date.parse(tableData.value[i].date) < now)
                  if (Date.parse(tableData.value[i].date) < now) {
                    tableData.value.splice(i, 1);
                    i--;
                  }
                }
              }

              for (const row in tableData.value) {

                tableData.value[row].hostName = `${tableData.value[row].organizerFirstName} ${tableData.value[row].organizerLastName}`
                tableData.value[row].date = tableData.value[row].date.slice(0, -8)
                tableData.value[row].date = tableData.value[row].date.replace("T", ", ")


                for (const cat in tableData.value[row].categories) {
                  for (const catId in catList.value)
                    if (catList.value[catId].id == tableData.value[row].categories[cat]) {
                      tableData.value[row].categories[cat] = " " + catList.value[catId].name
                    }
                }


                api.getEventImage(tableData.value[row].eventId)
                    .then((response) => {

                      let imageURL = "data:"
                      imageURL += response.headers['content-type']
                      imageURL += ";base64,"
                      imageURL += Buffer.from(response.data, 'binary').toString('base64')

                      tableData.value[row].eventImageURL = imageURL

                    }, (err) => {
                      console.log(err)


                    });

                api.getEvent(tableData.value[row].eventId)
                    .then((response) => {
                      api.getUserImage(response.data.organizerId)
                          .then((response) => {


                            let imageURL = "data:"
                            imageURL += response.headers['content-type']
                            imageURL += ";base64,"
                            imageURL += Buffer.from(response.data, 'binary').toString('base64')
                            tableData.value[row].hostImageURL = imageURL

                          }, () => {
                            tableData.value[row].hostImageURL = '/img/defaultProfile.d8a851d0.jpg'


                          });

                    }, (err) => {
                      console.log(err)


                    });
              }

            }, (err) => {
              console.log(err)


            });
      } else if (searchInput.value.length < 1) {
        api.filterEvents(filterOptions.value, sortOptions.value)
            .then((response) => {

              tableData.value = response.data

              if (!showAlreadyHappened.value) {
                for (let i = 0; i < tableData.value.length; i++) {
                  const now = new Date()
                  console.log(Date.parse(tableData.value[i].date) < now)
                  if (Date.parse(tableData.value[i].date) < now) {
                    tableData.value.splice(i, 1);
                    i--;
                  }
                }
              }

              for (const row in tableData.value) {

                tableData.value[row].hostName = `${tableData.value[row].organizerFirstName} ${tableData.value[row].organizerLastName}`
                tableData.value[row].date = tableData.value[row].date.slice(0, -8)
                tableData.value[row].date = tableData.value[row].date.replace("T", ", ")


                for (const cat in tableData.value[row].categories) {
                  for (const catId in catList.value)
                    if (catList.value[catId].id == tableData.value[row].categories[cat]) {
                      tableData.value[row].categories[cat] = " " + catList.value[catId].name
                    }
                }


                api.getEventImage(tableData.value[row].eventId)
                    .then((response) => {

                      let imageURL = "data:"
                      imageURL += response.headers['content-type']
                      imageURL += ";base64,"
                      imageURL += Buffer.from(response.data, 'binary').toString('base64')

                      tableData.value[row].eventImageURL = imageURL

                    }, (err) => {
                      console.log(err)


                    });

                api.getEvent(tableData.value[row].eventId)
                    .then((response) => {
                      api.getUserImage(response.data.organizerId)
                          .then((response) => {


                            let imageURL = "data:"
                            imageURL += response.headers['content-type']
                            imageURL += ";base64,"
                            imageURL += Buffer.from(response.data, 'binary').toString('base64')
                            tableData.value[row].hostImageURL = imageURL

                          }, () => {
                            tableData.value[row].hostImageURL = '/img/defaultProfile.d8a851d0.jpg'


                          });

                    }, (err) => {
                      console.log(err)


                    });
              }

            }, (err) => {
              console.log(err)


            });
      } else {
        api.searchFilterEvents(searchInput.value, filterOptions.value, sortOptions.value)
            .then((response) => {

              for (const row in response.data) {
                if (response.data[row].title.toLowerCase().includes(searchInput.value.toLowerCase())) {
                  tableData.value.push(response.data[row])
                }
              }
              if (!showAlreadyHappened.value) {
                for (let i = 0; i < tableData.value.length; i++) {
                  const now = new Date()
                  console.log(Date.parse(tableData.value[i].date) < now)
                  if (Date.parse(tableData.value[i].date) < now) {
                    tableData.value.splice(i, 1);
                    i--;
                  }
                }
              }

              for (const row in tableData.value) {

                tableData.value[row].hostName = `${tableData.value[row].organizerFirstName} ${tableData.value[row].organizerLastName}`
                tableData.value[row].date = tableData.value[row].date.slice(0, -8)
                tableData.value[row].date = tableData.value[row].date.replace("T", ", ")


                for (const cat in tableData.value[row].categories) {
                  for (const catId in catList.value)
                    if (catList.value[catId].id == tableData.value[row].categories[cat]) {
                      tableData.value[row].categories[cat] = " " + catList.value[catId].name
                    }
                }


                api.getEventImage(tableData.value[row].eventId)
                    .then((response) => {

                      let imageURL = "data:"
                      imageURL += response.headers['content-type']
                      imageURL += ";base64,"
                      imageURL += Buffer.from(response.data, 'binary').toString('base64')

                      tableData.value[row].eventImageURL = imageURL

                    }, (err) => {
                      console.log(err)


                    });

                api.getEvent(tableData.value[row].eventId)
                    .then((response) => {
                      api.getUserImage(response.data.organizerId)
                          .then((response) => {


                            let imageURL = "data:"
                            imageURL += response.headers['content-type']
                            imageURL += ";base64,"
                            imageURL += Buffer.from(response.data, 'binary').toString('base64')
                            tableData.value[row].hostImageURL = imageURL

                          }, () => {
                            tableData.value[row].hostImageURL = '/img/defaultProfile.d8a851d0.jpg'


                          });

                    }, (err) => {
                      console.log(err)


                    });
              }

            }, (err) => {
              console.log(err)
            });
      }
    }

    const getCategories = () => {
      api.getCategories()
        .then((response) => {
          catList.value = response.data
        }, (err) => {
          console.log(err)

        });

    }

    const getAllEvents = () => {
      api.getAllEvents(sortOptions.value)
          .then((response) => {

            tableData.value = response.data

            if (!showAlreadyHappened.value) {
              for (let i = 0; i < tableData.value.length; i++) {
                const now = new Date()
                console.log(Date.parse(tableData.value[i].date) < now)
                if (Date.parse(tableData.value[i].date) < now) {
                  tableData.value.splice(i, 1);
                  i--;
                }
              }
            }

            for (const row in tableData.value) {
              console

              tableData.value[row].hostName = `${tableData.value[row].organizerFirstName} ${tableData.value[row].organizerLastName}`
              tableData.value[row].date = tableData.value[row].date.slice(0, -8)
              tableData.value[row].date = tableData.value[row].date.replace("T", ", ")


              for (const cat in tableData.value[row].categories) {
                for (const catId in catList.value)
                  if (catList.value[catId].id == tableData.value[row].categories[cat]) {
                    tableData.value[row].categories[cat] = " " + catList.value[catId].name
                  }
              }


              api.getEventImage(tableData.value[row].eventId)
                  .then((response) => {

                    let imageURL = "data:"
                    imageURL += response.headers['content-type']
                    imageURL += ";base64,"
                    imageURL += Buffer.from(response.data, 'binary').toString('base64')

                    tableData.value[row].eventImageURL = imageURL

                  }, (err) => {
                    console.log(err)


                  });

              api.getEvent(tableData.value[row].eventId)
                  .then((response) => {
                    api.getUserImage(response.data.organizerId)
                        .then((response) => {
                          let imageURL = "data:"
                          imageURL += response.headers['content-type']
                          imageURL += ";base64,"
                          imageURL += Buffer.from(response.data, 'binary').toString('base64')
                          tableData.value[row].hostImageURL = imageURL

                        }, () => {
                          tableData.value[row].hostImageURL = '/img/defaultProfile.d8a851d0.jpg'


                        });

                  }, (err) => {
                    console.log(err)


                  });
            }

          }, (err) => {
            console.log(err)


          });
    }

    const sortOptionsSet = (props) => {
      if (props.prop === null && props.order === null) {
        sortOptions.value = "DATE_DESC"
      } else if (props.prop === 'date' && props.order === 'descending') {
        sortOptions.value = "DATE_DESC"
      } else if (props.prop === 'date' && props.order === 'ascending') {
        sortOptions.value = "DATE_ASC"
      } else if (props.prop === 'numAcceptedAttendees' && props.order === 'ascending') {
        sortOptions.value = "ATTENDEES_ASC"
      } else if (props.prop === 'numAcceptedAttendees' && props.order === 'descending') {
        sortOptions.value = "ATTENDEES_DESC"
      }
      searchRequest()
    }


    const eventRouter = (row) => {
      router.push(`/events/${row.eventId}`)
    }

    const pagedTableData = computed(() => {
      return tableData.value.slice(pageSize.value * pageNum.value - pageSize.value, pageSize.value * pageNum.value)
    });

    const setPage = (pageNumber) => {
      pageNum.value = pageNumber;
    }

    const pageReady = () => {
      dataReady.value = true
    }

    onMounted(() => {
      getCategories()
      getAllEvents()
      setTimeout(pageReady, 200)
    });



    return {
      dataReady,
      searchInput,
      tableData,
      searchRequest,
      setPage,
      pagedTableData,
      eventRouter,
      filterOptions,
      catList,
      sortOptionsSet,
      showAlreadyHappened
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