<template>
  <el-container class="index">
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <div class="title">电商后台管理系统</div>
      <div class="logout">
        <span>欢迎光临~</span>
        <a href="javascript:;" @click="logout">退出</a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          router
          unique-opened
          default-active="/users"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/users">
              <i class="el-icon-menu"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 权限管理 -->
          <el-submenu index>
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="/roles">
              <i class="el-icon-menu"></i>
              <span slot="title">角色列表</span>
            </el-menu-item>
            <el-menu-item index="/rights">
              <i class="el-icon-menu"></i>
              <span slot="title">权限列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  methods: {
    logout () {
      this.$confirm('您确定退出吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
          localStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(e => {
          this.$message({
            type: 'info'
            // message: '已取消删除'
          })
          console.log(e)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
// .index {
//   height: 100%;
// }
.el-menu {
  border-right: none;
}
.el-container {
  height: 100%;
  .el-header {
    background-color: #d8d8d8;
    display: flex;
    .logo {
      width: 180px;
      img {
        height: 40px;
        margin: 10px;
      }
    }
    .title {
      flex: 1;
      color: #545c64;
      text-align: center;
      line-height: 60px;
      font-size: 24px;
      font-weight: 700;
    }
    .logout {
      line-height: 60px;
      width: 180px;
      font-weight: 700;
      text-align: right;
      span {
        color: black;
      }
      a {
        color: orange;
      }
    }
  }
  .el-container {
    height: 100%;
    .el-aside {
      background-color: #545c64;
    }
    .el-main {
      height: 100%;
      background-color: #ecf0f1;
    }
  }
}
</style>
