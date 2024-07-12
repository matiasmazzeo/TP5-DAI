import config from '../configs/db-config';
import pkg from 'pg';
const { Client } = pkg;
const client = new Client(config);

export default class ProvinceRepository {
    TraerListado = async () => {
        try {
            await client.connect();
            const SQL = 'SELECT * FROM provinces';
            const result = await client.query(SQL);
            return result.rows;
        } finally {
            await client.end();
        }
    };

    TraerProvinciaPorId = async (id) => {
        try {
            await client.connect();
            const SQL = 'SELECT * FROM provinces WHERE id = $1';
            const result = await client.query(SQL, [id]);
            return result.rows;
        } finally {
            await client.end();
        }
    };

    CreaerProvincia = async (entity) => {
        try {
            await client.connect();
            const SQL = 'INSERT INTO provinces (name, full_name, latitude, longitude, display_order) VALUES ($1, $2, $3, $4, $5)';
            const result = await client.query(SQL, [entity.name, entity.full_name, entity.latitude, entity.longitude, entity.display_order]);
            return result.rowCount;
        } finally {
            await client.end();
        }
    };

    ActualizarProvincia = async (entity) => {
        try {
            await client.connect();
            const SQL = 'UPDATE provinces SET name = $1, full_name = $2, latitude = $3, longitude = $4, display_order = $5 WHERE id = $6';
            const result = await client.query(SQL, [entity.name, entity.full_name, entity.latitude, entity.longitude, entity.display_order, entity.id]);
            return result.rowCount;
        } finally {
            await client.end();
        }
    };

    BorrarProvincia = async (id) => {
        try {
            await client.connect();
            const SQL = 'DELETE FROM provinces WHERE id = $1';
            const result = await client.query(SQL, [id]);
            return result.rowCount;
        } finally {
            await client.end();
        }
    };
}
