import { Document, model, Schema, Types } from "mongoose";

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  email: string;
  fullName: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = model<UserDocument>("User", userSchema);
export default User;
