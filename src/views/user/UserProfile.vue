<script setup>
import { userAllInfoService } from '@/api/user';
import { ref, onMounted } from 'vue'

const userAllInfo = ref({})
onMounted(
  async () => {
    const res = await userAllInfoService()
    userAllInfo.value = res.data.data.data
    console.log(userAllInfo.value);
  }
)
</script>



<template>
  <div class="container">
    <div><el-image
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      /></div>
    <div>
      <span>账号  {{ userAllInfo.Account }}</span>|<span>邮箱  {{ userAllInfo.Email }}</span>
    </div>
    <div>
      <ul>
        <li>发布文章数{{ userAllInfo.Article }}</li>
        <li>浏览数{{ userAllInfo.Read }}</li>
        <li>点赞数{{ userAllInfo.Like }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.container{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  height: 700px;
  width: 100%;
  background-color: rgba(255, 255, 255, .8);
}

ul{
  display: flex;
  width: 900px;
  justify-content: space-between;
}
li{
  border: 2px solid rgb(6, 117, 137);
  height: 270px;
  width: 270px;
  font-size: large;
  text-align: center ;
  line-height: 150px;
}
span{
  font-size: large;
}
</style>