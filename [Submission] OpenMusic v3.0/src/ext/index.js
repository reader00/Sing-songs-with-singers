const ClientError = require('../exceptions/client/ClientError');
const ServerError = require('../exceptions/server/ServerError');

const errorHandler = (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
        const newResponse = h.response({
            status: 'fail',
            message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
    }
    if (response instanceof ServerError) {
        const newResponse = h.response({
            status: 'error',
            message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
    }

    return response.continue || response;
};

module.exports = { errorHandler };
