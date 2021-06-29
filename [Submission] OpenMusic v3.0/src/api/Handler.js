/* eslint-disable class-methods-use-this */
const autoBind = require('auto-bind');

class Handler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }
}
module.exports = Handler;
