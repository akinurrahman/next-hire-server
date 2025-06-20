import { APP_NAME } from "../constants/http-status";

export const generateOtpVerificationEmail = (otp: number) => ({
  text: `Welcome to ${APP_NAME}!\n\nYour OTP is ${otp}. Valid for 10 minutes.`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🚀 ${APP_NAME}</h1>
        <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Welcome to Your Career Journey</p>
      </div>
      
      <!-- Content -->
      <div style="padding: 40px 30px;">
        <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">Welcome! 👋</h2>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 30px; font-size: 16px;">
          Thank you for joining ${APP_NAME}! To complete your registration and secure your account, please use the verification code below:
        </p>
        
        <!-- OTP Container -->
        <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 2px dashed #cbd5e0; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
          <p style="margin: 0 0 15px 0; color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Your Verification Code</p>
          <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 6px; font-family: 'Courier New', monospace; text-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);">${otp}</div>
          <p style="margin: 15px 0 0 0; color: #e53e3e; font-size: 14px; font-weight: 500;">⏰ Valid for 10 minutes only</p>
        </div>
        
        <!-- Instructions -->
        <div style="background-color: #ebf8ff; border-left: 4px solid #3182ce; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
          <p style="margin: 0 0 8px 0; font-weight: 600; color: #2b6cb0; font-size: 16px;">📋 How to verify:</p>
          <p style="margin: 0; color: #2c5282; font-size: 14px; line-height: 1.6;">
            1. Return to the ${APP_NAME} verification page<br>
            2. Enter the code shown above<br>
            3. Click "Verify" to activate your account
          </p>
        </div>
        
        <!-- Security Notice -->
        <div style="background-color: #fffaf0; border: 1px solid #fed7aa; border-radius: 8px; padding: 20px; margin: 25px 0;">
          <p style="margin: 0 0 8px 0; font-weight: 600; color: #c05621; font-size: 14px;">🔒 Security Notice</p>
          <p style="margin: 0; color: #9c4221; font-size: 13px; line-height: 1.5;">
            If you didn't create a ${APP_NAME} account, please ignore this email. This code will expire automatically.
          </p>
        </div>
        
        <p style="color: #666; line-height: 1.6; margin-top: 30px; font-size: 16px;">
          Once verified, you'll have access to personalized job recommendations, resume management, and one-click applications!
        </p>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #f7fafc; padding: 25px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0 0 15px 0; color: #4a5568; font-size: 16px;">Welcome to the ${APP_NAME} family! 🎉</p>
        <p style="margin: 0; color: #718096; font-size: 12px;">
          Need help? Contact us at <strong>support@${APP_NAME}.com</strong><br>
          © 2025 ${APP_NAME}. All rights reserved.
        </p>
      </div>
    </div>
  `,
});
