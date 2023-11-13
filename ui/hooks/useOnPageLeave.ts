import {useEffect} from 'react'

export const useOnPageLeave = (
  callbacks: Array<(...args: Array<any>) => void>,
) => {
  useEffect(() => {
    return () => callbacks.forEach(callback => callback())
  }, [])
}
