import { type NextRequest, NextResponse } from "next/server"
import { generateToken } from "@/lib/auth"
import { otpStore } from "@/app/api/auth/send-otp/route"

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP required" }, { status: 400 })
    }

    const storedOTP = otpStore.get(email)

    if (!storedOTP) {
      return NextResponse.json({ error: "OTP not found or expired" }, { status: 400 })
    }

    if (Date.now() > storedOTP.expiresAt) {
      otpStore.delete(email)
      return NextResponse.json({ error: "OTP expired" }, { status: 400 })
    }

    if (storedOTP.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    otpStore.delete(email)
    const token = generateToken(email)

    const response = NextResponse.json({ success: true, token })
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
