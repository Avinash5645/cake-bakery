// File: utils/authMiddleware.ts
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import jwt from "jsonwebtoken";

const authenticate = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
      (req as any).user = decoded;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};

export default authenticate;
