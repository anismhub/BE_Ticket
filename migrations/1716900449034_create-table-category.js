exports.shorthands = undefined

exports.up = pgm => {
    pgm.createTable('category', {
        category_id: {
            type: 'INTEGER',
            primaryKey: true,
            sequenceGenerated: {
                precedence: 'ALWAYS'
            }
        },
        category_name: {
            type: 'TEXT',
            notNull: true
        }
    })
    pgm.sql("INSERT INTO category (category_name) VALUES ('Install'),('Config'),('Troubleshoot')")
}


exports.down = pgm => {
    pgm.dropTable('category')
}
