/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        title: {
            type: 'TEXT',
            notNull: true,
        },
        year: {
            type: 'INT',
            notNull: true,
        },
        performer: {
            type: 'VARCHAR(128)',
            notNull: true,
        },
        genre: {
            type: 'VARCHAR(128)',
            notNull: false,
        },
        duration: {
            type: 'INT',
            notNull: false,
        },
        inserted_at: {
            type: 'TEXT',
            notNull: true,
        },
        updated_at: {
            type: 'TEXT',
            notNull: true,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('songs');
};
