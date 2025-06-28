import { model, Schema } from "mongoose";
import { ROLES } from "../../constants";
import { UserDocument } from "../../interfaces/auth.interface";

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
