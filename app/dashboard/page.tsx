"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { RefreshCw } from "lucide-react"

// 定义用户限额信息类型
interface UserLimitInfo {
  daily_limit: number
  used_today: number
}

export default function DashboardPage() {
  // 使用auth hook获取用户信息和登出功能
  const { user, logout, getIdToken } = useAuth()
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)
  const [limitInfo, setLimitInfo] = useState<UserLimitInfo | null>(null)
  const [isLoadingLimit, setIsLoadingLimit] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // 获取用户限额信息
  const fetchUserLimitInfo = async () => {
    try {
      setIsLoadingLimit(true)
      const idToken = await getIdToken()
      
      const response = await fetch("https://api.rxaigc.com/api/tasks/limit/info", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json"
        },
        credentials: "include"
      })
      
      if (response.ok) {
        const data = await response.json()
        setLimitInfo(data)
      } else {
        console.error("获取限额信息失败:", response.status)
      }
    } catch (error) {
      console.error("获取限额信息失败:", error)
    } finally {
      setIsLoadingLimit(false)
    }
  }

  // 组件加载时获取限额信息
  useEffect(() => {
    if (user) 
      // 先保持 loading 状态
      setIsLoadingLimit(true)
      const timer = setTimeout(() => {
        fetchUserLimitInfo()
      }, 3000)  // 延迟 2000ms
  
      return () => clearTimeout(timer)
    }, [user])
  
  
  // 处理登出
  const handleLogout = async () => {
    try {
      // 调用服务端接口清除 session cookie
      await fetch("https://api.rxaigc.com/api/auth/sessionLogout", {
        method: "POST",
        credentials: "include"
      })
      
      // 调用 Firebase logout
      await logout()
      
      // 登出后重定向到登录页
      router.push("/")
    } catch (error) {
      console.error("登出失败", error)
    }
  }

  // 切换下拉菜单显示状态
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  // 点击页面其他区域关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // 计算使用情况
  const usage = limitInfo?.used_today || 0
  const maxUsage = limitInfo?.daily_limit || 0
  const usagePercentage = maxUsage > 0 ? (usage / maxUsage) * 100 : 0

  // 用户数据
  const userData = {
    id: user?.email || "user_12345",
    name: user?.displayName || "用户名",
    usage,
    maxUsage,
  }

  // 获取用户头像显示内容
  const getAvatarContent = () => {
    if (user?.email) {
      // 显示邮箱的第一个字符
      return user.email.charAt(0).toUpperCase()
    }
    return "U" // 默认显示 U
  }

  // 生成头像背景色（基于用户邮箱哈希）
  const getAvatarBgColor = () => {
    return "bg-[#1A4B84]"
  }

  return (
    <div className="flex min-h-screen bg-background flex-col">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="#">
              <span className="font-bold text-2xl">VibeSub</span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="flex items-center relative" ref={dropdownRef}>
              <Button variant="ghost" size="icon" className="mr-2" onClick={toggleDropdown}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || ""} alt="用户头像" />
                  <AvatarFallback className={`${getAvatarBgColor()} text-white font-semibold`}>
                    {getAvatarContent()}
                  </AvatarFallback>
                </Avatar>
              </Button>
              
              {showDropdown && (
                <div className="absolute right-0 top-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      退出登录
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-full lg:col-span-2">
            <CardHeader>
              
              <CardDescription>查看您的账户信息和使用情况</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">用户ID</div>
                  <Badge variant="outline">{userData.id}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">当前使用量</div>
                  <div className="flex items-center gap-2">
                    {isLoadingLimit ? (
                      <div className="text-sm text-muted-foreground">加载中...</div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {userData.usage}/{userData.maxUsage}
                      </div>
                    )}
                    <Button
                      onClick={fetchUserLimitInfo}
                      variant="ghost"
                      size="sm"
                      disabled={isLoadingLimit}
                      className="h-6 w-6 p-0 hover:bg-muted/50"
                    >
                      <RefreshCw className={`h-3 w-3 ${isLoadingLimit ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
                {!isLoadingLimit && (
                  <Progress value={usagePercentage} className="h-2" />
                )}
              </div>
              <div className="flex gap-2">
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-full lg:col-span-1">
            <CardHeader className="text-center">
              <CardDescription>如需提升使用量请联系我们</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <div className="border rounded-lg p-1 bg-white">
                <Image
                  src="/placeholder.svg?height=180&width=180"
                  alt="联系二维码"
                  width={180}
                  height={180}
                  className="mx-auto"
                />
              </div>
              <p className="text-sm text-center text-muted-foreground">扫描上方二维码联系客服</p>
            </CardContent>
            
          </Card>
        </div>
      </main>
    </div>
  )
}
