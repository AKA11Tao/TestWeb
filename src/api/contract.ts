/**
 * 合同管理 API 模块
 *
 * 对接后端 Spring Boot 服务
 * 开发时通过 Vite proxy 转发到 localhost:8080
 */

import type {
  Contract,
  ContractQuery,
  ContractFormData,
  ApiResponse,
} from '@/types/contract'

/** API 基础路径（与后端 Controller 的 @RequestMapping 一致） */
const BASE_URL = '/api/contract'

/**
 * 通用 fetch 包装
 * 生产环境可直接修改 BASE_URL 为完整后端地址
 */
async function request<T>(
  url: string,
  options?: { method?: string; body?: unknown },
): Promise<ApiResponse<T>> {
  const config: RequestInit = {
    method: options?.method ?? 'GET',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  }

  if (options?.body) {
    config.body = JSON.stringify(options.body)
  }

  const res = await fetch(url, config)

  if (!res.ok) {
    return { code: res.status, message: `HTTP ${res.status}: ${res.statusText}`, data: null as unknown as T }
  }

  return res.json()
}

// ---- 接口方法 ----

/** 查询合同列表（支持多条件筛选） */
export async function getContractList(params?: ContractQuery): Promise<ApiResponse<Contract[]>> {
  const query = new URLSearchParams()
  if (params?.contractNo) query.set('contractNo', params.contractNo)
  if (params?.company)    query.set('company', params.company)
  if (params?.status)     query.set('status', params.status)
  if (params?.manager)    query.set('manager', params.manager)
  if (params?.signDate)   query.set('signDate', params.signDate)

  const qs = query.toString()
  return request<Contract[]>(`${BASE_URL}/list${qs ? `?${qs}` : ''}`)
}

/** 新增合同 */
export async function addContract(data: ContractFormData): Promise<ApiResponse<Contract>> {
  return request<Contract>(`${BASE_URL}/add`, { method: 'POST', body: data })
}

/** 编辑合同 */
export async function updateContract(id: number, data: ContractFormData): Promise<ApiResponse<Contract>> {
  return request<Contract>(`${BASE_URL}/update/${id}`, { method: 'PUT', body: data })
}

/** 删除合同 */
export async function deleteContract(id: number): Promise<ApiResponse<null>> {
  return request<null>(`${BASE_URL}/delete/${id}`, { method: 'DELETE' })
}
