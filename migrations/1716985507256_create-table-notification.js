exports.shorthands = undefined

exports.up = pgm => {
    pgm.createTable('notification', {
        notification_id: {
            type: 'INTEGER',
            primaryKey: true,
            sequenceGenerated: {
                precedence: 'ALWAYS'
            }
        },
        notification_content: {
            type: 'TEXT',
            notNull: true
        },
        notification_ticket: {
            type: 'INTEGER',
            notNull: true
        },
        notification_recipient: {
            type: 'INTEGER',
            notNull: true
        },
        notification_create_at: {
            type: 'TIMESTAMP',
            default: pgm.func("NOW()"),
            notNull: true
        }
    })
    pgm.addConstraint('notification', 'fk_notification.notification_ticket_ticket.ticket_id', 'FOREIGN KEY(notification_ticket) REFERENCES ticket(ticket_id) ON UPDATE CASCADE ON DELETE CASCADE')
    pgm.addConstraint('notification', 'fk_notification.notification_recipient_user.user_id', 'FOREIGN KEY(notification_recipient) REFERENCES user(user_id) ON UPDATE CASCADE ON DELETE CASCADE')

}

exports.down = pgm => {
    // pgm.dropConstraint('notification', 'fk_notification.notification_ticket_ticket.ticket_id')
    // pgm.dropConstraint('notification', 'fk_notification.notification_recipient_user.user_id')
    pgm.dropTable('notification')
}
