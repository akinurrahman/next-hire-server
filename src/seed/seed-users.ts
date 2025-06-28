import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import User from "../models/auth/user.model";
import dotenv from "dotenv";
import { ROLES } from "../constants";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";
console.log("🔍 MONGO_URI:", MONGO_URI);

async function connectDB() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB Atlas");
}

async function createDummyUsers(count: number) {
  for (let i = 0; i < count; i++) {
    const email = `dummyuser${i + 1}@example.com`;

    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`👤 User already exists: ${email}`);
      continue;
    }

    const user = new User({
      fullName: faker.person.fullName(),
      email,
      password: "123456",
      role: ROLES.RECRUITER,
    });

    await user.save();
    console.log(`✅ Created: ${email}`);
  }
}

async function run() {
  try {
    await connectDB();
    await createDummyUsers(10);
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
