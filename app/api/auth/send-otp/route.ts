import { type NextRequest, NextResponse } from "next/server"
import { generateOTP } from "@/lib/auth"
import { sendOTP } from "@/lib/email"

// Store OTPs in memory (in production, use a database or Redis)
const otpStore = new Map<string, { otp: string; expiresAt: number }>()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    const otp = generateOTP()
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

    otpStore.set(email, { otp, expiresAt })

    const sent = await sendOTP(email, otp)

    if (!sent) {
      return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "OTP sent to email" })
  } catch (error) {
    console.error("Error sending OTP:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export { otpStore }
