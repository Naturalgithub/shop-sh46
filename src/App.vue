<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
body,
html,
#app {
  width: 100%;
  height: 100%;
}
.index .el-breadcrumb {
  // height: 100%;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #c5c5c5;
  margin-bottom: 10px;
}
</style>
