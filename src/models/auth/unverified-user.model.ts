import { Document, model, Schema, Types } from "mongoose";
import { ROLES } from "../../constants";

export interface OtpVerificationDocument extends Document {
  _id: Types.ObjectId;
  fullName: String;
  email: string;
  password: String;
  otpHash: string;
  otpExpiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  role: typeof ROLES.CANDIDATE | typeof ROLES.CANDIDATE;
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
      index: true,
    },
    role: {
      type: String,
      required: true,
      enum: [ROLES.CANDIDATE, ROLES.RECRUITER],
    },
    password: {
      type: String,
      required: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    otpExpiresAt: {
      type: Date,
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
