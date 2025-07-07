import { UserDocument } from "../interfaces/auth.interface";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      file?: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        buffer: Buffer;
        destination?: string;
        filename?: string;
        path?: string;
      };
    }
  }
}
