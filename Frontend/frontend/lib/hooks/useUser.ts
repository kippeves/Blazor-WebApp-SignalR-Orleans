import useSWR from 'swr'
import { fetcher } from '../fetcher'

export function useUser() {
    const { data, error, isLoading } = useSWR(`https://192.168.2.124:3000/api/auth/session`, fetcher)

    return {
        data,
        isLoading,
        isError: error
    }
}

