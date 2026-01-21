<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="260px" class="aside">
        <div class="logo-section">
          <img src="https://element-plus.org/images/element-plus-logo.svg" alt="Logo" class="logo" />
          <span class="system-name">技术社区</span>
        </div>

        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical"
          router
        >
          <el-menu-item index="/article/main">
            <el-icon><House /></el-icon>
            <span>首页大厅</span>
          </el-menu-item>

          <el-menu-item index="/article/sendArticle">
            <el-icon><EditPen /></el-icon>
            <span>发布文章</span>
          </el-menu-item>

          <el-sub-menu index="user-center">
            <template #title>
              <el-icon class="personal_center"><User /></el-icon>
              <span class="personal_center">个人中心</span>
            </template>
            <el-menu-item index="/user/profile">详细资料</el-menu-item>
            <el-menu-item index="/user/password">修改密码</el-menu-item>
            <el-menu-item index="/user/manage">文章管理</el-menu-item>
          </el-sub-menu>

          <div class="menu-footer">
            <el-menu-item @click="handleLogout" class="logout-item">
              <el-icon><SwitchButton /></el-icon>
              <span>退出登录</span>
            </el-menu-item>
          </div>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header class="header">
          <div class="header-left">
            <el-breadcrumb separator="/">
              <!-- <el-breadcrumb-item>控制台</el-breadcrumb-item> -->
              <el-breadcrumb-item>{{ $route.meta.title || '当前页面' }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-dropdown>
              <div class="user-info">
                <span class="author">欢迎您，{{ userInfo.Name || '用户' }}</span>
                <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="$router.push('/user/profile')">个人资料</el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <el-main class="main">
          <div class="content">
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  House, 
  EditPen, 
  User, 
  SwitchButton 
} from '@element-plus/icons-vue'
import { userInfoService } from '@/api/user.js'

const userInfo = ref({})
const router = useRouter()

// 获取用户信息
onMounted(async () => {
  try {
    const res = await userInfoService()
    userInfo.value = res.data.data.data
  } catch (err) {
    console.error("获取用户信息失败", err)
  }
})

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出当前账号吗？', '安全提示', {
    confirmButtonText: '确定退出',
    cancelButtonText: '取消',
    type: 'warning',
    roundButton: true
  }).then(() => {
    // 1. 清除本地存储的 Token
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    
    // 2. 提示并跳转
    ElMessage.success('已安全退出登录')
    router.push('/login')
  }).catch(() => {
    // 点击取消不做任何操作
  })
}
</script>

<style scoped>
.common-layout {
  height: 100vh;
  display: flex;
}

/* 侧边栏整体 */
.aside {
  background-color: #111827; /* 更深邃的背景色 */
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
}

.logo-section {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 12px;
  background-color: #1f2937;
}

.logo {
  width: 30px;
}

.system-name {
  color: #fff;
  font-weight: bold;
  font-size: 18px;
  letter-spacing: 1px;
}

/* 菜单样式 */
.el-menu-vertical {
  border-right: none;
  background-color: transparent;
  flex: 1;
  display: flex;
  flex-direction: column;
}

:deep(.el-menu-item) {
  color: #9ca3af;
}

:deep(.el-menu-item:hover), 
:deep(.el-sub-menu__title:hover) {
  background-color: #374151 !important;
  color: #fff !important;
}

:deep(.el-menu-item.is-active) {
  background-color: #2563eb !important; /* 活跃态为深蓝色 */
  color: #fff !important;
}

/* 退出登录项底部固定 */
.menu-footer {
  margin-top: auto;
  padding-bottom: 20px;
}

.logout-item {
  color: #f87171 !important; /* 柔和的红色 */
}

.logout-item:hover {
  background-color: rgba(239, 68, 68, 0.1) !important;
}

/* Header 顶部栏 */
.header {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  z-index: 10;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.author {
  font-size: 14px;
  color: #374151;
}

/* 主区域内容 */
.main {
  background-color: #f3f4f6;
  padding: 20px;
}

.content {
  background-color: transparent; /* 改为透明，让子页面控制自己的背景 */
  min-height: 100%;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

:deep(.el-sub-menu .el-menu-item) {
  background-color: #111827; /* 子菜单背景与侧边栏一致 */
  padding-left: 50px !important;
}

.personal_center {
  color: #9ca3af;
}
</style>