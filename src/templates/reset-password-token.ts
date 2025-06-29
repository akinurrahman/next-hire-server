import { APP_NAME, FRONTEND_URL, SUPPORT_EMAIL } from "../constants";

export interface ResetPasswordEmailData {
  token: string;
  fullName: string;
}

export function sendResetPasswordOtp(data: ResetPasswordEmailData): string {
  const {
    token,
    fullName,
  } = data;

  const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🔐 ${APP_NAME}</h1>
        <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Password Reset Request</p>
      </div>
      
      <!-- Content -->
      <div style="padding: 40px 30px;">
        <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">Hello ${fullName}! 👋</h2>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 30px; font-size: 16px;">
          We received a request to reset your password for your ${APP_NAME} account. Click the button below to securely reset your password.
        </p>
        
        <!-- Reset Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: transform 0.2s;">
            🔓 Reset My Password
          </a>
        </div>
        
        <!-- Alternative Link -->
        <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 25px 0;">
          <p style="margin: 0 0 10px 0; font-weight: 600; color: #4a5568; font-size: 14px;">🔗 Alternative Method</p>
          <p style="margin: 0 0 10px 0; color: #666; font-size: 13px;">If the button doesn't work, copy and paste this link:</p>
          <p style="margin: 0; color: #667eea; font-size: 12px; word-break: break-all; font-family: 'Courier New', monospace;">${resetLink}</p>
        </div>
        
        <!-- Security Notice -->
        <div style="background-color: #fffaf0; border: 1px solid #fed7aa; border-radius: 8px; padding: 20px; margin: 25px 0;">
          <p style="margin: 0 0 8px 0; font-weight: 600; color: #c05621; font-size: 14px;">🔒 Security Notice</p>
          <p style="margin: 0; color: #9c4221; font-size: 13px; line-height: 1.5;">
            • This link will expire in 10 minutes for your security<br>
            • If you didn't request this reset, please ignore this email<br>
            • Never share this link with anyone
          </p>
        </div>
        
        <p style="color: #666; line-height: 1.6; margin-top: 30px; font-size: 16px;">
          Once you reset your password, you'll be able to securely access your ${APP_NAME} account again.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #f7fafc; padding: 25px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0 0 15px 0; color: #4a5568; font-size: 16px;">Need help? We're here for you! 💬</p>
        <p style="margin: 0; color: #718096; font-size: 12px;">
          Contact us at <strong>${SUPPORT_EMAIL}</strong><br>
          © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
        </p>
      </div>
    </div>
  `.trim();
}
