exports.shorthands = undefined

exports.up = pgm => {
    pgm.createTable('resolution', {
        resolution_id: {
            type: 'INTEGER',
            primaryKey: true,
            sequenceGenerated: {
                precedence: 'ALWAYS'
            }
        },
        resolution_content: {
            type: 'TEXT',
            notNull: true
        },
        resolution_ticket: {
            type: 'INTEGER',
            notNull: true
        },
        resolution_resolve_by: {
            type: 'INTEGER',
            notNull: true
        },
        resolution_resolve_at: {
            type: 'TIMESTAMP',
            default: pgm.func("NOW()"),
            notNull: true
        }
    })
    pgm.addConstraint('resolution', 'fk_resolution.resolution_ticket_ticket.ticket_id', 'FOREIGN KEY(resolution_ticket) REFERENCES ticket(ticket_id) ON UPDATE CASCADE ON DELETE CASCADE')
    pgm.addConstraint('resolution', 'fk_resolution.resolution_resolve_by_user.user_id', 'FOREIGN KEY(resolution_resolve_by) REFERENCES user(user_id) ON UPDATE CASCADE ON DELETE CASCADE')

}

exports.down = pgm => {
    // pgm.dropConstraint('resolution', 'fk_resolution.resolution_ticket_ticket.ticket_id')
    // pgm.dropConstraint('resolution', 'fk_resolution.resolution_resolve_by_user.user_id')
    pgm.dropTable('resolution')
}
