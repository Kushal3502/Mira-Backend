import { transporter } from "../config/nodemailer";
import { resend } from "../config/resend";
import { ResetPasswordEmail } from "../emails/ResetPasswordEmail";
import { VerificationEmail } from "../emails/VerificationEmail";

const isDev = process.env.NODE_ENV !== "production";

export const EmailHelper = {
  sendPasswordResetMail: async (resetLink: string, email: string) => {
    const payload = {
      to: email,
      subject: "Reset Your Password - Mira",
      html: ResetPasswordEmail(resetLink),
    };

    try {
      if (isDev) {
        const info = await transporter.sendMail({
          from: `"Mira" <${process.env.EMAIL_USER}>`,
          ...payload,
        });
        console.log("Email (dev) sent:", info.messageId);
      } else {
        await resend.emails.send({
          from: "Mira <onboarding@resend.dev>",
          ...payload,
        });
        console.log("Email (prod) sent via Resend!");
      }
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      throw error;
    }
  },

  sendVerificationEmail: async (
    email: string,
    username: string,
    verificationCode: string
  ) => {
    const payload = {
      to: email,
      subject: "Verify Your Email - Mira",
      html: VerificationEmail(verificationCode),
    };

    try {
      if (isDev) {
        const info = await transporter.sendMail({
          from: `"Mira" <${process.env.EMAIL_USER}>`,
          ...payload,
        });
        console.log("Email (dev) sent:", info.messageId);
      } else {
        await resend.emails.send({
          from: "Mira <onboarding@resend.dev>",
          ...payload,
        });
        console.log("Email (prod) sent via Resend!");
      }
    } catch (error) {
      console.error("Failed to send verification email:", error);
      throw error;
    }
  },
};
