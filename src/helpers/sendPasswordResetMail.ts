import { transporter } from "../config/nodemailer";
import { resend } from "../config/resend";
import { ResetPasswordEmail } from "../emails/ResetPasswordEmail";

export async function sendPasswordResetMail(resetLink: string, email: string) {
  try {
    if (process.env.NODE_ENV === "development") {
      // --- Use Nodemailer in development ---
      const mailOptions = {
        from: `"Mira" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset Your Password - Mira",
        html: ResetPasswordEmail(resetLink),
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Dev email sent:", info.messageId);
    } else {
      // --- Use Resend in production ---
      await resend.emails.send({
        from: "Mira <onboarding@resend.dev>",
        to: email,
        subject: "Reset Password",
        html: ResetPasswordEmail(resetLink),
      });

      console.log("✅ Prod email sent via Resend!");
    }
  } catch (error) {
    console.error("❌ Failed to send password reset email:", error);
    throw error;
  }
}
