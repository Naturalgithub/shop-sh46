<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path:  '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-button class="addRoles" type="success" @click="addRole" plain>添加角色</el-button>
    <!-- roles表格 -->
    <el-table :data="roleList">
      <el-table-column type="expand">
        <template v-slot:default="{ row }">
          <el-row class="out-row" style="border:none;padding-bottom: 0;" v-show="row.children.length===0">
             <el-col :span="24">
               <span>暂无权限</span>
               </el-col >
          </el-row>
          <el-row class="out-row" v-for="l1 in row.children" :key="l1.id" v-show="row.children.length!=0">
            <el-col :span="4">
              <el-tag @close="delRoleRights(row, l1.id)" closable>{{ l1.authName }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="l2" v-for="l2 in l1.children" :key="l2.id">
                <el-col :span="4">
                  <el-tag
                    @close="delRoleRights(row, l2.id)"
                    closable
                    type="success"
                  >{{ l2.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="delRoleRights(row, l3.id)"
                    class="l3"
                    closable
                    type="warning"
                    v-for="l3 in l2.children"
                    :key="l3.id"
                  >{{ l3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <el-button type="primary" plain @click="editRole(row)" icon="el-icon-edit" size="small"></el-button>
          <el-button type="danger" plain @click="delRole(row,$event)" icon="el-icon-delete" size="small"></el-button>
          <el-button type="success" plain size="small" @click="showAssignDialog(row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 展示分配框 -->
    <el-dialog title="分配权限" :visible.sync=" assignVisible" width="30%" @close="handleClose">
      <span>
        <!-- 树状data -->
        <el-tree
          node-key="id"
          ref="tree"
          :data="treeData"
          :props="defaultProps"
          @node-click="handleNodeClick"
          default-expand-all
          show-checkbox
        ></el-tree>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRoles">分 配</el-button>
      </span>
    </el-dialog>
    <!-- 添加和编辑角色 -->
    <el-dialog :title="title" :visible.sync="addRoleVisible" width="30%" @close="handleClose">
      <span>
        <el-form :model="addform" :rules="rules" ref="addform" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addform.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleName">
            <el-input v-model="addform.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      assignVisible: false,
      treeData: [],
      roleId: '',
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      title: '添加角色',
      addRoleVisible: false,
      addform: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          {
            required: true,
            message: '角色名称不能为空',
            trigger: ['blur', 'change']
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '角色描述不能为空',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const { meta, data } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.roleList = data
        // console.log(data)
        // this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async delRoleRights (row, id) {
      // console.log(row.id, id)
      const { meta, data } = await this.$axios.delete(
        `roles/${row.id}/rights/${id}`
      )
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async delRole (row, e) {
      if (e.target.nodeName === 'BUTTON') {
        e.target.blur()
      } else {
        e.target.parentNode.blur()
      }
      try {
        await this.$confirm('你确定要删除该角色么?', '提示', {
          type: 'warning'
        })
        console.log(row.id)
        const { meta } = await this.$axios.delete(`roles/${row.id}`)
        if (meta.status === 200) {
          this.getRoleList()
          this.$message.success(meta.msg)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        this.$message.info('取消删除')
        console.log(e)
      }
    },
    async showAssignDialog (row) {
      this.assignVisible = true
      const { meta, data } = await this.$axios.get(`rights/tree`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.treeData = data
        this.roleId = row.id
        // console.log(data)

        const ids = []
        row.children.forEach(item => {
          item.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              ids.push(l3.id)
            })
          })
        })
        console.log(ids)
        this.$refs.tree.setCheckedKeys(ids)
      } else {
        this.$message.error('meta.msg')
      }
    },
    // 关闭的时候执行
    handleClose () {
      this.$refs.addform.resetFields()
    },
    handleNodeClick (data) {
      console.log(data)
    },
    async assignRoles () {
      const checkkey = this.$refs.tree.getCheckedKeys()
      const halfkey = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...checkkey, ...halfkey].join(',')
      // const roleId
      console.log(this.roleId)

      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, {
        rids
      })
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.assignVisible = false
        this.getRoleList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 点击添加角色按钮
    addRole () {
      this.addform.id = ''
      this.addRoleVisible = true
    },
    // 确定添加或修改,开始发ajax
    async sure () {
      let method = 'post'
      let path = 'roles'
      if (this.title === '添加角色') {
        method = 'post'
        path = 'roles'
      } else {
        method = 'put'
        path = `roles/${this.addform.id}`
      }
      const { meta } = await this.$axios[method](path, this.addform)
      if (meta.status === 201 || meta.status === 200) {
        this.$message.success(meta.msg)
        this.getRoleList()
      } else {
        this.$message.error(meta.msg)
      }
      this.addRoleVisible = false
    },
    editRole (row) {
      this.title = '修改角色'
      this.addRoleVisible = true
      console.log(row)
      this.$nextTick(() => {
        this.addform.id = row.id
        this.addform.roleName = row.roleName
        this.addform.roleDesc = row.roleDesc
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.roles {
  .out-row {
    border-bottom: 1px dashed #ccc;
    margin-top: 10px;
    padding-bottom: 20px;
  }
  .l1 {
    margin-right: 5px;
  }
  .l2 {
    margin-right: 5px;
  }
  .l3 {
    margin-right: 5px;
    margin-bottom: 5px;
  }
  .addRoles {
    margin-bottom: 10px;
  }
}
</style>
