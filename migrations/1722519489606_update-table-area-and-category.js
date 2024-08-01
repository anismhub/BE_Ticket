
exports.up = pgm => {
    pgm.addColumn('area', {
        area_code: {
            type: 'VARCHAR(3)'
        }
    })

    pgm.addColumn('category', {
        category_code: {
            type: 'VARCHAR(3)'
        }
    })
    
    pgm.sql("DELETE FROM notification")
    
    pgm.addColumn('notification', {
        notification_ticket_code: {
            type: 'VARCHAR(7)'
        }
    })

    pgm.addColumn('resolution', {
        category_code: {
            type: 'VARCHAR(3)'
        }
    })

    pgm.sql("UPDATE area SET area_code = CASE area_name WHEN 'Admin Building' THEN 'ADM' WHEN 'Air Compressor Room' THEN 'ACR' WHEN 'CH Control Room' THEN 'CHC' WHEN 'GIS' THEN 'GIS' WHEN 'Jetty' THEN 'JTY' WHEN 'Jakarta Office' THEN 'JKT' WHEN 'Maingate Security' THEN 'MGT' WHEN 'Turbine Building' THEN 'TBN' WHEN 'Warehouse Building' THEN 'WHS' WHEN 'Workshop Building' THEN 'WKS' ELSE 'UNKNOWN' END")
    pgm.sql("UPDATE category SET category_code = CASE category_name WHEN 'Install' THEN 'INT' WHEN 'Config' THEN 'CNF' WHEN 'Troubleshoot' THEN 'TBS' ELSE 'UNKNOWN' END")

    pgm.alterColumn('area', 'area_code', {
        notNull: true
    })

    pgm.alterColumn('category', 'category_code', {
        notNull: true
    })
}

exports.down = (pgm) => {
    pgm.dropColumn('area', 'area_code')
    pgm.dropColumn('category', 'category_code')
}
