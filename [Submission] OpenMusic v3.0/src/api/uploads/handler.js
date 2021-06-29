const Handler = require('../Handler');

class UploadsHandler extends Handler {
    async postUploadImageHandler(request, h) {
        const { data } = request.payload;
        this._validator.validateImageHeaders(data.hapi.headers);

        const filename = await this._service.writeFile(data, data.hapi);

        const response = h.response({
            status: 'success',
            data: {
                pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/uploads/file/pictures/${filename}`,
            },
        });
        response.code(201);
        return response;
    }
}

module.exports = UploadsHandler;
