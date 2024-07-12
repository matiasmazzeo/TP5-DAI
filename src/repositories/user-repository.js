import config from './../configs/dbConfig.js';
import pkg from 'pg'
const { Client, Pool } = pkg;

export default class UserRepository {
    InsertarRegistroUsuario = async (firstName, lastName, user, pass) => {
        let response = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `INSERT INTO users(first_name, last_name, username, password) values($1, $2, $3, $4)`;
            const values = [firstName, lastName, user, pass]
            const result = await client.query(sql, values);
            await client.end();
            response = result.rowCount;
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    InsertarLogInUsuario = async (user, pass) => {
        let response = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT * from users where username = $1 and password = $2`;
            const values = [user, pass]
            const result = await client.query(sql, values);
            await client.end();
            response = result.rows[0];
        } catch (error) {
            console.log(error);
        }
        return response;
    }
}