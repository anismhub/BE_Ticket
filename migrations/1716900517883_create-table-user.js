exports.shorthands = undefined

exports.up = pgm => {
    pgm.createType('role', ['Administrator', 'Teknisi', 'Karyawan'])
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
            type: 'role',
            notNull: true
        },
        user_department: {
            type: 'INTEGER',
            notNull: true
        },
        user_phone: {
            type: 'TEXT',
            notNull: true
        },
        user_status: {
            type: 'BOOLEAN',
            notNull: true,
            default: '1'
        }
    })

    pgm.addConstraint('users', 'fk_user.user_department_department.department_id', 'FOREIGN KEY(user_department) REFERENCES department(department_id) ON UPDATE CASCADE ON DELETE CASCADE')
    pgm.sql("INSERT INTO users(user_name, user_login, user_password, user_role, user_department, user_phone, user_status)  VALUES ('Administrator', 'admin', '$2a$12$Effz2NAgASY8tH3tDcui6e5PlvqkhHuGRJ2Lv.myzToF6kC2K7LoK', 'Administrator', 1, '08xxxxxx', TRUE)")
    pgm.sql("INSERT INTO users(user_name, user_login, user_password, user_role, user_department, user_phone, user_status)  VALUES ('Muhamad Anis', 'anism', '$2a$12$izoNa4UFycRApOle2UIfxeSaT32YbDNMxhdXW28NRdU4aLPmS8nXS', 'Administrator', 1, '08xxxxxx', TRUE)")
    pgm.sql("INSERT INTO users(user_name, user_login, user_password, user_role, user_department, user_phone, user_status)  VALUES ('Arief kurniawan', 'iwan', '$2a$12$izoNa4UFycRApOle2UIfxeSaT32YbDNMxhdXW28NRdU4aLPmS8nXS', 'Teknisi', 1, '08xxxxxx', TRUE)")
    pgm.sql("INSERT INTO users(user_name, user_login, user_password, user_role, user_department, user_phone, user_status)  VALUES ('Faizin M', 'faiz', '$2a$12$izoNa4UFycRApOle2UIfxeSaT32YbDNMxhdXW28NRdU4aLPmS8nXS', 'Teknisi', 1, '08xxxxxx', TRUE)")
    pgm.sql("INSERT INTO users(user_name, user_login, user_password, user_role, user_department, user_phone, user_status)  VALUES ('Maulana Rifan', 'kepek', '$2a$12$izoNa4UFycRApOle2UIfxeSaT32YbDNMxhdXW28NRdU4aLPmS8nXS', 'Karyawan', 3, '08xxxxxx', TRUE)")    
    pgm.sql("INSERT INTO users(user_name, user_login, user_password, user_role, user_department, user_phone, user_status)  VALUES ('Karyawan 1', 'user1', '$2a$12$izoNa4UFycRApOle2UIfxeSaT32YbDNMxhdXW28NRdU4aLPmS8nXS', 'Karyawan', 4, '08xxxxxx', TRUE)")
    pgm.sql("INSERT INTO users(user_name, user_login, user_password, user_role, user_department, user_phone, user_status)  VALUES ('Karyawan 2', 'user2', '$2a$12$izoNa4UFycRApOle2UIfxeSaT32YbDNMxhdXW28NRdU4aLPmS8nXS', 'Karyawan', 5, '08xxxxxx', TRUE)")
    pgm.sql("INSERT INTO users(user_name, user_login, user_password, user_role, user_department, user_phone, user_status)  VALUES ('Karyawan 3', 'user3', '$2a$12$izoNa4UFycRApOle2UIfxeSaT32YbDNMxhdXW28NRdU4aLPmS8nXS', 'Karyawan', 6, '08xxxxxx', TRUE)")
}


exports.down = pgm => {
    // pgm.dropConstraint('user', 'fk_user.user_department_department.department_id')
    pgm.dropTable('users')
    pgm.dropType('role')
}
