const Handler = require('../Handler');

class CollaborationsHandler extends Handler {
    constructor(collaborationsService, playlistsService, validator) {
        super(collaborationsService, validator);
        this._playlistsService = playlistsService;
    }

    async postCollaborationHandler(req, h) {
        await this._validator.validateCollaborationPayload(req.payload);

        const { playlistId, userId } = req.payload;
        const { id: credentialId } = req.auth.credentials;

        await this._playlistsService.verifyPlaylistOwner(
            playlistId,
            credentialId
        );
        const collaborationId = await this._service.addCollaboration(
            playlistId,
            userId
        );

        const res = h.response({
            status: 'success',
            message: 'Kolaborasi berhasil ditambahkan',
            data: {
                collaborationId,
            },
        });
        res.code(201);
        return res;
    }

    async deleteCollaborationHandler(req) {
        await this._validator.validateCollaborationPayload(req.payload);

        const { playlistId, userId } = req.payload;
        const { id: credentialId } = req.auth.credentials;

        await this._playlistsService.verifyPlaylistOwner(
            playlistId,
            credentialId
        );
        await this._service.deleteCollaboration(playlistId, userId);

        return {
            status: 'success',
            message: 'Kolaborasi berhasil dihapus',
        };
    }
}

module.exports = CollaborationsHandler;
