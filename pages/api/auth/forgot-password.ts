// File: pages/api/auth/forgot-password.ts
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../../../models/User";
import connectDB from "../../../utils/db";

const forgotPasswordHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  if (req.method === "POST") {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate a reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      // Send the reset email
      const transporter = nodemailer.createTransport({
        service: "gmail", // or use another email service
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`;
      await transporter.sendMail({
        to: email,
        subject: "Password Reset Request",
        html: `<p>You requested a password reset. Click the link below to reset your password:</p>
               <a href="${resetUrl}">${resetUrl}</a>
               <p>If you did not request this, please ignore this email.</p>`,
      });

      res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
      res.status(500).json({ message: "Error sending password reset email", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default forgotPasswordHandler;
