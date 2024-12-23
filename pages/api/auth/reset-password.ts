// File: pages/api/auth/reset-password.ts
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../../../models/User";
import connectDB from "../../../utils/db";

const resetPasswordHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  if (req.method === "POST") {
    const { token, newPassword } = req.body;

    try {
      const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

      // Find user with valid token
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }, // Token must not be expired
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Update password
      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      res.status(500).json({ message: "Error resetting password", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default resetPasswordHandler;
