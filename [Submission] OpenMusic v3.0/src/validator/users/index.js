const InvariantError = require('../../exceptions/client/InvariantError');
const { UserPayloadScheme } = require('./scheme');

const UsersValidator = {
    validateUserPayload: (payload) => {
        const validationResult = UserPayloadScheme.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = UsersValidator;
