export const VerificationEmail = (verificationCode: string) => `
<div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px 0; margin: 0;">
  <div style="max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden;">

    <!-- Header -->
    <div style="background-color: #007bff; color: #ffffff; text-align: center; padding: 20px 0;">
      <h1 style="margin: 0; font-size: 24px;">Mira</h1>
    </div>

    <!-- Body -->
    <div style="padding: 30px 20px; color: #333333;">
      <h2 style="color: #007bff; margin-bottom: 10px;">Verify Your Email</h2>
      <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
        Thank you for signing up with <strong>Mira</strong>! To complete your registration,
        please use the verification code below:
      </p>

      <div style="text-align: center; margin: 25px 0;">
        <div style="display: inline-block; background-color: #f0f8ff; border: 2px dashed #007bff;
                    color: #007bff; font-size: 24px; font-weight: bold;
                    letter-spacing: 2px; padding: 15px 30px; border-radius: 8px;">
          ${verificationCode}
        </div>
      </div>

      <p style="font-size: 14px; line-height: 1.5; color: #555;">
        This verification code will expire in <strong>10 minutes</strong>.
      </p>

      <p style="font-size: 13px; color: #888888; margin-top: 25px;">
        If you didn’t create an account with Mira, you can safely ignore this email.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f1f1f1; text-align: center; padding: 15px;
                font-size: 12px; color: #777;">
      &copy; ${new Date().getFullYear()} Mira. All rights reserved.
    </div>

  </div>
</div>
`;
