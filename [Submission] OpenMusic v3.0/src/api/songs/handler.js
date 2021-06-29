const Handler = require('../Handler');

class SongsHandler extends Handler {
    async postSongHandler(req, h) {
        this._validator.validateSongPayload(req.payload);
        const songId = await this._service.addSong(req.payload);

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan',
            data: {
                songId,
            },
        });
        response.code(201);
        return response;
    }

    async getSongsHandler() {
        const songs = await this._service.getSongs();
        return {
            status: 'success',
            data: {
                songs: songs.map((s) => ({
                    id: s.id,
                    title: s.title,
                    performer: s.performer,
                })),
            },
        };
    }

    async getSongByIdHandler(req) {
        const { songId } = req.params;
        const song = await this._service.getSongById(songId);
        return {
            status: 'success',
            data: {
                song,
            },
        };
    }

    async putSongByIdHandler(req, h) {
        this._validator.validateSongPayload(req.payload);
        const { songId } = req.params;

        await this._service.editSongById(songId, req.payload);

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    async deleteSongByIdHandler(req, h) {
        const { songId } = req.params;

        await this._service.deleteSongById(songId);

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil dihapus',
        });
        response.code(200);
        return response;
    }
}

module.exports = SongsHandler;
