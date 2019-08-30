 <template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框和添加 -->
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入搜索关键字" v-model="query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="searchUser(query)"></el-button>
      </el-input>
      <el-button class="addUser" type="success" plain @click="showDialog">添加用户</el-button>
    </div>
    <!-- 表格 -->
    <el-table style="width: 100%" :data="userlist">
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="mg_state" label="用户状态">
        <template v-slot:default="{row}">
          <!-- {{obj.row}} -->
          <el-switch
            v-model="row.mg_state"
            @change="changeState(row)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop label="操作">
        <template v-slot:default="{row}">
          <el-button
            type="primary"
            @click="showEditDialog(row)"
            plain
            size="small"
            icon="el-icon-edit"
          ></el-button>
          <el-button
            type="danger"
            @click="delUser(row.id)"
            plain
            size="small"
            icon="el-icon-delete"
          ></el-button>
          <el-button type="success" plain size="small">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      background
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="40%">
      <span>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" status-icon>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入手机"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFrom">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改模态框 -->
    <el-dialog title="修改用户" :visible.sync="editVisible" width="40%">
      <span>
        <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px" status-icon>
          <el-form-item label="用户名" prop="username">
            <el-tag type="info">{{ editForm.username }}</el-tag>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" placeholder="请输入邮箱">{{editForm.email}}</el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile" placeholder="请输入手机"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <!-- <el-dialog title="修改用户" :visible.sync="editVisible" width="40%">
      <span>
        <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px" status-icon>
          <el-form-item label="用户名" prop="username">
            <el-tag type="info">{{ editForm.username }}</el-tag>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" placeholder="请输入邮箱">{{editForm.email}}</el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile" placeholder="请输入手机"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  created () {
    this.getUserList()
  },
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      userlist: [],
      total: 0,
      editVisible: false,
      dialogVisible: false,

      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur', 'change']
          },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: ['blur', 'change']
          }
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: ['blur', 'change']
          }
        ]
      },
      editForm: {
        username: '',
        email: '',
        id: '',
        mobile: '',
        role_id: ''
      }
    }
  },
  methods: {
    async getUserList () {
      const { data } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      // console.log(res)
      this.total = data.total
      this.userlist = data.users
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },
    async delUser (id) {
      try {
        await this.$confirm('亲, 你确认要删除么?', '温馨提示', {
          type: 'warning'
        })
        console.log(22)
        const { meta } = await this.$axios.delete(`users/${id}`)
        console.log(meta.status)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          if (this.userlist.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
        this.$message.error('取消删除')
      }
    },
    searchUser () {
      this.pagenum = 1
      this.getUserList()
    },
    async changeState (row) {
      const { meta } = await this.$axios.put(
        `users/${row.id}/state/${row.mg_state}`
      )
      if (meta.status === 200) {
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
        // console.log('失败')
      }
    },
    closeDialog () {
      // this.$ref.form.resetFields()
    },
    showDialog () {
      this.dialogVisible = true
    },
    async addFrom () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('users', this.form)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.dialogVisible = false
          this.getUserList()
          this.$ref.form.resetFields()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    showEditDialog (row) {
      console.log(row)
      this.editVisible = true
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
    },
    async editUser () {
      try {
        await this.$refs.editForm.validate()
        const { id, email, mobile } = this.editForm
        // console.log(id, email, mobile)
        const { meta } = await this.$axios.put(`users/${id}`, { email, mobile })
        console.log(meta)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.editVisible = false
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
          console.log('shibai')
        }
      } catch (e) {
        console.log(e)
        // console.log('shibai')
      }
    }
  }
}
</script>

<style lang="scss">
.users {
  .input-with-select {
    width: 300px;
    margin-bottom: 10px;
  }
  .addUser {
    margin-left: 20px;
  }
  .el-pagination {
    margin-top: 10px;
  }
}
</style>
