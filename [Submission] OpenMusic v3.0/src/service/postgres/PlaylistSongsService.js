const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/client/InvariantError');
// const NotFoundError = require('../../exceptions/client/NotFoundError');
const InternalServerError = require('../../exceptions/server/InternalServerError');

class PlaylistSongsService {
    constructor(playlistsService, songsService, cacheService) {
        this._pool = new Pool();
        this._playlistsService = playlistsService;
        this._songsService = songsService;
        this._cacheService = cacheService;
    }

    async addPlaylistSong(playlistId, songId, owner) {
        // Is user have access to playlist
        await this._playlistsService.verifyPlaylistAccess(playlistId, owner);

        // Is playlist exist
        await this._playlistsService.getPlaylistById(playlistId);

        // Is song exist
        await this._songsService.getSongById(songId);

        const id = `playlist-song-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlistsongs(id, playlist_id, song_id) VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Lagu gagal ditambahkan ke playlist');
        }

        await this._cacheService.delete(
            `playlistsongs:${playlistId}`,
            JSON.stringify(result.rows)
        );
    }

    async getPlaylistSongs(playlistId, owner) {
        // Is user have access to playlist
        await this._playlistsService.verifyPlaylistAccess(playlistId, owner);
        try {
            const result = await this._cacheService.get(
                `playlistsongs:${playlistId}`
            );
            return JSON.parse(result);
        } catch (error) {
            console.log('Dari database');

            const query = {
                text: ` SELECT songs.id, songs.title, songs.performer FROM playlistsongs
                        JOIN songs ON songs.id = playlistsongs.song_id
                        WHERE playlistsongs.playlist_id = $1
                        GROUP BY playlistsongs.song_id, songs.id`,
                values: [playlistId],
            };

            const result = await this._pool
                .query(query)
                .then((fetchResult) => fetchResult)
                .catch((err) => {
                    console.log(err.stack);
                    throw new InternalServerError(
                        'Maaf, terjadi kegagalan pada server kami.'
                    );
                });

            await this._cacheService.set(
                `playlistsongs:${playlistId}`,
                JSON.stringify(result.rows)
            );

            return result.rows;
        }
    }

    async deletePlaylistSongById(playlistId, songId, owner) {
        // Is user have access to playlist
        await this._playlistsService.verifyPlaylistAccess(playlistId, owner);

        const query = {
            text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError(
                'Lagu gagal dihapus dari platlist. Id tidak ditemukan'
            );
        }

        await this._cacheService.delete(
            `playlistsongs:${playlistId}`,
            JSON.stringify(result.rows)
        );
    }
}

module.exports = PlaylistSongsService;
