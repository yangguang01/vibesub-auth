"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, LockIcon } from "lucide-react"
import { createUserWithEmailAndPassword, getIdToken } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致")
      setIsLoading(false)
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
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
        toast.success("注册成功！")
        router.push("/dashboard")
      } else {
        setError("会话创建失败")
        toast.error("会话创建失败")
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      let errorMessage = "注册失败，请稍后重试"
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "该邮箱已被注册"
      } else if (error.code === "auth/weak-password") {
        errorMessage = "密码强度不够，请至少使用6个字符"
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "邮箱格式不正确"
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-black dark:text-white">
          注册邮箱
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 flex items-center justify-center w-4 h-4">
            @
          </span>
          <Input
            type="email"
            name="email"
            placeholder="name@example.com"
            required
            disabled={isLoading}
            className="pl-10 h-12 bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
            autoComplete="email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-black dark:text-white">密码</label>
        <div className="relative">
          <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="password"
            name="password"
            placeholder="输入密码"
            required
            disabled={isLoading}
            className="pl-10 h-12 bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-black dark:text-white">确认密码</label>
        <div className="relative">
          <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="再次输入密码"
            required
            disabled={isLoading}
            className="pl-10 h-12 bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 text-base font-medium bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "注册中..." : "注册"}
      </Button>
    </form>
  )
} 