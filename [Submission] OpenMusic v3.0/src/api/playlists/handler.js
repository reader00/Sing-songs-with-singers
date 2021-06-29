const Handler = require('../Handler');

class PlaylistsHandler extends Handler {
    async postPlaylistHandler(req, h) {
        this._validator.validatePlaylistPayload(req.payload);
        const { name } = req.payload;
        const { id: owner } = req.auth.credentials;

        const playlistId = await this._service.addPlaylist(name, owner);

        const res = h.response({
            status: 'success',
            message: 'Playlist berhasil ditambahkan',
            data: {
                playlistId,
            },
        });
        res.code(201);
        return res;
    }

    async getPlaylistsHandler(req) {
        const { id: owner } = req.auth.credentials;

        const playlists = await this._service.getPlaylists(owner);
        return {
            status: 'success',
            data: {
                playlists,
            },
        };
    }

    async deletePlaylistByIdHandler(req, h) {
        const { playlistId } = req.params;
        const { id: owner } = req.auth.credentials;

        await this._service.verifyPlaylistOwner(playlistId, owner);
        await this._service.deletePlaylistById(playlistId);

        const res = h.response({
            status: 'success',
            message: 'Playlist berhasil dihapus',
        });
        res.code(200);
        return res;
    }
}

module.exports = PlaylistsHandler;
