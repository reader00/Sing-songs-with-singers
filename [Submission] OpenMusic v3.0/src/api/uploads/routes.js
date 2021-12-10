const path = require('path');

const routes = (handler) => [
    {
        method: 'POST',
        path: '/upload/pictures',
        handler: handler.postUploadImageHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
                output: 'stream',
                maxBytes: 1000 * 500, // 500kb
            },
        },
    },
    {
        method: 'POST',
        path: '/upload/users/photo',
        handler: handler.postUploadUsersPhotoProfile,
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
                output: 'stream',
                maxBytes: 1000 * 500, // 500kb
            },
        },
    },
    {
        method: 'GET',
        path: '/upload/{param*}',
        handler: {
            directory: {
                path: path.resolve(__dirname, 'file'),
            },
        },
    },
];

module.exports = routes;
