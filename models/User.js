import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "user name must be provided"],
    minlength: 3,
    maxlen: 50
  },
  email: {
    type: String,
    required: [true, "email must be provided"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Provide a valid email"
    ],
    unique: true
  },
  password: {
    type: String,
    required: [true, "user password must be provided"],
    minlength: 6,
    maxlen: 12
  }
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.generateToken = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_TOKEN_EXPIRATION
    }
  );
};

userSchema.methods.comparePassword = async function (providedPassword) {
  return await bcrypt.compare(providedPassword, this.password);
};

export default mongoose.model("User", userSchema);
