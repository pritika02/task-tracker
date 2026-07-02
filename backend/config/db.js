const mongoose = require("mongoose");

let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is not defined in the environment variables.");
    throw new Error("MONGO_URI is not defined");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((mongooseInstance) => {
      console.log("MongoDB connected successfully");
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;
