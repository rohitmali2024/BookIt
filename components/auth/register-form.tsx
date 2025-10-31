"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export default function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      await register(name, email, password)
      router.push("/experiences")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <label className="block text-sm font-medium mb-2">Full Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
      </div>

      {error && <div className="text-error text-sm">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary cursor-pointer hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Register"}
      </button>

      <p className="text-center text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:text-primary-dark font-semibold">
          Login
        </Link>
      </p>
    </form>
  )
}
