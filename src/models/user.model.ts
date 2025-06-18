import { Document, model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import { HydratedDocument } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  fullName: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(incomingPassword: string): Promise<Boolean>;
}

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index:true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this as HydratedDocument<UserDocument>;
  if (!user.isModified("password")) {
    return next();
  }

  try {
    const saltWorkFactor = config.get<number>("saltWorkFactor");
    const salt = await bcrypt.genSalt(saltWorkFactor);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    return next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (
  incomingPassword: string
): Promise<boolean> {
  const user = this as UserDocument;
  return bcrypt.compare(incomingPassword, user.password).catch(() => false);
};

const User = model("User", userSchema);
export default User;
