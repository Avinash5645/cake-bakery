// File: pages/api/admin/some-resource.ts
import type { NextApiRequest, NextApiResponse } from "next";
import authenticate from "../../../utils/authenticate";
import connectDB from "../../../utils/db";
import logger from "../../../utils/logger";

const adminHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB(); // Connect to the database

  logger.info("Admin route accessed");

  // Ensure only admins can access this route
  const { user } = req;
  if (user?.role !== "admin") {
    logger.warn("Unauthorized access attempt to admin route", { user });
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }

  if (req.method === "GET") {
    try {
      // Example: Fetch some admin-specific resources
      const someResources = [
        { id: 1, name: "Admin Resource 1" },
        { id: 2, name: "Admin Resource 2" },
      ];

      logger.info("Admin resources fetched successfully");
      return res.status(200).json(someResources);
    } catch (error) {
      logger.error("Error fetching admin resources", { error });
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
};

// Wrap with authentication middleware
export default authenticate(adminHandler);
