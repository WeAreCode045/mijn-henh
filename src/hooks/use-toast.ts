
// This is the primary toast implementation that our UI components import from
import { useState, useCallback } from 'react'
import { TOAST_TYPES, type Toast } from '@/components/ui/toast'

type ToasterToast = Toast & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive" | "success" | "warning"
}

const TOAST_LIMIT = 20
let count = 0

function generateId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return String(count)
}

type UseToastReturn = {
  toasts: ToasterToast[]
  toast: (props: Omit<ToasterToast, "id"> & { id?: string }) => void
  dismiss: (toastId: string) => void
}

export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<ToasterToast[]>([])

  const toast = useCallback(
    (props: Omit<ToasterToast, "id"> & { id?: string }) => {
      const id = props?.id ?? generateId()

      setToasts((toasts) => {
        const newToast = {
          ...props,
          id,
        } as ToasterToast

        const newToasts = [newToast, ...toasts].slice(0, TOAST_LIMIT)
        return newToasts
      })

      return id
    },
    []
  )

  const dismiss = useCallback((toastId: string) => {
    setToasts((toasts) => toasts.filter((t) => t.id !== toastId))
  }, [])

  return {
    toasts,
    toast,
    dismiss,
  }
}

// Toast function for use outside of React components
type ToastProps = Omit<ToasterToast, "id"> & { id?: string }
let toastState: UseToastReturn | undefined

const initializeToastState = () => {
  if (typeof window === 'undefined') return
  if (toastState) return toastState

  const listeners = new Set<(toasts: ToasterToast[]) => void>()

  const toasts: ToasterToast[] = []

  toastState = {
    toasts,
    toast: (props) => {
      const id = props?.id ?? generateId()
      const newToast = {
        ...props,
        id,
      } as ToasterToast
      
      toasts.unshift(newToast)
      if (toasts.length > TOAST_LIMIT) {
        toasts.pop()
      }
      
      listeners.forEach((listener) => listener([...toasts]))
      
      return id
    },
    dismiss: (toastId) => {
      const index = toasts.findIndex((t) => t.id === toastId)
      if (index !== -1) {
        toasts.splice(index, 1)
        listeners.forEach((listener) => listener([...toasts]))
      }
    },
  }

  return toastState
}

export const toast = (props: ToastProps) => {
  const state = initializeToastState()
  if (!state) return ''
  return state.toast(props)
}
