import LoginForm from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="bg-background rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back</h1>
        <p className="text-muted-foreground text-center mb-8">Sign in to your BookIt account</p>
        <LoginForm />
      </div>
    </div>
  )
}
