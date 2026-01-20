<script setup>
import { onMounted, ref } from 'vue'
import { userInfoService } from '@/api/user.js'

const userInfo = ref({})

onMounted(async () => {
  const res = await userInfoService()
  userInfo.value = res.data.data.data
})
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="300px" class="aside">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          router
        >
          <el-menu-item index="/article/main">
            <el-icon><setting /></el-icon>
            <span>主页</span>
          </el-menu-item>

          <el-menu-item index="/article/sendArticle">
            <el-icon><setting /></el-icon>
            <span>发帖</span>
          </el-menu-item>

          <el-sub-menu index="1">
            <template id="personal_center_block" #title>
              <el-icon><location /></el-icon>
              <span id="personal_center">个人中心</span>
            </template>
            <el-menu-item class="child" index="/user/profile">详细资料</el-menu-item>
            <el-menu-item class="child" index="/user/password">密码修改</el-menu-item>
            <el-menu-item class="child" index="/user/manage">文章管理</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- 主体 -->
      <el-main class="main">
        <div class="header">
          <span class="author">Hello，{{ userInfo.Name }}</span>
        </div>

        <div class="content">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
/* 整体背景 */
.common-layout {
  min-height: 100vh;
  background-color: #f5f6f7;
}

/* 侧边栏 */
.aside {
  background-color: #1f2937;
}

/* 菜单整体 */
.el-menu {
  border-right: none;
  background-color: transparent;
  margin-top: 40px;
}

/* 普通菜单 & 子菜单标题 */
.el-menu-item,
.el-sub-menu__title {
  color: #d1d5db;
  background-color: transparent !important;
}

/* 子菜单展开后标题（修复“个人中心黑底”） */
.el-sub-menu.is-opened > .el-sub-menu__title {
  background-color: #374151 !important;
  color: #ffffff;
}

/* hover 效果（统一深灰） */
.el-menu-item:hover,
.el-sub-menu__title:hover {
  background-color: #374151 !important;
  color: #ffffff;
}

/* 激活态 —— 改成灰蓝色，不用紫色 */
.el-menu-item.is-active {
  background-color: #334155 !important; /* 高级灰蓝 */
  color: #ffffff;
}

/* 主区域 */
.main {
  padding: 20px;
}

/* header */
.header {
  height: 56px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
}

.author {
  font-weight: 500;
}

/* 内容卡片 */
.content {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  min-height: calc(100vh - 120px);
}

#personal_center {
  color: #ffffff;
}

#personal_center_block:hover {
  background-color: #374151 !important;
}

.child {
  background-color: #374151 !important; /* 高级灰蓝 */
}

/* 个人中心标题 hover / 默认 / 展开态 —— 关键修复 */
:deep(.el-sub-menu__title) {
  background-color: transparent;
  color: #d1d5db;
}

:deep(.el-sub-menu__title:hover) {
  background-color: #374151 !important;
  color: #ffffff;
}

/* 子菜单展开时，标题保持深色 */
:deep(.el-sub-menu.is-opened > .el-sub-menu__title) {
  background-color: #374151 !important;
  color: #ffffff;
}

:deep(.el-sub-menu .el-menu-item) {
  background-color: #374151;
  color: #e5e7eb;
}

:deep(.el-sub-menu .el-menu-item:hover) {
  background-color: #4b5563;
  color: #ffffff;
}

</style>
