const Joi = require('joi');

const PlaylistSongPayloadScheme = Joi.object({
    songId: Joi.string().required(),
});

module.exports = { PlaylistSongPayloadScheme };
