/* eslint-disable camelcase */
const path = require('path');

// Songs
const songs = require('./songs');
const SongsService = require('../service/postgres/SongsService');
const SongsValidator = require('../validator/songs');

// Users
const users = require('./users');
const UsersService = require('../service/postgres/UsersService');
const UsersValidator = require('../validator/users');

// Authentications
const authentications = require('./authentications');
const AuthenticationsService = require('../service/postgres/AuthenticationsService');
const AuthenticationsValidator = require('../validator/authentications');
const TokenManager = require('../tokenize/TokenManager');

// Playlists
const playlists = require('./playlists');
const PlaylistsService = require('../service/postgres/PlaylistsService');
const PlaylistsValidator = require('../validator/playlists');

// PlaylistSongs
const playlist_songs = require('./playlist_songs');
const PlaylistSongsService = require('../service/postgres/PlaylistSongsService');
const PlaylistSongsValidator = require('../validator/playlist_songs');

// Collaborations
const collaborations = require('./collaborations');
const CollaborationsService = require('../service/postgres/CollaborationsService');
const CollaborationsValidator = require('../validator/collaborations');

// Exports
const _exports = require('./exports');
const ProducerService = require('../service/rabbitmq/ProducerService');
const ExportsValidator = require('../validator/exports');

// Uploads
const uploads = require('./uploads');
const StorageService = require('../service/storage/StorageService');
const UploadsValidator = require('../validator/uploads');

// Cache
const CacheService = require('../service/redis/CacheService');

// Instance
const cacheService = new CacheService();
const collaborationsService = new CollaborationsService(cacheService);
const songsService = new SongsService();
const usersService = new UsersService();
const authenticationsService = new AuthenticationsService();
const playlistsService = new PlaylistsService(collaborationsService);
const playlistSongsService = new PlaylistSongsService(
    playlistsService,
    songsService,
    cacheService
);
const storageService = new StorageService(
    path.resolve(__dirname, './uploads/file/pictures')
);

module.exports = [
    {
        plugin: songs,
        options: {
            service: songsService,
            validator: SongsValidator,
        },
    },
    {
        plugin: users,
        options: {
            service: usersService,
            validator: UsersValidator,
        },
    },
    {
        plugin: authentications,
        options: {
            authenticationsService,
            usersService,
            tokenManager: TokenManager,
            validator: AuthenticationsValidator,
        },
    },
    {
        plugin: playlists,
        options: {
            service: playlistsService,
            validator: PlaylistsValidator,
        },
    },
    {
        plugin: playlist_songs,
        options: {
            service: playlistSongsService,
            validator: PlaylistSongsValidator,
        },
    },
    {
        plugin: collaborations,
        options: {
            collaborationsService,
            playlistsService,
            validator: CollaborationsValidator,
        },
    },
    {
        plugin: _exports,
        options: {
            producerService: ProducerService,
            playlistsService,
            validator: ExportsValidator,
        },
    },
    {
        plugin: uploads,
        options: {
            service: storageService,
            validator: UploadsValidator,
        },
    },
];
