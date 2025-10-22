import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function sendOTP(email: string, otp: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your PixelEdit OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; border-radius: 8px;">
          <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #5b21b6; margin-top: 0;">Welcome to PixelEdit</h2>
            <p style="color: #333; font-size: 16px;">Your one-time password (OTP) is:</p>
            <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h1 style="color: #5b21b6; letter-spacing: 5px; font-size: 32px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
            <p style="color: #999; font-size: 12px; margin-bottom: 0;">If you didn't request this code, please ignore this email.</p>
          </div>
        </div>
      `,
    })
    return true
  } catch (error) {
    console.error("Failed to send OTP:", error)
    return false
  }
}
