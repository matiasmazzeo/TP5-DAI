import configs from '../configs/dbConfig.js';
import pkg from 'pg';
const { Client } = pkg;
const client = new Client(configs);

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

    TraerLocacionesProvinciaPorId = async (id) => {
        let returnProvs = null;
        await client.connect();
        try {
            const sql = 'SELECT * FROM public.locations WHERE public.locations.id_province = $1';
            const result = await client.query(sql, [id]);
            await client.end();
            if (result.rows.length > 0){
                returnProvs = result.rows[0];
            }
            } catch (error) {
            console.log(error);
            returnProvs = null;
        }
        return returnProvs;
    }

    CrearProvincia = async (name, full_name, latitude, longitude, display_order) => {
        
        try {
            await client.connect();
            const SQL = 'INSERT INTO provinces (name, full_name, latitude, longitude, display_order) VALUES ($1, $2, $3, $4, $5)';
            const result = await client.query(SQL, [name, full_name, latitude, longitude, display_order]);
            return result.rowCount;
        } finally {
            await client.end();
        }
    };

    ActualizarProvincia = async (name, full_name, latitude, longitude, display_order, id) => {
        const client = new Client(configs);

        try {
            await client.connect();
            const SQL = 'UPDATE provinces SET name = $1, full_name = $2, latitude = $3, longitude = $4, display_order = $5 WHERE id = $6';
            const result = await client.query(SQL, [name, full_name, latitude, longitude, display_order, id]);
            return result.rowCount;
        } finally {
            await client.end();
        }
    };

    BorrarProvincia = async (id) => {
        const client = new Client(configs);
        try {
            await client.connect();
    
            let SQL = `DELETE FROM events_tags WHERE id_event IN (
                SELECT id FROM events WHERE id_event_location IN (
                    SELECT id FROM event_locations WHERE id_location IN (
                        SELECT id FROM locations WHERE id_province = $1
                    )
                )
            )`;
            await client.query(SQL, [id]);
    
            SQL = `DELETE FROM events_enrollments WHERE id_event IN (
                SELECT id FROM events WHERE id_event_location IN (
                    SELECT id FROM event_locations WHERE id_location IN (
                        SELECT id FROM locations WHERE id_province = $1
                    )
                )
            )`;
            await client.query(SQL, [id]);
    
            SQL = `DELETE FROM events WHERE id_event_location IN (
                SELECT id FROM event_locations WHERE id_location IN (
                    SELECT id FROM locations WHERE id_province = $1
                )
            )`;
            await client.query(SQL, [id]);
    
            SQL = `DELETE FROM event_locations WHERE id_location IN (
                SELECT id FROM locations WHERE id_province = $1
            )`;
            await client.query(SQL, [id]);
    
            SQL = 'DELETE FROM locations WHERE id_province = $1';
            await client.query(SQL, [id]);
    
            SQL = 'DELETE FROM provinces WHERE id = $1';
            const result = await client.query(SQL, [id]);
    
            return result.rowCount;
        } finally {
            await client.end();
        }
    };
    
    
    
    
}
