"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // 使用 Firebase 登录
      const user = await login(email, password)
      // 获取 ID 令牌
      const idToken = await user.getIdToken()
      // 调用后端接口设置 session cookie
      const res = await fetch("https://api.rxaigc.com/api/auth/sessionLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idToken })
      })
      const data = await res.json()
      if (data.status === "success") {
        router.push("/dashboard")
      } else {
        setError("会话创建失败")
      }
    } catch (err) {
      setError("登录失败，请检查您的邮箱和密码")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        登录
      </Button>
    </form>
  )
}
