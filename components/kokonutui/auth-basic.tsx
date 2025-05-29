import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthForm } from "./auth-form"
import { SocialLogin } from "./social-login"
import Link from "next/link"

export default function AuthBasic() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-white dark:bg-black">
      <div className="w-full max-w-[450px]">
        <Card className="w-full border-0 shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-semibold tracking-tight text-black dark:text-white">
              欢迎使用 VibeSub
            </CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              请输入您的账号信息进行登录
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <AuthForm />
            <SocialLogin />
          </CardContent>
          <CardFooter className="flex justify-center">
            {/* <div className="text-center text-sm text-neutral-600 dark:text-neutral-400">
              还没有账号？<Link href="/signup" className="text-blue-600 hover:underline">立即注册</Link>
            </div> */}
            <div className="text-center text-sm text-neutral-600 dark:text-neutral-400">
              还没有账号？<a href="/signup" className="text-blue-600 hover:underline">立即注册</a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
