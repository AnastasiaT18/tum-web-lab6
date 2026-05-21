/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.horthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    //create users table
    pgm.createTable('users', {
        id: { type: 'serial', primaryKey: true },
        email: {type: 'text', notNull: true, unique: true},
        password_hash: { type: 'text', notNull: true },
        created_at: { type: 'timestamp', default: pgm.func('NOW()') }
    });

    //add users_id column to workouts table
    pgm.addColumn('workouts', {
        user_id: {
            type: 'integer',
            references: '"users"',
            referencesConstraintName: 'workouts_user_id_fkey',
            onDelete: 'CASCADE',
            notNull: false
        }
    });

    pgm.createIndex('workouts', 'user_id');

};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropIndex('workouts', 'user_id');
    pgm.dropColumn('workouts', 'user_id');
    pgm.dropTable('users');
};
