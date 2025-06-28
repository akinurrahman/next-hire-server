import { model, Schema } from "mongoose";
import { ROLES } from "../../constants";
import { OtpVerificationDocument } from "../../interfaces/auth.interface";

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
