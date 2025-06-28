import { ROLES } from "../constants";
import { BaseDocument } from "./common.interface";


export interface UserDocument extends BaseDocument {
  email: string;
  fullName: string;
  password: string;
  role: (typeof ROLES)[keyof typeof ROLES];
}

export interface OtpVerificationDocument extends UserDocument {
  otpHash: string;
  otpExpiresAt: Date;
}


export interface ResetTokenDocument extends BaseDocument {
  email: string;
  token: string;
  expiresAt: Date;
}