import { StatusCodes } from "http-status-codes";
import JobModel from "../models/Job.js";
import {
  createBadRequestError,
  createAuthError,
  createNotFoundError
} from "../errors/custom-error.js";

export const getAllJobs = async (req, res, next) => {
  const jobs = await JobModel.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
};

export const getJob = async (req, res, next) => {
  const {
    user: { userId },
    params: { id: jobId }
  } = req;
  const job = await JobModel.findOne({
    _id: jobId,
    createdBy: userId
  });
  if (!job) {
    throw createNotFoundError("Job not found");
  }
  res.status(StatusCodes.OK).json({ job });
};

export const createJob = async (req, res, next) => {
  const { position, company } = req.body;
  if (!position || !company) {
    throw createBadRequestError("company and position values are required");
  }
  const aJob = await JobModel.create({
    ...req.body,
    createdBy: req.user.userId
  });
  res.status(StatusCodes.CREATED).json({ aJob });
};

export const updateJob = async (req, res, next) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId }
  } = req;

  if (!position && !company) {
    throw createBadRequestError("Requires position and/or company to update");
  }

  const filter = {
    _id: jobId,
    createdBy: userId
  };

  const updateItems = { company, position };
  const job = await JobModel.findOneAndUpdate(filter, updateItems, {
    returnOriginal: false
  });

  if (!job) {
    throw createNotFoundError("Job not found");
  }

  res.status(StatusCodes.OK).json({ job });
};

export const deleteJob = async (req, res, next) => {
  const {
    user: { userId },
    params: { id: jobId }
  } = req;

  const filter = {
    _id: jobId,
    createdBy: userId
  };

  const job = await JobModel.findOneAndDelete(filter);

  if (!job) {
    throw createNotFoundError("Job not found");
  }

  res.status(StatusCodes.OK).send("Job Deleted");
};
