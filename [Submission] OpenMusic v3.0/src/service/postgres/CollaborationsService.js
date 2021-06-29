const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/client/InvariantError');

class CollaborationsService {
    constructor(cacheService) {
        this._pool = new Pool();
        this._cacheService = cacheService;
    }

    async verifyCollaborator(playlistId, userId) {
        const query = {
            text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
            values: [playlistId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Kolaborasi gagal diverifikasi');
        }
    }

    async addCollaboration(playlistId, userId) {
        const id = `collab-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO collaborations(id, playlist_id, user_id) VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Kolaborasi gagal ditambahkan');
        }

        await this._cacheService.delete(`playlistsongs:${userId}`);

        return result.rows[0].id;
    }

    async deleteCollaboration(playlistId, userId) {
        const query = {
            text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
            values: [playlistId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Kolaborasi gagal dihapus');
        }

        await this._cacheService.delete(`playlistsongs:${userId}`);
    }
}

module.exports = CollaborationsService;
