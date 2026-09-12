import { useQuery } from '@tanstack/react-query'

interface HelloResponse {
  message: string
  timestamp: number
}

const fetchHello = async (): Promise<HelloResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 250))
  return {
    message: 'React Query is running smoothly',
    timestamp: Date.now(),
  }
}

export const helloQueryKey = ['hello'] as const

export function useHelloQuery() {
  return useQuery({
    queryKey: helloQueryKey,
    queryFn: fetchHello,
    staleTime: 60 * 1000,
  })
}
