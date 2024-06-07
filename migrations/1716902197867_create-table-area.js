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

    pgm.sql("INSERT INTO area (area_name) VALUES ('Admin Building'),('Air Compressor Room'),('CH Control Room'),('GIS'),('Jetty'),('Jakarta Office'),('Maingate Security'),('Turbine Building'),('Warehouse Building'),('Workshop Building')")
}

exports.down = pgm => {
    pgm.dropTable('area')
}
