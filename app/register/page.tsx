import RegisterForm from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="bg-background rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Create Account</h1>
        <p className="text-muted-foreground text-center mb-8">Join BookIt and start exploring</p>
        <RegisterForm />
      </div>
    </div>
  )
}
