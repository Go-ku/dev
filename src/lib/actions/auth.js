"use server";

import bcrypt from "bcryptjs";
import { connectMongo } from "@/lib/mongodb";
import User from "@/models/User";

function ensureMongo() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Set MONGODB_URI to enable persistent auth actions");
  }
}

export async function registerUser({ name, email, password, role = "tenant" }) {
  ensureMongo();
  await connectMongo();
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, role });
  return { id: user._id.toString(), role: user.role };
}

export async function seedDemoAccounts() {
  ensureMongo();
  await connectMongo();
  const defaultAccounts = [
    { name: "Chanda Admin", email: "admin@zamreal.co", role: "admin" },
    { name: "Lusungu Manager", email: "manager@zamreal.co", role: "manager" }
  ];

  await Promise.all(
    defaultAccounts.map(async (account) => {
      const exists = await User.findOne({ email: account.email });
      if (!exists) {
        await User.create({ ...account, password: await bcrypt.hash("password123", 10) });
      }
    })
  );
}
