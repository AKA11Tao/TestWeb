/**
 * 合同管理 API 模块
 *
 * 当前使用 mock 数据模拟接口调用，接入真实接口时只需：
 * 1. 修改 BASE_URL 为实际后端地址
 * 2. 替换各个 fetchContractApi 调用为真实的 axios/fetch 请求
 * 3. 调整响应数据结构以匹配后端实际格式
 */

import type {
  Contract,
  ContractQuery,
  ContractFormData,
  ApiResponse,
} from '@/types/contract'

// ---- 配置（接入真实接口时修改这里） ----

/** API 基础地址 */
const BASE_URL = '/api/contract'

/** 模拟网络延迟（毫秒），接入真实接口后设为 0 或移除 */
const MOCK_DELAY = 300

// ---- 模拟数据 ----

let mockIdCounter = 4

let mockContracts: Contract[] = [
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
]

// ---- 工具函数 ----

function delay(ms: number = MOCK_DELAY): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function success<T>(data: T): ApiResponse<T> {
  return { code: 200, message: 'success', data }
}

/**
 * 通用 fetch 包装器
 * 接入真实接口时，替换此函数内部的实现为 axios.get / axios.post 等
 */
async function fetchContractApi<T>(
  _endpoint: string,
  _options?: { method?: string; body?: unknown },
): Promise<ApiResponse<T>> {
  // ---- 模拟模式下忽略 endpoint，直接返回内存数据 ----
  await delay()
  throw new Error('Mock API should not be called directly — use the wrapper functions below')
}

// ---- 接口方法 ----

/** 查询合同列表 */
export async function getContractList(params?: ContractQuery): Promise<ApiResponse<Contract[]>> {
  // TODO: 接入真实接口时替换为:
  //   return fetchContractApi<Contract[]>(`${BASE_URL}/list`, { params })
  await delay()
  let result = [...mockContracts]
  if (params?.contractNo) {
    const keyword = params.contractNo.toLowerCase()
    result = result.filter((c) => c.contractNo.toLowerCase().includes(keyword))
  }
  if (params?.company) {
    const keyword = params.company.toLowerCase()
    result = result.filter((c) => c.company.toLowerCase().includes(keyword))
  }
  if (params?.status) {
    result = result.filter((c) => c.status === params.status)
  }
  if (params?.manager) {
    const keyword = params.manager.toLowerCase()
    result = result.filter((c) => c.manager.toLowerCase().includes(keyword))
  }
  if (params?.signDate) {
    result = result.filter((c) => c.signDate === params.signDate)
  }
  return success(result)
}

/** 新增合同 */
export async function addContract(data: ContractFormData): Promise<ApiResponse<Contract>> {
  // TODO: 接入真实接口时替换为:
  //   return fetchContractApi<Contract>(`${BASE_URL}/add`, { method: 'POST', body: data })
  await delay()
  const newContract: Contract = {
    id: ++mockIdCounter,
    ...data,
  }
  mockContracts.push(newContract)
  return success(newContract)
}

/** 编辑合同 */
export async function updateContract(id: number, data: ContractFormData): Promise<ApiResponse<Contract>> {
  // TODO: 接入真实接口时替换为:
  //   return fetchContractApi<Contract>(`${BASE_URL}/update/${id}`, { method: 'PUT', body: data })
  await delay()
  const index = mockContracts.findIndex((c) => c.id === id)
  if (index === -1) {
    return { code: 404, message: '合同不存在', data: null as unknown as Contract }
  }
  const updated: Contract = { id, ...data }
  mockContracts[index] = updated
  return success(updated)
}

/** 删除合同 */
export async function deleteContract(id: number): Promise<ApiResponse<null>> {
  // TODO: 接入真实接口时替换为:
  //   return fetchContractApi<null>(`${BASE_URL}/delete/${id}`, { method: 'DELETE' })
  await delay()
  const index = mockContracts.findIndex((c) => c.id === id)
  if (index === -1) {
    return { code: 404, message: '合同不存在', data: null }
  }
  mockContracts.splice(index, 1)
  return success(null)
}
