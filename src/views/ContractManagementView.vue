<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { Contract, ContractFormData, ContractStatus } from '@/types/contract'
import { statusOptions } from '@/types/contract'
import { getContractList, addContract, updateContract, deleteContract } from '@/api/contract'

// ---- 状态 ----

/** 表格数据（原始全量） */
const tableData = ref<Contract[]>([])

/** 表格加载状态 */
const tableLoading = ref(false)

// ---- 筛选表单 ----

const formRef = ref<FormInstance>()
const searchForm = reactive({
  contractNo: '',
  company: '',
  status: '' as string,
  manager: '',
  signDate: '',
})

/** 加载表格数据（带筛选参数） */
const loadTableData = async () => {
  tableLoading.value = true
  try {
    const params: Record<string, string> = {}
    if (searchForm.contractNo) params.contractNo = searchForm.contractNo
    if (searchForm.company) params.company = searchForm.company
    if (searchForm.status) params.status = searchForm.status
    if (searchForm.manager) params.manager = searchForm.manager
    if (searchForm.signDate) params.signDate = searchForm.signDate

    const res = await getContractList(params)
    if (res.code === 200) {
      tableData.value = res.data
    } else {
      ElMessage.error(res.message || '查询失败')
    }
  } catch {
    ElMessage.error('查询失败')
  } finally {
    tableLoading.value = false
  }
}

// ---- 搜索 & 重置 ----

const handleSearch = () => {
  loadTableData()
}

const handleReset = () => {
  formRef.value?.resetFields()
  searchForm.contractNo = ''
  searchForm.company = ''
  searchForm.status = ''
  searchForm.manager = ''
  searchForm.signDate = ''
  loadTableData()
}

// ---- 新增/编辑弹窗 ----

const dialogVisible = ref(false)
const dialogTitle = ref('新增合同')
const editingId = ref<number | null>(null)
const dialogFormRef = ref<FormInstance>()
const dialogSaving = ref(false)

const dialogForm = reactive({
  contractNo: '',
  company: '',
  status: '' as ContractStatus | '',
  manager: '',
  signDate: '',
})

const formRules: FormRules = {
  contractNo: [{ required: true, message: '请输入合同编号', trigger: 'blur' }],
  company: [{ required: true, message: '请输入甲方公司', trigger: 'blur' }],
  status: [{ required: true, message: '请选择合同状态', trigger: 'change' }],
  manager: [{ required: true, message: '请输入合同负责人', trigger: 'blur' }],
  signDate: [{ required: true, message: '请选择合同签订时间', trigger: 'change' }],
}

const resetDialogForm = () => {
  dialogForm.contractNo = ''
  dialogForm.company = ''
  dialogForm.status = ''
  dialogForm.manager = ''
  dialogForm.signDate = ''
}

const handleAdd = () => {
  editingId.value = null
  dialogTitle.value = '新增合同'
  resetDialogForm()
  dialogVisible.value = true
}

const handleEdit = (row: Contract) => {
  editingId.value = row.id
  dialogTitle.value = '编辑合同'
  dialogForm.contractNo = row.contractNo
  dialogForm.company = row.company
  dialogForm.status = row.status
  dialogForm.manager = row.manager
  dialogForm.signDate = row.signDate
  dialogVisible.value = true
}

const handleSave = async () => {
  const valid = await dialogFormRef.value?.validate().catch(() => false)
  if (!valid) return

  dialogSaving.value = true
  const formData: ContractFormData = {
    contractNo: dialogForm.contractNo,
    company: dialogForm.company,
    status: dialogForm.status as ContractStatus,
    manager: dialogForm.manager,
    signDate: dialogForm.signDate,
  }

  try {
    if (editingId.value !== null) {
      const res = await updateContract(editingId.value, formData)
      if (res.code === 200) {
        ElMessage.success('编辑成功')
      } else {
        ElMessage.error(res.message || '编辑失败')
        return
      }
    } else {
      const res = await addContract(formData)
      if (res.code === 200) {
        ElMessage.success('新增成功')
      } else {
        ElMessage.error(res.message || '新增失败')
        return
      }
    }

    dialogVisible.value = false
    resetDialogForm()
    await loadTableData()
  } catch {
    ElMessage.error(editingId.value !== null ? '编辑失败' : '新增失败')
  } finally {
    dialogSaving.value = false
  }
}

const handleDialogClose = () => {
  dialogFormRef.value?.resetFields()
  resetDialogForm()
}

// ---- 删除 ----

const handleDelete = (row: Contract) => {
  ElMessageBox.confirm(`确定要删除合同 "${row.contractNo}" 吗？此操作不可撤销。`, '删除确认', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        const res = await deleteContract(row.id)
        if (res.code === 200) {
          ElMessage.success('删除成功')
          await loadTableData()
        } else {
          ElMessage.error(res.message || '删除失败')
        }
      } catch {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {
      // 用户取消删除，不做操作
    })
}

// ---- 状态样式（纯 UI，无需接口） ----

const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    '未验收': 'status-pending',
    '验收中': 'status-processing',
    '已验收未回款': 'status-warning',
    '已验收已回款': 'status-success',
  }
  return statusMap[status] || ''
}

// ---- 初始化 ----

onMounted(() => {
  loadTableData()
})
</script>

<template>
  <div class="contract-management">
    <!-- 筛选区域 -->
    <el-card class="search-card">
      <el-form ref="formRef" :model="searchForm" :inline="true">
        <el-form-item label="合同编号">
          <el-input v-model="searchForm.contractNo" placeholder="请输入合同编号" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="甲方公司">
          <el-input v-model="searchForm.company" placeholder="请输入甲方公司" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="合同状态">
          <el-select v-model="searchForm.status" placeholder="请选择合同状态" clearable style="width: 180px">
            <el-option
              v-for="opt in statusOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="合同负责人">
          <el-input v-model="searchForm.manager" placeholder="请输入合同负责人" clearable style="width: 180px" />
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
        v-loading="tableLoading"
        border
        stripe
        style="width: 100%"
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
        <el-table-column prop="signDate" label="合同签订时间" min-width="140" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      :close-on-click-modal="false"
      @close="handleDialogClose"
    >
      <el-form
        ref="dialogFormRef"
        :model="dialogForm"
        :rules="formRules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="合同编号" prop="contractNo">
          <el-input v-model="dialogForm.contractNo" placeholder="请输入合同编号" />
        </el-form-item>
        <el-form-item label="甲方公司" prop="company">
          <el-input v-model="dialogForm.company" placeholder="请输入甲方公司" />
        </el-form-item>
        <el-form-item label="合同状态" prop="status">
          <el-select v-model="dialogForm.status" placeholder="请选择合同状态" style="width: 100%">
            <el-option
              v-for="opt in statusOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="合同负责人" prop="manager">
          <el-input v-model="dialogForm.manager" placeholder="请输入合同负责人" />
        </el-form-item>
        <el-form-item label="签订时间" prop="signDate">
          <el-date-picker
            v-model="dialogForm.signDate"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false" :disabled="dialogSaving">取消</el-button>
          <el-button type="primary" @click="handleSave" :loading="dialogSaving">确认</el-button>
        </span>
      </template>
    </el-dialog>
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
