exports.shorthands = undefined

exports.up = pgm => {
    pgm.createTable('area', {
        area_id: {
            type: 'INTEGER',
            primaryKey: true,
            sequenceGenerated: {
                precedence: 'ALWAYS'
            }
        },
        area_name: {
            type: 'TEXT',
            notNull: true
        }
    })

    pgm.addConstraint('ticket', 'fk_ticket.ticket_area_area.area_id', 'FOREIGN KEY(ticket_area) REFERENCES area(area_id) ON UPDATE CASCADE ON DELETE CASCADE')
}

exports.down = pgm => {
    pgm.dropConstraint('ticket', 'fk_ticket.ticket_area_area.area_id')
    pgm.dropTable('area')
}
