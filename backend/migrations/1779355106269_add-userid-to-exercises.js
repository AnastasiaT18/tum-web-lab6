/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.addColumn('exercises', {
        user_id: {
            type: 'integer',
            references: '"users"',
            referencesConstraintName: 'exercises_user_id_fkey',
            onDelete: 'CASCADE',
            notNull: false
        }
    });

    pgm.addIndex('exercises', 'user_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropIndex('exercises', 'user_id');
    pgm.dropColumn('exercises', 'user_id');
};
