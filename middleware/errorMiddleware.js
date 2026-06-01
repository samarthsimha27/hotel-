// Intercept non-registered URL endpoints
export const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Catch-all server exception handler
export const errorHandler = (err, req, res, next) => {
  // If headers already sent, pass to Express default handler
  if (res.headersSent) {
    return next(err);
  }

  // Ensure an error status is set
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};
