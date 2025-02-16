import { createAuthError } from "../errors/custom-error.js";
import UserModel from "../models/User.js";
import jwToken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createAuthError("Missing or bad access token");
  }

  const theToken = authHeader.split(" ")[1];
  try {
    const decoded = jwToken.verify(theToken, process.env.JWT_SECRET);
    const { userId, name } = decoded;
    req.user = { userId, name };
  } catch (err) {
    throw createAuthError("Not authorize to access service");
  }
  next();
};

export default auth;
