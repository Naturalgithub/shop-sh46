<template>
  <div class="login">
    <el-form ref="form" :model="form" :rules="rules" status-icon label-width="80px">
      <img class="loginimg" src="../assets/u=1971562986,2214539904&fm=58&bpow=600&bpoh=800.jpg" alt />
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入您的用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入您的密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">提交</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
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
            message: '长度在3到12位之间',
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
            message: '长度在3到12位之间',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.form.resetFields()
    },

    login () {
      this.$refs.form.validate(isVlid => {
        if (!isVlid) return
        axios({
          method: 'post',
          url: 'http://localhost:8888/api/private/v1/login',
          data: this.form
        }).then(res => {
          const { meta, data } = res.data
          // console.log(msg)
          if (meta.status === 200) {
            console.log(meta.msg)
            this.$message({
              message: meta.msg,
              type: 'success'
            })
            // console.log(this.$router)
            console.log(data)
            localStorage.setItem('token', data.token)

            this.$router.push({ name: 'index' })
          } else {
            console.log(meta.msg)
            this.$message.error(meta.msg)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    background-color: #fff;
    padding: 20px;
    padding-top: 75px;
    margin: 200px auto;
    border-radius: 20px;
    position: relative;
    img {
      position: absolute;
      width: 120px;
      height: 120px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 50%;
      top: -70px;
      border: 5px solid #fff;
    }
  }
}
</style>
