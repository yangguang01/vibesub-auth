import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SignupForm } from "./signup-form"
import { SocialLogin } from "./social-login"

export default function SignupBasic() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-white dark:bg-black">
      <div className="w-full max-w-[450px]">
        <Card className="w-full border-0 shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-semibold tracking-tight text-black dark:text-white">
              创建账号
            </CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              请填写以下信息完成注册
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <SignupForm />
            <SocialLogin />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 