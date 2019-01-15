import {Sequelize} from "sequelize-typescript";
import {prod} from '../config.json';

export function initializeDb(modelPaths: string[]) {
    const db = new Sequelize({
        database: 'Screams',
        dialect: 'sqlite',
        storage: './db.sqlite',
        username: '',
        password: '',
        modelPaths: modelPaths,
        modelMatch: ((filename, member) => {
            return filename.replace('-', '').toLowerCase() === member.toLowerCase();
        }),
        logging: !prod
    });

    db.sync().then(() => {
        console.log('db sync successfully');
    });
}