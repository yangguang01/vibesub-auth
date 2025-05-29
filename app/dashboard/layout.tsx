"use client"

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    )
  }

  // 如果没有用户且加载完成，不渲染任何内容（会被重定向）
  if (!user) {
    return null
  }

  // 如果有用户，渲染dashboard内容
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-7xl px-4 py-8">
        {children}
      </div>
    </div>
  )
} 