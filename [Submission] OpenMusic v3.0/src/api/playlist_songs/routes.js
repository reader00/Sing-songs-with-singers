const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists/{playlistId}/{any}',
        handler: handler.postPlaylistSongHandler,
        options: {
            auth: 'openmusic_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists/{playlistId}/{any}',
        handler: handler.getPlaylistSongsHandler,
        options: {
            auth: 'openmusic_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{playlistId}/{any}',
        handler: handler.deletePlaylistSongByIdHandler,
        options: {
            auth: 'openmusic_jwt',
        },
    },
];

module.exports = routes;
