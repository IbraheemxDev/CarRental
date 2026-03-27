import {ApiResponse} from "./ApiResponse.js";

const errorHandler = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json(
    new ApiResponse(statusCode, message)
  );
};

export default errorHandler;