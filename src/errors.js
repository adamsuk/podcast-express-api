class InvalidReqError extends Error {
    constructor(message) {
      super(message);
      this.name = "InvalidReqError";
      this.code = 400;
    }
}

class InvalidMethodError extends InvalidReqError { construtor = () => this.name = InvalidMethodError }
class InvalidPathError extends InvalidReqError { construtor = () => this.name = InvalidPathError }

module.exports = {
    InvalidReqError,
    InvalidMethodError,
    InvalidPathError
}