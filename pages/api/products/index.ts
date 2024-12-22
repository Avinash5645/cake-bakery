// File: pages/api/products/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../utils/db';
import Product from '../../../models/Product';
import { z } from 'zod';
import authenticate from '../../../utils/authenticate';
import logger from '../../../utils/logger';
// Validation schema using zod
const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be greater than 0'),
  image: z.string().url('Invalid image URL'),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  logger.info('Connecting to database');
console.log("hell");
  const { page = 1, limit = 10, category, search, minPrice, maxPrice, inStock } = req.query;

  if (req.method === 'GET') {
    try {
      const query: {
        category?: string;
        name?: { $regex: string; $options: string };
        price?: { $gte?: number; $lte?: number };
        stock?: { $gt?: number };
      } = {};
     // Apply filters
     if (category) query.category = category as string;
     if (search) query.name = { $regex: search as string, $options: 'i' };
      if (minPrice || maxPrice) {
        query.price = {
          ...(minPrice ? { $gte: Number(minPrice) } : {}),
          ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
        };
      }
      if (inStock === 'true') {
        query.stock = { $gt: 0 };
      }
      
      // Fetch products with pagination
      const products = await Product.find(query)
        .skip((+page - 1) * +limit)
        .limit(+limit);

      logger.info('Fetched products successfully', { totalProducts: products.length });

      // Count total products
      const total = await Product.countDocuments(query);

      res.status(200).json({ products, total, page: +page, limit: +limit });
    } catch (error) {
      logger.error('Error fetching products', { error });
      res.status(500).json({ message: 'Error fetching products' });
    }
  } else if (req.method === 'POST') {
    try {
      const validatedData = productSchema.parse(req.body);

      // Create a new product
      const newProduct = await Product.create(validatedData);
      logger.info('Product created successfully', { newProduct });

      res.status(201).json(newProduct);
    } catch (error) {
      logger.error('Error creating product', { error });
      res.status(400).json({ message: error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
export default authenticate(handler);
