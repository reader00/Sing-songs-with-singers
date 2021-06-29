module.exports = [
    {
        method: '*',
        path: '/{any*}',
        handler() {
            return '404 Error! Resource Not Found!';
        },
    },
];
