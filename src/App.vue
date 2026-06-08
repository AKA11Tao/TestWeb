<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import {
  Document,
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const menuItems = [
  { path: '/contract', title: '合同验收管理', icon: Document },
]

const handleMenuSelect = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="app-container">
    <!-- 侧边栏 -->
    <el-aside width="220px" class="sidebar">
      <div class="logo">
        <img alt="Vue logo" class="logo-img" src="@/assets/logo.svg" />
        <span class="logo-text">管理系统</span>
      </div>
      <el-menu
        :default-active="route.path"
        class="sidebar-menu"
        background-color="#001529"
        text-color="rgba(255,255,255,0.65)"
        active-text-color="#fff"
        @select="handleMenuSelect"
      >
        <el-menu-item
          v-for="item in menuItems"
          :key="item.path"
          :index="item.path"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container class="main-container">
      <!-- 顶部导航 -->
      <el-header class="header">
        <div class="header-content">
          <span class="breadcrumb">{{ route.meta.title }}</span>
        </div>
      </el-header>

      <!-- 内容区域 -->
      <el-main class="content">
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  background-color: #001529;
  transition: width 0.3s;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  background-color: #002140;
  padding: 0 16px;
}

.logo-img {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.logo-text {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
}

.sidebar-menu {
  border-right: none;
  width: 100%;
}

.sidebar-menu .el-menu-item {
  height: 50px;
  line-height: 50px;
}

.sidebar-menu .el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #1890ff;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  padding: 0 24px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.breadcrumb {
  font-size: 16px;
  font-weight: 500;
  color: #262626;
}

.content {
  background-color: #f0f2f5;
  padding: 0;
  overflow-y: auto;
}
</style>
