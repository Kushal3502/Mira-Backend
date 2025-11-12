import { transporter } from "../config/nodemailer";
import { resend } from "../config/resend";
import VerificationEmail from "../emails/VerificationEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string,
) {
  try {
    if (process.env.NODE_ENV === "development") {
      // --- Use Nodemailer in development ---
      const mailOptions = {
        from: `"Mira" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your email",
        html: `
          <h2>Verify Your Email</h2>
          <p>Your verification code is:</p>
          <h3 style="color: #007bff;">${verificationCode}</h3>
          <p>This code will expire in 10 minutes.</p>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Dev email sent:", info.messageId);
    } else {
      // --- Use Resend in production ---
      await resend.emails.send({
        from: "Mira <onboarding@resend.dev>",
        to: email,
        subject: "Your Mira verification code",
        react: VerificationEmail({ username, verificationCode }),
      });

      console.log("✅ Prod email sent via Resend!");
    }
  } catch (error) {
    console.error("❌ Failed to send verification email:", error);
    throw error;
  }
}
