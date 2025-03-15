'use client'

import AppLayout from '@/components/AppLayout'

export default function AppTemplate({ children }) {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  )
}
