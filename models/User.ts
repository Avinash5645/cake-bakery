// File: models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string; // New: Role field for Role-Based Access Control
  resetPasswordToken?: string; // New: For password reset functionality
  resetPasswordExpires?: Date; // New: Expiry for reset token
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }, // New: Role field
    resetPasswordToken: { type: String }, // New: Password reset token
    resetPasswordExpires: { type: Date }, // New: Expiry for password reset token
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
