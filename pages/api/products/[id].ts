// File: pages/api/products/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../utils/db';
import Product from '../../../models/Product';
import authenticate from '../../../utils/authenticate';
import logger from '../../../utils/logger';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  logger.info('Connecting to database');
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
      logger.info('Product updated successfully', { updatedProduct });
      res.status(200).json(updatedProduct);
    } catch (error) {
        logger.error('Error updating product', { error });
      res.status(500).json({ message: 'Error updating product' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await Product.findByIdAndDelete(id);
      logger.info('Product deleted successfully', { id });
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        logger.error('Error deleting product', { error });
      res.status(500).json({ message: 'Error deleting product' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default authenticate(handler);