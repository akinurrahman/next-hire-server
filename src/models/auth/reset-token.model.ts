import { Document, model, Schema, Types } from "mongoose";

export interface ResetTokenDocument extends Document {
  _id: Types.ObjectId;
  email: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const resetTokenSchema = new Schema<ResetTokenDocument>(
  {
    email: { type: String, required: true, unique: true, index: true },
    token: { type: String, required: true },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

const ResetToken = model<ResetTokenDocument>("ResetToken", resetTokenSchema);
export default ResetToken;
