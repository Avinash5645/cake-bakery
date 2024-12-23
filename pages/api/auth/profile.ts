// File: pages/api/auth/profile.ts
import type { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../../../utils/authMiddleware";
import User from "../../../models/User";
import connectDB from "../../../utils/db";

const profileHandler = authenticate(async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  if (req.method === "PUT") {
    const userId = (req as any).user.userId;
    const { name, email } = req.body;
  
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { name, email },
        { new: true, runValidators: true }
      ).select("-password");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Error updating profile", error });
    }
  }
  else if (req.method === "GET") {
    const userId = (req as any).user.userId;

    try {
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user profile", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
});

export default profileHandler;
