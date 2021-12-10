/* eslint-disable max-len */
/* eslint object-curly-newline: "off" */

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/client/InvariantError');
const NotFoundError = require('../../exceptions/client/NotFoundError');
const InternalServerError = require('../../exceptions/server/InternalServerError');
const AuthorizationError = require('../../exceptions/client/AuthorizationError');

class PlaylistsService {
    constructor(collaborationsService) {
        this._pool = new Pool();
        this._collaborationService = collaborationsService;
    }

    async verifyPlaylistAccess(playlistId, userId) {
        try {
            await this.verifyPlaylistOwner(playlistId, userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            try {
                await this._collaborationService.verifyCollaborator(
                    playlistId,
                    userId
                );
            } catch {
                throw error;
            }
        }
    }

    async verifyPlaylistOwner(id, owner) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Playlists tidak ditemukan');
        }

        const { owner: playlistOwner } = result.rows[0];
        if (playlistOwner !== owner) {
            throw new AuthorizationError(
                'Anda tidak berhak mengakses resource ini'
            );
        }
    }

    async addPlaylist(name, owner) {
        const id = `playlist-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlists(id, name, owner) VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getPlaylists(owner) {
        const query = {
            text: ` SELECT playlists.id, playlists.name, users.username FROM playlists
                    LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
                    JOIN users ON users.id = playlists.owner
                    WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
            values: [owner],
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

        return result.rows;
    }

    async getPlaylistById(id) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        return result.rows[0];
    }

    async deletePlaylistById(id) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError(
                'Playlists gagal dihapus. Id tidak ditemukan'
            );
        }
    }
}

module.exports = PlaylistsService;
