exports.shorthands = undefined

exports.up = pgm => {
    pgm.createTable('department', {
        department_id: {
            type: 'INTEGER',
            primaryKey: true,
            sequenceGenerated: {
                precedence: 'ALWAYS'
            }
        },
        department_name: {
            type: 'TEXT',
            notNull: true
        }
    })
}

exports.down = pgm => {
    pgm.dropTable('department')
}
