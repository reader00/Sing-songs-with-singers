const InvariantError = require('../../exceptions/client/InvariantError');
const { PlaylistSongPayloadScheme } = require('./scheme');

const PlaylistSongsValidator = {
    validatePlaylistSongPayload: (payload) => {
        const validationResult = PlaylistSongPayloadScheme.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = PlaylistSongsValidator;
