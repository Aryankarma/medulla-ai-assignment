"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { OTPLogin } from "@/components/auth/otp-login"

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/editor")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-secondary to-background px-4">
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground">PixelEdit</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Professional image editing made simple. Crop, resize, enhance, and transform your images with powerful tools.
        </p>
      </div>

      <div className="mb-8">
        <OTPLogin />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mt-12">
        <div className="text-center">
          <div className="text-3xl mb-2">✨</div>
          <h3 className="font-semibold mb-2">Easy to Use</h3>
          <p className="text-sm text-muted-foreground">Intuitive interface for all skill levels</p>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-2">🎨</div>
          <h3 className="font-semibold mb-2">Powerful Tools</h3>
          <p className="text-sm text-muted-foreground">Advanced editing features at your fingertips</p>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-2">⚡</div>
          <h3 className="font-semibold mb-2">Fast & Reliable</h3>
          <p className="text-sm text-muted-foreground">Process images instantly in your browser</p>
        </div>
      </div>
    </div>
  )
}
