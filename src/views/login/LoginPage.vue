<script setup>
import { Lock, User, Message } from '@element-plus/icons-vue';
import { ref } from 'vue'
import { userRegisterService, userLoginService, getVerifyCode } from '@/api/user.js'
import { useUserStore } from '@/stores';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter()

const flag = ref(true)
const convert = () => flag.value = !flag.value

const formModel = ref({
  email: '',
  account: '',
  password: '',
  repassword: '',
  name: '',
  verifyCode: ''
})
const rules = {
  email: [
    {required: true, message: '请输入邮箱', trigger: 'blur'}
  ],
  account: [
    {required: true, message: '请输入账号', trigger: 'blur'},
    {min: 5, max: 10, message: '账号是5-10位字符', trigger: 'blur'}
  ],
  name: [
    {required: true, message: '请输入昵称', trigger: 'blur'},
    {min: 2, max: 10, message: '账号是5-10位字符', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {pattern: /^\S{6,15}$/, message: '密码是6-15非空字符', trigger: 'blur'}
  ],
  repassword: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {pattern: /^\S{6,15}$/, message: '密码是6-15非空字符', trigger: 'blur'},
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次密码不一致'))
        }else{
          callback()
        }
      }
    }
  ]
}

const form = ref()
// 注册
const register = async () => {
  await form.value.validate()
  await userRegisterService(formModel.value)
  ElMessage({
    showClose: true,
    message: '注册成功',
    type: 'success',
  })
}

// 登录
const userStore = useUserStore()

const login = async () => {
  await form.value.validate()
  const res = await userLoginService(formModel.value)
  console.log(res);
  userStore.setToken(res.data.data.token)
  ElMessage({
    showClose: true,
    message: '登录成功',
    type: 'success',
  })
  router.push({
    path: '/'
  })
}

// 获取验证码
const sendVerifyCode = async () => {
  countdown()
  await form.value.validate()
  await getVerifyCode(formModel.value)
  ElMessage({
    showClose: true,
    message: '发送成功',
    type: 'success',
  })
}

// 倒计时验证码
const isDisabled = ref(false)
const countdown = () => {
  isDisabled.value = true
  setTimeout(() => isDisabled.value = false, 1000)
}

</script>    


<template>
  <div>
    <el-row class="row">
      <el-col :span="6" :offset="9">
        <el-form
        ref="form"
        :model="formModel" 
        :rules="rules"
        class="form" 
        v-if="flag"
        >
          <el-form-item>
            <h1>登录</h1>
          </el-form-item>
          <el-form-item prop="account">
            <el-input
            v-model="formModel.account"
            class="inp" 
            placeholder="请输入账号" 
            :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
            v-model="formModel.password"
            show-password
            class="inp"
            placeholder="请输入密码" 
            :prefix-icon="Lock"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="login" :plain="true">登录</el-button>
          </el-form-item>
          <el-form-item>
            <h2 @click="convert">注册</h2>
          </el-form-item>
        </el-form>

        <el-form
        ref="form"
        :model="formModel"
        :rules="rules" 
        class="form"
        v-else
        >
          <el-form-item>
            <h1>注册</h1>
          </el-form-item>
          <el-form-item prop="email">
            <el-input 
            v-model="formModel.email"
            class="inp"
            placeholder="请输入邮箱" 
            :prefix-icon="Message"
            />
          </el-form-item>
          <el-form-item prop="account">
            <el-input
            class="inp" 
            v-model="formModel.account"
            placeholder="请输入账号" 
            :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item prop="name">
            <el-input
            class="inp" 
            v-model="formModel.name"
            placeholder="请输入昵称" 
            :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
            class="inp"
            v-model="formModel.password"
            show-password
            placeholder="请输入密码" 
            :prefix-icon="Lock"
            />
          </el-form-item>
          <el-form-item prop="repassword">
            <el-input 
            class="inp"
            v-model="formModel.repassword"
            show-password
            placeholder="请再次输入密码" 
            :prefix-icon="Lock"
            />
          </el-form-item>
          <el-form-item>
            <el-input
            class="inp" 
            v-model="formModel.verifyCode"
            placeholder="请输入验证码" 
            :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="sendVerifyCode" :disabled="isDisabled">获取验证码</el-button>
            <el-button @click="register">注册</el-button>
          </el-form-item>
          <el-form-item>
            <h2 @click="convert">登录</h2>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template> 

<style scoped>
.row{
  margin-top: 50px;
}
.inp{
  margin-top: 20px;
  height: 40px;
}
h1, h2{
  color: white;
}
button{
  margin: 0 auto;
  margin-top: 20px;
  height: 50px;
  width: 40%;
}
body{
  width: 100%;
  height: 100%;
  background: url(@/assets/img/bgimg.webp) no-repeat;
  background-size: cover;
}
</style>
