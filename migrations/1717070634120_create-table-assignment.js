exports.shorthands = undefined

exports.up = pgm => {
    pgm.createTable('assignment', {
        assignment_id: {
            type: 'INTEGER',
            primaryKey: true,
            sequenceGenerated: {
                precedence: 'ALWAYS'
            }
        },
        assignment_ticket: {
            type: 'INTEGER',
            notNull: true,
            unique: true
        },
        assignment_assigned_to: {
            type: 'INTEGER',
            notNull: true
        },
        assignment_assigned_at: {
            type: 'TIMESTAMP',
            default: pgm.func("NOW()"),
            notNull: true
        }
    })
    pgm.addConstraint('assignment', 'fk_assignment.assignment_ticket_ticket.ticket_id', 'FOREIGN KEY(assignment_ticket) REFERENCES ticket(ticket_id) ON UPDATE CASCADE ON DELETE CASCADE')
    pgm.addConstraint('assignment', 'fk_assignment.assignment_assigned_to_users.user_id', 'FOREIGN KEY(assignment_assigned_to) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE')

    pgm.sql("INSERT INTO assignment (assignment_ticket, assignment_assigned_to) VALUES (1, 2)")
}

exports.down = pgm => {
    // pgm.dropConstraint('assignment', 'fk_assignment.assignment_ticket_ticket.ticket_id')
    // pgm.dropConstraint('assignment', 'fk_assignment.assignment_assigned_to_users.user_id')
    pgm.dropTable('assignment')
}
