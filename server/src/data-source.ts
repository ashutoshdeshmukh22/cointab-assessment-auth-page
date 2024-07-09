import { DataSource } from 'typeorm';
import { User } from './entity/User';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'host.docker.internal',
    port: 5432,
    username: 'postgres',
    password: 'ashutosh',
    database: 'user-db',
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
});