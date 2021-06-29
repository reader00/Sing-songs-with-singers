const Handler = require('../Handler');

class ExportsHandler extends Handler {
    constructor(storageService, playlistsService, validator) {
        super(storageService, validator);
        this._playlistsService = playlistsService;
    }

    async postExportSongsHandler(request, h) {
        const { playlistId } = request.params;
        const { id: credentialsId } = request.auth.credentials;
        await this._playlistsService.verifyPlaylistAccess(
            playlistId,
            credentialsId
        );

        this._validator.validateExportSongsPayload(request.payload);

        const message = {
            playlistId,
            targetEmail: request.payload.targetEmail,
        };

        await this._service.sendMessage(
            'export:songs',
            JSON.stringify(message)
        );

        const response = h.response({
            status: 'success',
            message: 'Permintaan Anda dalam antrean',
        });
        response.code(201);
        return response;
    }
}

module.exports = ExportsHandler;
