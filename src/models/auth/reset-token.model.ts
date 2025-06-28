import { model, Schema } from "mongoose";
import { ResetTokenDocument } from "../../interfaces/auth.interface";

const resetTokenSchema = new Schema<ResetTokenDocument>(
  {
    email: { type: String, required: true, unique: true, index: true },
    token: { type: String, required: true },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  { timestamps: true }
);

const ResetToken = model<ResetTokenDocument>("ResetToken", resetTokenSchema);
export default ResetToken;
