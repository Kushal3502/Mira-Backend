export const ResetPasswordEmail = (resetLink: string) => `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px 0; margin: 0;">
    <div style="max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden;">

      <div style="background-color: #007bff; color: #ffffff; text-align: center; padding: 20px 0;">
        <h1 style="margin: 0; font-size: 24px;">Mira</h1>
      </div>

      <div style="padding: 30px 20px; color: #333333;">
        <h2 style="color: #007bff; margin-bottom: 10px;">Reset Your Password</h2>
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
          You recently requested to reset your password for your Mira account. Click the button below to reset it:
        </p>

        <div style="text-align: center; margin: 25px 0;">
          <a href="${resetLink}"
            style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none;
            padding: 12px 25px; border-radius: 5px; font-weight: bold;">
            Reset Password
          </a>
        </div>

        <p style="font-size: 14px; line-height: 1.5; color: #555;">
          If the button above doesn’t work, copy and paste the following link in your browser:
        </p>

        <p style="word-break: break-all; color: #007bff; font-size: 14px;">
          ${resetLink}
        </p>

        <p style="font-size: 13px; color: #999999; margin-top: 25px;">
          This link will expire in 1 hour. If you didn’t request a password reset, you can safely ignore this email.
        </p>
      </div>

      <div style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 12px; color: #777;">
        &copy; ${new Date().getFullYear()} Mira. All rights reserved.
      </div>
    </div>
  </div>
  `;
