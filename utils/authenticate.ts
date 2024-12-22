import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

const authenticate = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return handler(req, res);
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export default authenticate;
