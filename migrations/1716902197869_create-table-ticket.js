exports.shorthands = undefined

exports.up = pgm => {
    pgm.createType('status', ['Open', 'On Progress', 'Closed'])
    pgm.createType('priority', ['Rendah', 'Sedang', 'Tinggi'])
    pgm.createTable('ticket', {
        ticket_id: {
            type: 'INTEGER',
            primaryKey: true,
            sequenceGenerated: {
                precedence: 'ALWAYS'
            }
        },
        ticket_subject: {
            type: 'TEXT',
            notNull: true
        },
        ticket_description: {
            type: 'TEXT',
            notNull: true
        },
        ticket_status: {
            type: 'status',
            notNull: true
        },
        ticket_priority: {
            type: 'priority',
            notNull: true
        },
        ticket_department: {
            type: 'INTEGER',
            notNull: true
        },
        ticket_category: {
            type: 'INTEGER',
            notNull: true
        },
        ticket_create_by: {
            type: 'INTEGER',
            notNull: true
        },
        ticket_create_at: {
            type: 'TIMESTAMP',
            default: pgm.func("NOW()"),
            notNull: true
        },
        ticket_update_at: {
            type: 'TIMESTAMP',
            default: pgm.func("NOW()"),
            notNull: true
        }
    })

    pgm.addConstraint('ticket', 'fk_ticket.ticket_department_department.department_id', 'FOREIGN KEY(ticket_department) REFERENCES department(department_id) ON UPDATE CASCADE ON DELETE CASCADE')
    pgm.addConstraint('ticket', 'fk_ticket.ticket_category_category.category_id', 'FOREIGN KEY(ticket_category) REFERENCES category(category_id) ON UPDATE CASCADE ON DELETE CASCADE')
    pgm.addConstraint('ticket', 'fk_ticket.ticket_create_by_user.user_id', 'FOREIGN KEY(ticket_create_by) REFERENCES user(user_id) ON UPDATE CASCADE ON DELETE CASCADE')
}


exports.down = pgm => {
    // pgm.dropConstraint('ticket', 'fk_ticket.ticket_department_department.department_id')
    // pgm.dropConstraint('ticket', 'fk_ticket.ticket_category_category.category_id')
    // pgm.dropConstraint('ticket', 'fk_ticket.ticket_create_by_user.user_id')
    pgm.dropTable('ticket')
    pgm.dropType('status')
    pgm.dropType('priority')
}
