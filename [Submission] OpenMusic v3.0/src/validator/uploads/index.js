const InvariantError = require('../../exceptions/client/InvariantError');
const { ImageHeadersSchema } = require('./scheme');

const UploadsValidator = {
    validateImageHeaders: (headers) => {
        const validationResult = ImageHeadersSchema.validate(headers);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = UploadsValidator;
