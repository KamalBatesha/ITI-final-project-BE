export class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export const globalErrorHandller = (error, req, res, next) => {
  if (process.env.MODE == "dev") {
    return res
      .status(error.status || 500)
      .json({ message: error.message, stack: error.stack });
  } else {
    return res.status(error.status || 500).json({ message: error.message });
  }
};
