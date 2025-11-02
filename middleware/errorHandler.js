const logger = require("../config/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({
    error: "Sunucu hatası",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

module.exports = errorHandler;
