exports.shorthands = undefined

exports.up = pgm => {
    pgm.createTable('comment', {
        comment_id: {
            type: 'INTEGER',
            primaryKey: true,
            sequenceGenerated: {
                precedence: 'ALWAYS'
            }
        },
        comment_content: {
            type: 'TEXT',
            notNull: true
        },
        comment_ticket: {
            type: 'INTEGER',
            notNull: true
        },
        comment_create_by: {
            type: 'INTEGER',
            notNull: true
        },
        comment_create_at: {
            type: 'TIMESTAMP',
            default: pgm.func("NOW()"),
            notNull: true
        }
    })
    pgm.addConstraint('comment', 'fk_comment.comment_ticket_ticket.ticket_id', 'FOREIGN KEY(comment_ticket) REFERENCES ticket(ticket_id) ON UPDATE CASCADE ON DELETE CASCADE')
    pgm.addConstraint('comment', 'fk_comment.comment_create_by_user.user_id', 'FOREIGN KEY(comment_create_by) REFERENCES user(user_id) ON UPDATE CASCADE ON DELETE CASCADE')

}

exports.down = pgm => {
    // pgm.dropConstraint('comment', 'fk_comment.comment_ticket_ticket.ticket_id')
    // pgm.dropConstraint('comment', 'fk_comment.comment_create_by_user.user_id')
    pgm.dropTable('comment')
}
