// Step 2: Define the Product Model
import { Schema, model, models } from 'mongoose';

interface IProduct {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, default: 0 },
});

const Product = models.Product || model<IProduct>('Product', ProductSchema);
export default Product;
