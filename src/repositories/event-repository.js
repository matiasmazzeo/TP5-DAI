import config from './../configs/dbConfig.js';
import pkg from 'pg'
const { Client, Pool } = pkg;

export default class EventRepository {
    TraerListado = async () => {
        let response = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT E.id, E.name, E.description, json_build_object('id', EC.id, 'name', EC.name) as event_category, json_build_object('id', EL.id, 'name', EL.name, 'full_address', EL.full_address, 'latitude', EL.latitude, 'longitude', EL.longitude, 'max_capacity', EL.max_capacity, 'location', json_build_object('id', L.id, 'name', L.name, 'latitude', L.latitude, 'longitude', L.longitude, 'province', json_build_object('id', P.id, 'name', P.name, 'full_name', P.full_name, 'latitude', P.latitude, 'longitude', P.longitude, 'display_order', P.display_order))) as event_location, E.start_date, E.duration_in_minutes, E.price, E.enabled_for_enrollment, E.max_assistance, json_build_object('id', U.id, 'username', U.username, 'first_name', U.first_name, 'last_name', U.last_name) as creator_user, array(SELECT json_build_object('id', T.id, 'name', T.name) from tags T INNER JOIN event_tags ET on T.id = ET.id_tag where ET.id_event = E.id) as tags FROM events E INNER JOIN event_categories EC on E.id_event_category = EC.id INNER JOIN event_locations EL on E.id_event_location = EL.id INNER JOIN locations L on EL.id_location = L.id INNER JOIN provinces P on L.id_province = P.id INNER JOIN users U on E.id_creator_user = U.id`;
            const result = await client.query(sql);
            await client.end();
            response = result.rows;
        } catch (error) {
            console.log(error);
        }
        return response;
    }

    TraerEventoFiltrado = async (name = "", category = "", date = "", tag = "") => {
        let response = null;
        const client = new Client(config);
        let filters = [{ type: name, addString: ' LOWER(E.name) like LOWER($)'}, { type: category, addString: ' EC.name like $' }, { type: date, addString: ' E.start_date::TIMESTAMP::DATE = DATE($)' }, { type: tag, addString: ' T.name like $' }]
        filters = filters.filter((element) => element.type !== "")
        let notEmpty = filters.map((element, index) => {
            let posicion = element.addString.indexOf('$');
            element.addString = element.addString.slice(0, posicion + 1) + (index+1) + element.addString.slice(posicion + 1);
            if(element.addString.includes("E.name")) element.type = `%${element.type}%`
            if(index < 3 && index + 1 !== filters.length) element.addString = element.addString.concat(" and")
            return element
        })
        try {
            await client.connect();
            let sql = `SELECT E.id, E.name, E.description, E.start_date, E.duration_in_minutes, E.price, E.enabled_for_enrollment, E.max_assistance FROM events E INNER JOIN event_categories EC on E.id_event_category = EC.id INNER JOIN event_tags ET on ET.id_event = E.id INNER JOIN tags T on ET.id_tag = T.id where`;
            notEmpty.forEach(element => sql = sql.concat(element.addString))
            const values = notEmpty.map((element) => element.type);
            const result = await client.query(sql, values);
            await client.end();
            response = result.rows[0];
        } catch (error) {
            console.log(error);
        }
        return response;
    }

    TraerEventoPorId = async (id) => {
        let response = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT E.id, E.name, E.description, json_build_object('id', EC.id, 'name', EC.name) as event_category, json_build_object('id', EL.id, 'name', EL.name, 'full_address', EL.full_address, 'latitude', EL.latitude, 'longitude', EL.longitude, 'max_capacity', EL.max_capacity, 'location', json_build_object('id', L.id, 'name', L.name, 'latitude', L.latitude, 'longitude', L.longitude, 'province', json_build_object('id', P.id, 'name', P.name, 'full_name', P.full_name, 'latitude', P.latitude, 'longitude', P.longitude, 'display_order', P.display_order))) as event_location, E.start_date, E.duration_in_minutes, E.price, E.enabled_for_enrollment, E.max_assistance, json_build_object('id', U.id, 'username', U.username, 'first_name', U.first_name, 'last_name', U.last_name) as creator_user, array(SELECT json_build_object('id', T.id, 'name', T.name) from tags T INNER JOIN event_tags ET on T.id = ET.id_tag where ET.id_event = E.id) as tags FROM events E INNER JOIN event_categories EC on E.id_event_category = EC.id INNER JOIN event_locations EL on E.id_event_location = EL.id INNER JOIN locations L on EL.id_location = L.id INNER JOIN provinces P on L.id_province = P.id INNER JOIN users U on E.id_creator_user = U.id where E.id = $1`;
            const values = [id];
            const result = await client.query(sql, values);
            await client.end();
            response = result.rows[0];
        } catch (error) {
            console.log(error);
        }
        return response;
    }

    TraerParticipantes = async (id, firstName = "", lastName = "", user = "", attended = "", rating = "") => {
        let response = null;
        const client = new Client(config);
        let filters = [{ type: firstName, addString: ' LOWER(U.first_name) like LOWER($)'}, { type: lastName, addString: ' LOWER(U.last_name) like LOWER($)' }, { type: user, addString: ' LOWER(U.username) like LOWER($)' }, { type: attended, addString: ' EE.attended = $' }, { type: rating, addString: ' EE.rating > $' }]
        filters = filters.filter((element) => element.type !== "")
        let notEmpty = filters.map((element, index) => {
            let posicion = element.addString.indexOf('$');
            element.addString = element.addString.slice(0, posicion + 1) + (index+1) + element.addString.slice(posicion + 1);
            if(element.addString.includes("E.name")) element.type = `%${element.type}%`
            if(index < 3 && index + 1 !== filters.length) element.addString = element.addString.concat(" and")
            return element
        })
        try {
            await client.connect();
            let values = notEmpty.map((element) => element.type);
            values.push(id)
            let sql = `SELECT json_build_object('id', U.id, 'username', U.username, 'first_name', U.first_name, 'last_name', U.last_name) as user, EE.attended, EE.rating, EE.description from event_enrollments EE INNER JOIN users U on EE.id_user = U.id where EE.id_event = $${values.length} and`
            notEmpty.forEach(element => sql = sql.concat(element.addString))
            const result = await client.query(sql, values);
            await client.end();
            response = result.rows;
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    InsertarInscripciones = async (idEvent, idUser) => {
        let response = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `INSERT INTO event_enrollments (id_event, id_user, description, registration_date_time, attended, observations) SELECT $1, $2, null, now(), false, null WHERE EXISTS (SELECT 1 FROM events e WHERE e.id = $1);`
            const values = [idEvent, idUser];
            const result = await client.query(sql, values);
            await client.end();
            response = result.rowCount;
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    BorrarInscripcion = async (idEvent, idUser) => {
        let response = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `DELETE from event_enrollments where id_event = $1 and id_user = $2 and EXISTS (SELECT 1 FROM events e WHERE e.id = $1);`
            const values = [idEvent, idUser];
            const result = await client.query(sql, values);
            await client.end();
            response = result.rowCount;
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    TraerMisEventos = async (id) => {
        let response = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT E.id, E.name, E.description, json_build_object('id', EC.id, 'name', EC.name) as event_category, json_build_object('id', EL.id, 'name', EL.name, 'full_address', EL.full_address, 'latitude', EL.latitude, 'longitude', EL.longitude, 'max_capacity', EL.max_capacity, 'location', json_build_object('id', L.id, 'name', L.name, 'latitude', L.latitude, 'longitude', L.longitude, 'province', json_build_object('id', P.id, 'name', P.name, 'full_name', P.full_name, 'latitude', P.latitude, 'longitude', P.longitude, 'display_order', P.display_order))) as event_location, E.start_date, E.duration_in_minutes, E.price, E.enabled_for_enrollment, E.max_assistance, json_build_object('id', U.id, 'username', U.username, 'first_name', U.first_name, 'last_name', U.last_name) as creator_user, array(SELECT json_build_object('id', T.id, 'name', T.name) from tags T INNER JOIN event_tags ET on T.id = ET.id_tag where ET.id_event = E.id) as tags FROM events E INNER JOIN event_categories EC on E.id_event_category = EC.id INNER JOIN event_locations EL on E.id_event_location = EL.id INNER JOIN locations L on EL.id_location = L.id INNER JOIN provinces P on L.id_province = P.id INNER JOIN users U on E.id_creator_user = U.id where E.id_creator_user = $1`;
            const values = [id];
            const result = await client.query(sql, values);
            await client.end();
            response = result.rows;
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    CrearEvento = async (name, description, idEventCategory, idEventLocation, durationMinutes, price, enabledForEnrollment, maxAssistance, idUser, startDate) => {
        let response = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `INSERT INTO events(name, description, id_event_category, id_event_location, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user, start_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`
            const values = [name, description, idEventCategory, idEventLocation, durationMinutes, price, enabledForEnrollment, maxAssistance, idUser, startDate];
            const result = await client.query(sql, values);
            await client.end();
            response = result.rowCount;
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    ActualizarEvento = async (idEvent, name, description, idEventCategory, idEventLocation, durationMinutes, price, enabledForEnrollment, maxAssistance, idUser, startDate) => {
        let response = null;
        const client = new Client(config);
        let data = [{ type: name, addString: ' name = $'}, { type: description, addString: ' description = $' }, { type: idEventCategory, addString: ' id_event_category = $' }, { type: idEventLocation, addString: ' id_event_location = $' }, { type: durationMinutes, addString: ' duration_in_minutes = $' }, { type: price, addString: ' price = $' }, { type: enabledForEnrollment, addString: ' enabled_for_enrollment = $' }, { type: maxAssistance, addString: ' max_assistance = $' }, { type: startDate, addString: ' start_date = $' }, { type: idEvent, addString: ' where id = $' }, { type: idUser, addString: ' and id_creator_user = $' }]
        data = data.filter((element) => element.type !== "")
        let notEmpty = data.map((element, index) => {
            element.addString = element.addString.concat(index + 1);
            if(index < data.length - 2 && index + 1 !== data.length - 2) element.addString = element.addString.concat(",")
            return element
        })
        try {
            await client.connect();
            let sql = `UPDATE events SET`
            notEmpty.forEach(element => sql = sql.concat(element.addString))
            const values = notEmpty.map((element) => element.type);
            const result = await client.query(sql, values);
            await client.end();
            response = result.rowCount;
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    BorrarEvento = async (idEvent, idUser) => {
        let response = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `DELETE from events where id = $1 and id_creator_user = $2;`
            const values = [idEvent, idUser];
            const result = await client.query(sql, values);
            await client.end();
            response = result.rowCount;
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    RankEventos = async (idEvent, idUser, rating, description, attended, observations) => {
        let response = null;
        const client = new Client(config);
        let data = [{ type: description, addString: ' description = $'}, { type: attended, addString: ' attended = $' }, { type: observations, addString: ' observations = $' }, { type: idEvent, addString: ' where id_event = $' }, { type: idUser, addString: ' and id_user = $' }]
        data = data.filter((element) => element.type !== "")
        let notEmpty = data.map((element, index) => {
            element.addString = element.addString.concat(index + 1);
            if(index == 0) element.addString = "," + element.addString
            if(index < data.length - 2 && index + 1 !== data.length - 2) element.addString = element.addString.concat(",")
            return element
        })
        try {
            await client.connect();
            let values = notEmpty.map((element) => element.type);
            values.push(rating)
            let sql = `UPDATE event_enrollments set rating = $${values.length}`
            notEmpty.forEach(element => sql = sql.concat(element.addString))
            const result = await client.query(sql, values);
            await client.end();
            response = result.rowCount;
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    TraerUbicaciones = async () => {
        let response = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT L.id, L.name, L.latitude, L.longitude, json_build_object('id', P.id, 'name', P.name, 'full_name', P.full_name, 'latitude', P.latitude, 'longitude', P.longitude, 'display_order', P.display_order) as province FROM locations L INNER JOIN provinces P on L.id_province = P.id `;
            const result = await client.query(sql);
            await client.end();
            response = result.rows;
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    TraerUbicacionesPorId = async (id) => {
        let response = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT L.id, L.name, L.latitude, L.longitude, json_build_object('id', P.id, 'name', P.name, 'full_name', P.full_name, 'latitude', P.latitude, 'longitude', P.longitude, 'display_order', P.display_order) as province FROM locations L INNER JOIN provinces P on L.id_province = P.id where L.id = $1`;
            const values = [id]
            const result = await client.query(sql, values);
            await client.end();
            response = result.rows[0];
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    TraerProvinciaPorId = async (id) => {
        let response = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT L.id, L.name, L.latitude, L.longitude FROM locations L where L.id_province = $1`;
            const values = [id]
            const result = await client.query(sql, values);
            await client.end();
            response = result.rows;
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    TraerTodasUbicaciones = async () => {
        let response = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT EL.id, EL.name, EL.full_address, EL.latitude, EL.longitude, EL.max_capacity, json_build_object('id', L.id, 'name', L.name, 'latitude', L.latitude, 'longitude', L.longitude, 'province', json_build_object('id', P.id, 'name', P.name, 'full_name', P.full_name, 'latitude', P.latitude, 'longitude', P.longitude, 'display_order', P.display_order)) as location from event_locations EL INNER JOIN locations L on EL.id_location = L.id INNER JOIN provinces P on L.id_province = P.id`;
            const result = await client.query(sql);
            await client.end();
            response = result.rows;
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    TraerUbicacionPorId = async (id) => {
        let response = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT EL.id, EL.name, EL.full_address, EL.latitude, EL.longitude, EL.max_capacity, json_build_object('id', L.id, 'name', L.name, 'latitude', L.latitude, 'longitude', L.longitude, 'province', json_build_object('id', P.id, 'name', P.name, 'full_name', P.full_name, 'latitude', P.latitude, 'longitude', P.longitude, 'display_order', P.display_order)) as location from event_locations EL INNER JOIN locations L on EL.id_location = L.id INNER JOIN provinces P on L.id_province = P.id where EL.id = $1`;
            const values = [id]
            const result = await client.query(sql, values);
            await client.end();
            response = result.rows[0];
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    TraerUbicacionPorUbicacionId = async (id) => {
        let response = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT EL.id, EL.name, EL.full_address, EL.max_capacity, EL.latitude, EL.longitude FROM event_locations EL where EL.id_location = $1`;
            const values = [id]
            const result = await client.query(sql, values);
            await client.end();
            response = result.rows;
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    TraerCategorias = async () => {
        let response = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT * from event_categories`;
            const result = await client.query(sql);
            await client.end();
            response = result.rows;
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    TraerCategoriaPorId = async (idCategory) => {
        let response = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT * from event_categories where id = $1`;
            const values = [idCategory]
            const result = await client.query(sql, values);
            await client.end();
            response = result.rows[0];
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    InsertarCategoria = async (name, displayOrder) => {
        let response = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `INSERT INTO event_categories(name, display_order) values($1, $2)`;
            const values = [name, displayOrder]
            const result = await client.query(sql, values);
            await client.end();
            response = result.rowCount;
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    ActualizarCategoria = async (id, name, displayOrder) => {
        let response = null;
        const client = new Client(config);
        let data = [{ type: name, addString: ' name = $'}, { type: displayOrder, addString: ' display_order = $' }, { type: id, addString: ' where id = $' }]
        data = data.filter((element) => element.type !== "")
        let notEmpty = data.map((element, index) => {
            element.addString = element.addString.concat(index + 1);
            if(index < data.length - 1 && index + 1 !== data.length - 1) element.addString = element.addString.concat(",")
            return element
        })
        try {
            await client.connect();
            let sql = `UPDATE event_categories SET`;
            notEmpty.forEach(element => sql = sql.concat(element.addString))
            const values = notEmpty.map((element) => element.type);
            const result = await client.query(sql, values);
            await client.end();
            response = result.rowCount;
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    BorrarCategoria = async (idEventCategory) => {
        let response = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `DELETE from event_categories where id = $1`
            const values = [idEventCategory];
            const result = await client.query(sql, values);
            await client.end();
            response = result.rowCount;
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    TraerInscripciones = async (idEvent) => {
        let response = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT COUNT(*) FROM event_enrollments WHERE id_event = $1;`
            const values = [idEvent];
            const result = await client.query(sql, values);
            await client.end();
            response = result.rows[0];
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    RevisarInscripcion = async (idEvent, idUser) => {
        let response = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT COUNT(*) FROM event_enrollments WHERE id_event = $1 and id_user = $2;`
            const values = [idEvent, idUser];
            const result = await client.query(sql, values);
            await client.end();
            response = result.rows[0];
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    TraerFechaInicio = async (idEvent) => {
        let response = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT start_date FROM events WHERE id = $1`
            const values = [idEvent];
            const result = await client.query(sql, values);
            await client.end();
            response = result.rows[0];
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    VerSiCreador  = async (idEvent, idUser) => {
        let response = null;
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT COUNT(*) FROM events WHERE id = $1 and id_creator_user = $2;`
            const values = [idEvent, idUser];
            const result = await client.query(sql, values);
            await client.end();
            response = result.rows[0];
        } catch (error) {
            console.log(error);
        }
        return response;
    }
}