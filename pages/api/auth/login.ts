// File: pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "../../../utils/db";
import User from "../../../models/User";

const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Validate password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || "default_secret", // Replace with a secure key in .env
        { expiresIn: "1h" }
      );

      res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default loginHandler;
