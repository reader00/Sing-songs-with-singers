const Handler = require('../Handler');

class AuthenticationsHandler extends Handler {
    constructor(authenticationsService, usersService, tokenManager, validator) {
        super(authenticationsService, validator);
        this._usersService = usersService;
        this._tokenManager = tokenManager;
    }

    async postAuthenticationHandler(req, h) {
        this._validator.validatePostAuthenticationPayload(req.payload);
        const { username, password } = req.payload;
        const id = await this._usersService.verifyUserCredential(
            username,
            password
        );

        const accessToken = this._tokenManager.generateAccessToken({ id });
        const refreshToken = this._tokenManager.generateRefreshToken({ id });

        await this._service.addRefreshToken(refreshToken);

        const res = h.response({
            status: 'success',
            message: 'Authentication berhasil ditambahkan',
            data: {
                accessToken,
                refreshToken,
            },
        });

        res.code(201);
        return res;
    }

    async putAuthenticationHandler(req) {
        this._validator.validatePutAuthenticationPayload(req.payload);

        const { refreshToken } = req.payload;

        await this._service.verifyRefreshToken(refreshToken);
        const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

        const accessToken = this._tokenManager.generateAccessToken({ id });

        return {
            status: 'success',
            message: 'Access Token berhasil diperbarui',
            data: {
                accessToken,
            },
        };
    }

    async deleteAuthenticationHandler(req) {
        this._validator.validateDeleteAuthenticationPayload(req.payload);

        const { refreshToken } = req.payload;

        await this._service.verifyRefreshToken(refreshToken);
        await this._service.deleteRefreshToken(refreshToken);

        return {
            status: 'success',
            message: 'Refresh token berhasil dihapus',
        };
    }
}

module.exports = AuthenticationsHandler;
