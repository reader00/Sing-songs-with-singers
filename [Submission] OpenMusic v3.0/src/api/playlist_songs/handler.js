/* eslint-disable class-methods-use-this */
const NotFoundError = require('../../exceptions/client/NotFoundError');
const Handler = require('../Handler');

class PlaylistsHandler extends Handler {
    getPlaylistId(url) {
        const playlistParts = url.split('/');
        if (playlistParts[1] !== 'songs') {
            throw new NotFoundError('404 Error! Resource Not Found!');
        }
        return playlistParts[0];
    }

    async postPlaylistSongHandler(req, h) {
        // const playlistId = this.getPlaylistId(req.params.playlist);
        const { playlistId, any } = req.params;

        if (any !== 'songs') {
            throw new NotFoundError('Resource tidak ditemukan');
        }

        this._validator.validatePlaylistSongPayload(req.payload);

        const { songId } = req.payload;
        const { id: owner } = req.auth.credentials;

        await this._service.addPlaylistSong(playlistId, songId, owner);

        const res = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan ke playlist',
        });
        res.code(201);
        return res;
    }

    async getPlaylistSongsHandler(req) {
        const { playlistId, any } = req.params;

        if (any !== 'songs') {
            throw new NotFoundError('Resource tidak ditemukan');
        }
        const { id: owner } = req.auth.credentials;

        const songs = await this._service.getPlaylistSongs(playlistId, owner);
        return {
            status: 'success',
            data: {
                songs,
            },
        };
    }

    async deletePlaylistSongByIdHandler(req, h) {
        const { playlistId, any } = req.params;

        if (any !== 'songs') {
            throw new NotFoundError('Resource tidak ditemukan');
        }
        const { id: owner } = req.auth.credentials;
        const { songId } = req.payload;

        await this._service.deletePlaylistSongById(playlistId, songId, owner);

        const res = h.response({
            status: 'success',
            message: 'Playlist berhasil dihapus',
        });
        res.code(200);
        return res;
    }
}

module.exports = PlaylistsHandler;
