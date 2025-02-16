import { StatusCodes } from "http-status-codes";
import UserModel from "../models/User.js";
import {
  createAuthError,
  createBadRequestError
} from "../errors/custom-error.js";

export const register = async (req, res, next) => {
  const user = await UserModel.create({ ...req.body });

  const token = user.generateToken();

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw createBadRequestError(
      "Password and Email are required to login. Try again"
    );
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw createAuthError("User not found");
  }

  if (await user.comparePassword(password)) {
    const token = user.generateToken();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
  } else {
    throw createAuthError("Bad credentials");
  }
};
