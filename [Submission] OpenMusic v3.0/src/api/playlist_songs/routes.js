const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists/{playlist*2}',
        handler: handler.postPlaylistSongHandler,
        options: {
            auth: 'openmusic_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists/{playlist*2}',
        handler: handler.getPlaylistSongsHandler,
        options: {
            auth: 'openmusic_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{playlist*2}',
        handler: handler.deletePlaylistSongByIdHandler,
        options: {
            auth: 'openmusic_jwt',
        },
    },
];

module.exports = routes;
