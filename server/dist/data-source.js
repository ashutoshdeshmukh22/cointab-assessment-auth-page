"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./entity/User");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'your_postgres_username',
    password: 'your_postgres_password',
    database: 'simple_login_app',
    synchronize: true,
    logging: false,
    entities: [User_1.User],
    migrations: [],
    subscribers: [],
});
// Initialize the data source
exports.AppDataSource.initialize()
    .then(() => {
    console.log('Data Source has been initialized!');
})
    .catch((err) => {
    console.error('Error during Data Source initialization:', err);
});
