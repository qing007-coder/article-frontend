<script setup>
import { Lock, User, Message } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { userRegisterService, userLoginService, getVerifyCode } from '@/api/user.js'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const flag = ref(true)
const convert = () => (flag.value = !flag.value)

const formModel = ref({
  email: '',
  account: '',
  password: '',
  repassword: '',
  name: '',
  verifyCode: ''
})

const rules = {
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 5, max: 10, message: '账号是5-10位字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 10, message: '昵称是2-10位字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '密码是6-15位非空字符', trigger: 'blur' }
  ],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const form = ref()

// 注册
const register = async () => {
  await form.value.validate()
  await userRegisterService(formModel.value)
  ElMessage.success('注册成功')
  flag.value = true
}

// 登录
const userStore = useUserStore()
const login = async () => {
  await form.value.validate()
  const res = await userLoginService(formModel.value)
  userStore.setToken(res.data.data.token)
  ElMessage.success('登录成功')
  router.push('/')
}

// 验证码
const isDisabled = ref(false)
const sendVerifyCode = async () => {
  isDisabled.value = true
  await getVerifyCode(formModel.value)
  ElMessage.success('验证码已发送')
  setTimeout(() => (isDisabled.value = false), 60_000)
}
</script>

<template>
  <div class="login-container">
    <el-form
      ref="form"
      :model="formModel"
      :rules="rules"
      class="form-card"
    >
      <h1>{{ flag ? '登录' : '注册' }}</h1>

      <!-- 登录 -->
      <template v-if="flag">
        <el-form-item prop="account">
          <el-input
            v-model="formModel.account"
            placeholder="请输入账号"
            :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            show-password
            placeholder="请输入密码"
            :prefix-icon="Lock"
          />
        </el-form-item>

        <el-button type="primary" @click="login">登录</el-button>

        <h2 @click="convert">没有账号？去注册</h2>
      </template>

      <!-- 注册 -->
      <template v-else>
        <el-form-item prop="email">
          <el-input
            v-model="formModel.email"
            placeholder="请输入邮箱"
            :prefix-icon="Message"
          />
        </el-form-item>

        <el-form-item prop="account">
          <el-input
            v-model="formModel.account"
            placeholder="请输入账号"
            :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="name">
          <el-input
            v-model="formModel.name"
            placeholder="请输入昵称"
            :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            show-password
            placeholder="请输入密码"
            :prefix-icon="Lock"
          />
        </el-form-item>

        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            show-password
            placeholder="请再次输入密码"
            :prefix-icon="Lock"
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="formModel.verifyCode"
            placeholder="验证码"
          />
        </el-form-item>

        <div class="btn-group">
          <el-button
            type="primary"
            :disabled="isDisabled"
            @click="sendVerifyCode"
          >
            获取验证码
          </el-button>
          <el-button @click="register">注册</el-button>
        </div>

        <h2 @click="convert">已有账号？去登录</h2>
      </template>
    </el-form>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  /* background: url('@/assets/img/bgimg.webp') no-repeat center center; */
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-card {
  width: 380px;
  padding: 30px 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}

h1 {
  text-align: center;
  margin-bottom: 24px;
  color: #333;
}

h2 {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #409eff;
  cursor: pointer;
}

h2:hover {
  text-decoration: underline;
}

.el-button {
  width: 100%;
  height: 44px;
  margin-top: 12px;
  border-radius: 6px;
}

.btn-group {
  display: flex;
  gap: 12px;
}

.btn-group .el-button {
  flex: 1;
}
</style>
