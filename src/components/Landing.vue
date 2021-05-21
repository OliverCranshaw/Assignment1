<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <main style="padding-top: 50px">
      <div align="center">
        <h1>Welcome to Events App</h1>
      </div>
    </main>
  </el-container>
</template>


<script>
import Header from "@/components/Header";

export default {
  name: "Landing",
  components: {
    Header
  },
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