const Handler = require('../Handler');

class UsersHandler extends Handler {
    async postUserHandler(req, h) {
        await this._validator.validateUserPayload(req.payload);

        const userId = await this._service.addUser(req.payload);

        const res = h.response({
            status: 'success',
            message: 'User berhasil ditambahkan',
            data: {
                userId,
            },
        });

        res.code(201);
        return res;
    }
}

module.exports = UsersHandler;
