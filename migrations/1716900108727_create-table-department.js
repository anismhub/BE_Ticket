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

    pgm.sql("INSERT INTO department(department_name) VALUES ('IT'), ('GA'), ('HSE'), ('SR'), ('Procurement'), ('Operation'), ('Maintenance')")
}

exports.down = pgm => {
    pgm.dropTable('department')
}
