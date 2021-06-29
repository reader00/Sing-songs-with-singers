const InvariantError = require('../../exceptions/client/InvariantError');
const { CollaborationPayloadSchema } = require('./scheme');

const CollaborationsValidator = {
    validateCollaborationPayload: (payload) => {
        const validationResult = CollaborationPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = CollaborationsValidator;
