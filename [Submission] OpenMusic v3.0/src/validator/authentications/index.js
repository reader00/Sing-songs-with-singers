const InvariantError = require('../../exceptions/client/InvariantError');
const {
    PostAuthenticationScheme,
    PutAuthenticationScheme,
    DeleteAuthenticationScheme,
} = require('./scheme');

const validate = (payload, Scheme) => {
    const validationResult = Scheme.validate(payload);

    if (validationResult.error) {
        console.log(validationResult.error.message);
        throw new InvariantError(validationResult.error.message);
    }
};

const AuthenticationValidator = {
    validatePostAuthenticationPayload: (payload) => {
        validate(payload, PostAuthenticationScheme);
    },
    validatePutAuthenticationPayload: (payload) => {
        validate(payload, PutAuthenticationScheme);
    },
    validateDeleteAuthenticationPayload: (payload) => {
        validate(payload, DeleteAuthenticationScheme);
    },
};

module.exports = AuthenticationValidator;
