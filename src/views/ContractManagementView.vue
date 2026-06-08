<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'

interface Contract {
  id: number
  contractNo: string
  company: string
  status: '未验收' | '验收中' | '已验收未回款' | '已验收已回款'
  manager: string
  signDate: string
}

// 筛选表单
const formRef = ref<FormInstance>()
const searchForm = reactive({
  contractNo: '',
  company: '',
  status: '',
  manager: '',
  signDate: '',
})

// 表格数据
const tableData = ref<Contract[]>([
  {
    id: 1,
    contractNo: 'HT202601001',
    company: '某某科技有限公司',
    status: '已验收已回款',
    manager: '张三',
    signDate: '2026-01-15',
  },
  {
    id: 2,
    contractNo: 'HT202602002',
    company: '北京创新股份有限公司',
    status: '验收中',
    manager: '李四',
    signDate: '2026-02-20',
  },
  {
    id: 3,
    contractNo: 'HT202603003',
    company: '上海数据服务有限公司',
    status: '未验收',
    manager: '王五',
    signDate: '2026-03-10',
  },
  {
    id: 4,
    contractNo: 'HT202604004',
    company: '广州智能系统有限公司',
    status: '已验收未回款',
    manager: '赵六',
    signDate: '2026-04-05',
  },
])

// 合同状态选项
const statusOptions = [
  { label: '未验收', value: '未验收' },
  { label: '验收中', value: '验收中' },
  { label: '已验收未回款', value: '已验收未回款' },
  { label: '已验收已回款', value: '已验收已回款' },
]

// 表格排序
const sortProp = ref<string>('')
const sortOrder = ref<string>('')

// 搜索
const handleSearch = () => {
  ElMessage.info('搜索功能待实现')
}

// 重置
const handleReset = () => {
  formRef.value?.resetFields()
}

// 新增
const handleAdd = () => {
  ElMessage.info('新增功能待实现')
}

// 编辑
const handleEdit = (row: Contract) => {
  ElMessage.info(`编辑：${row.contractNo}`)
}

// 删除
const handleDelete = (row: Contract) => {
  ElMessageBox.confirm(`确定要删除合同 "${row.contractNo}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    tableData.value = tableData.value.filter((item) => item.id !== row.id)
    ElMessage.success('删除成功')
  })
}

// 状态样式
const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    '未验收': 'status-pending',
    '验收中': 'status-processing',
    '已验收未回款': 'status-warning',
    '已验收已回款': 'status-success',
  }
  return statusMap[status] || ''
}
</script>

<template>
  <div class="contract-management">
    <!-- 筛选区域 -->
    <el-card class="search-card">
      <el-form ref="formRef" :model="searchForm" :inline="true">
        <el-form-item label="合同编号">
          <el-input v-model="searchForm.contractNo" placeholder="请输入合同编号" clearable />
        </el-form-item>
        <el-form-item label="甲方公司">
          <el-input v-model="searchForm.company" placeholder="请输入甲方公司" clearable />
        </el-form-item>
        <el-form-item label="合同状态">
          <el-select v-model="searchForm.status" placeholder="请选择合同状态" clearable>
            <el-option
              v-for="opt in statusOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="合同负责人">
          <el-input v-model="searchForm.manager" placeholder="请输入合同负责人" clearable />
        </el-form-item>
        <el-form-item label="合同签订时间">
          <el-date-picker
            v-model="searchForm.signDate"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            style="width: 180px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card">
      <div class="table-header">
        <span class="table-title">合同列表</span>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        @sort-change="({ prop, order }: { prop?: string; order?: string }) => { sortProp = prop ?? ''; sortOrder = order ?? '' }"
      >
        <el-table-column prop="contractNo" label="合同编号" min-width="120" />
        <el-table-column prop="company" label="甲方公司" min-width="200" />
        <el-table-column prop="status" label="合同状态" min-width="120">
          <template #default="{ row }">
            <el-tag :class="getStatusClass(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="manager" label="合同负责人" min-width="100" />
        <el-table-column
          prop="signDate"
          label="合同签订时间"
          min-width="140"
          sortable="custom"
        />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.contract-management {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  min-height: 500px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-title {
  font-size: 16px;
  font-weight: 600;
}

:deep(.status-pending) {
  background-color: #f5f5f5;
  border-color: #dcdfe6;
  color: #606266;
}

:deep(.status-processing) {
  background-color: #e6f7ff;
  border-color: #91d5ff;
  color: #1890ff;
}

:deep(.status-warning) {
  background-color: #fff7e6;
  border-color: #ffd591;
  color: #fa8c16;
}

:deep(.status-success) {
  background-color: #f6ffed;
  border-color: #b7eb8f;
  color: #52c41a;
}
</style>
