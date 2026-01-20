<script setup>
import { onMounted, ref } from 'vue'
import { userInfoService } from '@/api/user.js'
const userInfo = ref({})
onMounted(
  async () => {
    const res = await userInfoService()
    userInfo.value = res.data.data.data
  }
)
</script>


<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="300px">
        <el-menu
        default-active="$router.path"
        style="margin-top: 50px;"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
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

        <el-menu-item index="/privilege/getArticleInQueue">
          <el-icon><setting /></el-icon>
          <span>审批</span>
        </el-menu-item>

        <el-sub-menu index="1">
        <template #title>
            <el-icon><location /></el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item-group title="">
            <el-menu-item index="/user/profile">详细资料</el-menu-item>
            <el-menu-item index="/user/password">密码修改</el-menu-item>
            <el-menu-item index="/user/manage">文章管理</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
      </el-menu>
      </el-aside>
      <el-main>
        <div id="header"> 
           <span id="author">Hello，{{ userInfo.Account }}</span>
        </div>
        <router-view></router-view> 
      </el-main>
    </el-container>
  </div>
    
</template>

<style scoped>
.el-aside{
  opacity: 0.8;
}
#header{
  display: inline-block;
  text-align: end;
  height: 50px;
  width: 100%;
  background-color: rgba(255, 255, 255, .8);
  line-height: 50px;
}
#author {
  height: 10px;
}
</style>