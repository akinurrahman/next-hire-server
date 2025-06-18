import { Document, model, Schema } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  fullName: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index:true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
