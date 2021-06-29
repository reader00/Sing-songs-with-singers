const Joi = require('joi');

const PostAuthenticationScheme = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

const PutAuthenticationScheme = Joi.object({
    refreshToken: Joi.string().required(),
});

const DeleteAuthenticationScheme = Joi.object({
    refreshToken: Joi.string().required(),
});

module.exports = {
    PostAuthenticationScheme,
    PutAuthenticationScheme,
    DeleteAuthenticationScheme,
};
