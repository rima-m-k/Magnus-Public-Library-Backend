class AppError extends Error {
    constructor(statusCode, message) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
      this.statusCode = statusCode;
    }
  }
  
  module.exports = AppError;
  