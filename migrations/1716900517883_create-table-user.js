exports.shorthands = undefined

exports.up = pgm => {
    pgm.createTable('users', {
        user_id: {
            type: 'INTEGER',
            primaryKey: true,
            sequenceGenerated: {
                precedence: 'ALWAYS'
            }
        },
        user_name: {
            type: 'TEXT',
            notNull: true
        },
        user_login: {
            type: 'TEXT',
            notNull: true,
            unique: true
        },
        user_password: {
            type: 'TEXT',
            notNull: true
        },
        user_role: {
            type: 'INTEGER',
            notNull: true
        },
        user_department: {
            type: 'INTEGER',
            notNull: true
        },
        user_phone: {
            type: 'TEXT',
            notNull: true
        }
    })

    pgm.addConstraint('users', 'fk_user.user_role_role.role_id', 'FOREIGN KEY(user_role) REFERENCES role(role_id) ON UPDATE CASCADE ON DELETE CASCADE')
    pgm.addConstraint('users', 'fk_user.user_department_department.department_id', 'FOREIGN KEY(user_department) REFERENCES department(department_id) ON UPDATE CASCADE ON DELETE CASCADE')
}


exports.down = pgm => {
    // pgm.dropConstraint('user', 'fk_user.user_role_role.role_id')
    // pgm.dropConstraint('user', 'fk_user.user_department_department.department_id')
    pgm.dropTable('users')
}
