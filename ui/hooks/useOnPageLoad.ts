'use client'
import { useEffect } from 'react'

export const useOnPageLoad = (
  callbacks: Array<(...args: Array<any>) => void>,
) => {
  useEffect(() => {
    callbacks.forEach(callback => callback())
  }, [])
}
