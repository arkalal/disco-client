import dbConnect from "./dbConnect";

export async function connectDB() {
  try {
    await dbConnect();
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Failed to connect to database");
  }
}
