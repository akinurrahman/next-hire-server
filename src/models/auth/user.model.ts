import { Document, model, Schema, Types } from "mongoose";
import { ROLES } from "../../constants";

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  email: string;
  fullName: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  role: (typeof ROLES)[keyof typeof ROLES];
}

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: Object.values(ROLES),
    },
  },
  { timestamps: true }
);

const User = model<UserDocument>("User", userSchema);
export default User;
