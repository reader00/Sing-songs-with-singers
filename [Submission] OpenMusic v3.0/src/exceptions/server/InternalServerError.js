const ServerError = require('./ServerError');

class InternalServerError extends ServerError {
    constructor(message) {
        super(message);
        this.name = 'InternalServerError';
    }
}

module.exports = InternalServerError;
