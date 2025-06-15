import { Document, model, Schema } from "mongoose";

export interface OtpVerificationDocument extends Document {
  fullName: String;
  email: string;
  password: String;
  otpHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const unVerifiedUserSchema = new Schema<OtpVerificationDocument>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const unVerifiedUserModel = model<OtpVerificationDocument>(
  "UnverifiedUser",
  unVerifiedUserSchema
);
export default unVerifiedUserModel;