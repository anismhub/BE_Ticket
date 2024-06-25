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
        ticket_area: {
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

    pgm.addConstraint('ticket', 'fk_ticket.ticket_category_category.category_id', 'FOREIGN KEY(ticket_category) REFERENCES category(category_id) ON UPDATE CASCADE ON DELETE CASCADE')
    pgm.addConstraint('ticket', 'fk_ticket.ticket_create_by_users.user_id', 'FOREIGN KEY(ticket_create_by) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE')
    pgm.addConstraint('ticket', 'fk_ticket.ticket_area_area.area_id', 'FOREIGN KEY(ticket_area) REFERENCES area(area_id) ON UPDATE CASCADE ON DELETE CASCADE')

    pgm.sql("INSERT INTO ticket (ticket_subject, ticket_description, ticket_status, ticket_priority, ticket_area, ticket_category, ticket_create_by) VALUES ('Subjek tiket pertama', 'deskripsi tiket pertama', 'On Progress', 'Tinggi', 1, 1, 7)")
    pgm.sql("INSERT INTO ticket (ticket_subject, ticket_description, ticket_status, ticket_priority, ticket_area, ticket_category, ticket_create_by) VALUES ('Subjek tiket kedua', 'deskripsi tiket kedua', 'Open', 'Sedang', 1, 1, 5)")
    pgm.sql("INSERT INTO ticket (ticket_subject, ticket_description, ticket_status, ticket_priority, ticket_area, ticket_category, ticket_create_by) VALUES ('Subjek tiket ketiga', 'deskripsi tiket ketiga', 'Closed', 'Rendah', 1, 1, 6)")
}


exports.down = pgm => {
    // pgm.dropConstraint('ticket', 'fk_ticket.ticket_category_category.category_id')
    // pgm.dropConstraint('ticket', 'fk_ticket.ticket_create_by_user.user_id')
    // pgm.dropConstraint('ticket', 'fk_ticket.ticket_area_area.area_id')
    pgm.dropTable('ticket')
    pgm.dropType('status')
    pgm.dropType('priority')
}
