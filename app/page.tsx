"use client"

import { useEffect } from "react"
import AuthBasic from "../components/kokonutui/auth-basic"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export default function SyntheticV0PageForDeployment() {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    // 如果用户已登录且页面加载完成，则重定向到dashboard
    if (user && !loading) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  // 如果正在加载或已登录，返回null，避免闪烁
  if (loading || user) {
    return null
  }
  
  // 未登录时显示登录页面
  return <AuthBasic />
}