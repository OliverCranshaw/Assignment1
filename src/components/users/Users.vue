<template>
  <el-table
      :data="users"
      style="width: 100%">
    <el-table-column
        prop="firstName"
        label="First Name"
        width="180">
    </el-table-column>
    <el-table-column
        prop="lastName"
        label="Last Name"
        width="180">
    </el-table-column>
  </el-table>
</template>


<script>
import api from "../../Api"
import {ref, onMounted} from 'vue'
import { useRoute } from 'vue-router';

export default {
  name: 'Users',
  setup() {
    const error = ref("");
    const errorFlag = ref(false);
    const users = ref([])
    const route = useRoute();
    const id = route.params.id;
    const getUsers = () => {
      api.getUser(id)
          .then((response) => {
            users.value = [response.data];
          }, (err) => {
            error.value = err;
            errorFlag.value = true;
          });
    }
    onMounted(getUsers)
    return {
      error,
      errorFlag,
      users,
    }
  }
}


</script>
