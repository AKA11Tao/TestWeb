/** 合同状态 */
export type ContractStatus = '未验收' | '验收中' | '已验收未回款' | '已验收已回款'

/** 合同列表项 */
export interface Contract {
  id: number
  contractNo: string
  company: string
  status: ContractStatus
  manager: string
  signDate: string
}

/** 合同查询参数 */
export interface ContractQuery {
  contractNo?: string
  company?: string
  status?: string
  manager?: string
  signDate?: string
}

/** 新增/编辑合同的表单数据（不含 id） */
export interface ContractFormData {
  contractNo: string
  company: string
  status: ContractStatus
  manager: string
  signDate: string
}

/** 通用 API 响应结构 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

/** 分页参数 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/** 分页响应 */
export interface PaginatedData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/** 合同状态选项（供 el-select 使用） */
export const statusOptions = [
  { label: '未验收', value: '未验收' as ContractStatus },
  { label: '验收中', value: '验收中' as ContractStatus },
  { label: '已验收未回款', value: '已验收未回款' as ContractStatus },
  { label: '已验收已回款', value: '已验收已回款' as ContractStatus },
]

/** 状态对应的 el-tag 样式 class */
export const statusClassMap: Record<ContractStatus, string> = {
  '未验收': 'status-pending',
  '验收中': 'status-processing',
  '已验收未回款': 'status-warning',
  '已验收已回款': 'status-success',
}