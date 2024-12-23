import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
const authorizeAdmin = (handler: NextApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      if ((req as any).user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      return handler(req, res);
    };
  };
  
  export default authorizeAdmin;
  