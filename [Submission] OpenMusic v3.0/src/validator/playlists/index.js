const InvariantError = require('../../exceptions/client/InvariantError');
const { PlaylistPayloadScheme } = require('./scheme');

const PlaylistsValidator = {
    validatePlaylistPayload: (payload) => {
        const validationResult = PlaylistPayloadScheme.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = PlaylistsValidator;
