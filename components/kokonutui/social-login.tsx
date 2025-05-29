"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export function SocialLogin() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const { loginWithGoogle } = useAuth()
  const router = useRouter()

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true)
    setError("")
    try {
      // 使用 Google 登录
      const user = await loginWithGoogle()
      // 获取 ID 令牌
      const idToken = await user.getIdToken()
      // 调用后端接口设置 session cookie
      const res = await fetch("http://localhost:8000/api/auth/sessionLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idToken })
      })
      const data = await res.json()
      if (data.status === "success") {
        router.push("/dashboard")
        }
       else {
        setError("会话创建失败")
      }
    } catch (error) {
      console.error("Google sign-in error:", error)
      setError("Google 登录失败，请稍后重试")
    } finally {
      setIsGoogleLoading(false)
    }
  }

  function GoogleIcon() {
    return (
      <svg
        className="mr-2 h-4 w-4"
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="google"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 488 512"
      >
        <path
          fill="currentColor"
          d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
        ></path>
      </svg>
    )
  }

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full border-neutral-200 dark:border-neutral-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-black px-2 text-neutral-600 dark:text-neutral-400">或者继续使用</span>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center">{error}</div>
      )}

      <Button
        variant="outline"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
        className="w-full h-12 font-medium border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:bg-black dark:hover:bg-neutral-900 transition-colors"
      >
        {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
        {isGoogleLoading ? "连接中..." : "使用谷歌账号登录"}
      </Button>
    </>
  )
}
