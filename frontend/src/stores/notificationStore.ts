import { create } from 'zustand'

type NotificationType = 'success' | 'error' | 'info' | 'warning'

interface Notification {
  id: string
  type: NotificationType
  message: string
}

interface NotificationState {
  notifications: Notification[]
  add: (type: NotificationType, message: string) => void
  remove: (id: string) => void
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  add: (type, message) => {
    const id = crypto.randomUUID()
    set((state) => ({
      notifications: [...state.notifications, { id, type, message }],
    }))
    // 3초 후 자동 제거
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }))
    }, 3000)
  },

  remove: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  success: (message) => useNotificationStore.getState().add('success', message),
  error: (message) => useNotificationStore.getState().add('error', message),
  info: (message) => useNotificationStore.getState().add('info', message),
}))
