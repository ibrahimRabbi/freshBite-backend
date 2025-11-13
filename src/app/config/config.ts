import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const envData = {
  port: process.env.PORT,
  mode: process.env.NODE_ENV,
  secretKey : process.env.SECRET_KEY,
  databaseUrl: process.env.DATABASE_URL,
  email: process.env.EMAIL,
  emailPassword: process.env.EMAIL_PASSWORD
};
