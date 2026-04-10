import { useState, useCallback } from 'react'
import api from '../lib/api'
import { type AxiosRequestConfig } from 'axios'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

/**
 * 범용 API 호출 훅.
 * TanStack Query 없이 단순 fetch가 필요한 경우 사용.
 */
export function useApi<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const request = useCallback(async (config: AxiosRequestConfig): Promise<T | null> => {
    setState({ data: null, loading: true, error: null })
    try {
      const res = await api(config)
      const data = res.data?.data ?? res.data
      setState({ data, loading: false, error: null })
      return data
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        '요청 처리 중 오류가 발생했습니다'
      setState({ data: null, loading: false, error: message })
      return null
    }
  }, [])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return { ...state, request, reset }
}
