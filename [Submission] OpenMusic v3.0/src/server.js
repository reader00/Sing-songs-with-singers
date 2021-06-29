require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');

const routes = require('./routes');
const plugins = require('./api');
const { errorHandler } = require('./ext');
const { jwtStrategy } = require('./strategy');

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    // Register JWT plugin
    await server.register([
        {
            plugin: Jwt,
        },
        {
            plugin: Inert,
        },
    ]);

    // JWT strategy
    server.auth.strategy('openmusic_jwt', 'jwt', jwtStrategy);

    // Register custom plugins
    await server.register(plugins);

    // Set onPreResponse for error handler
    await server.ext('onPreResponse', errorHandler);

    // Set additional routes such any*
    await server.route(routes);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
