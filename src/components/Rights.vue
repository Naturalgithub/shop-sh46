<template>
  <div class="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="rightList">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限名称"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="level" label="层级">
        <template v-slot:default="{row}">
          <span v-if="row.level==0">一级</span>
          <span v-if="row.level==1">二级</span>
          <span v-if="row.level==2">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightList: []
    }
  },
  created () {
    this.getRightList()
  },
  methods: {
    async getRightList () {
      const { data, meta } = await this.$axios.get('rights/list')
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.rightList = data
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss">
.rights {
  height: 100%;
}
</style>
