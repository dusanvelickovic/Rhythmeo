require('dotenv').config();
const { DataSource } = require('typeorm');
const { join } = require('path');

module.exports = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [join(__dirname, '/server/src/**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, '/server/src/migrations/*{.ts,.js}')],
    synchronize: false,
});
