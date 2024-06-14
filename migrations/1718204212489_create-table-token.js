exports.shorthands = undefined

exports.up = pgm => {
    pgm.createTable('token', {
        token_user: {
            type: 'INTEGER',
            notNull: true
        },
        token_device: {
            type: 'TEXT',
            notNull: true
        },
        token_value: {
            type: 'TEXT',
            notNull: true
        }
        
    })

    pgm.addConstraint('token', 'fk_token.token_user_users.user_id', 'FOREIGN KEY(token_user) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE')
    // pgm.createIndex('token', ['token_user', 'token_device'], {unique: true})
}

exports.down = pgm => {
    // pgm.dropIndex('token', ['token_user', 'token_device'])
    pgm.dropTable('token')
}
