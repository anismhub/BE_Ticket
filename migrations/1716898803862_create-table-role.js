exports.shorthands = undefined

exports.up = pgm => {
    pgm.createTable('role', {
        role_id: {
            type: 'INTEGER',
            primaryKey: true,
            sequenceGenerated: {
                precedence: 'ALWAYS'
            }
        },
        role_name: {
            type: 'TEXT',
            notNull: true
        }
    })
}


exports.down = pgm => {
    pgm.dropTable('role')
}
