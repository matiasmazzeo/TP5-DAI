import { Router } from 'express';
import EventService from '../services/event-service.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
const svc = new EventService();
const port = 3000;

export const router = Router();


//2
router.get('', async (req, res) => {
    try {
        const respuesta = await svc.TraerListado();
        if (respuesta !== null) {
            res.status(200).json(respuesta);
        } else {
            res.status(400).send("ERROR: No se encontraron datos");
        }
    } catch (error) {
        console.error("Error en el controlador:", error);
        res.status(500).send("Error interno del servidor");
    }
});

//3
//PARA EJECUTAR ESTE HAY QUE COMENTAR EL ANTERIOR
router.get('', async (req, res) => {

    const respuesta = await svc.TraerEventoFiltrado(req.query.name, req.query.category, req.query.startdate, req.query.tag);
    console.log("respuesta", respuesta);
    if (respuesta != null && respuesta.length > 0) {
        res.status(200).json(respuesta)
    }
    else {
        res.status(404).send("No se encontro ese evento");
    }
    return respuesta;
});

//4
router.get('/:id', async (req, res) => {

    const respuesta = await svc.TraerEventoPorId(req.params.id);
    if (respuesta != undefined && req.params.id != 0) {

        res.status(200).json(respuesta)
    } else {

        res.status(404).send("id invalido");
    }
    return respuesta;
});

//5
router.get('/:id/enrollment', async (req, res) => {
    const respuesta = await svc.TraerParticipantes(req.query.id, req.query.first_name, req.query.last_name, req.query.username, req.query.attended, req.query.rating);
    if (respuesta != null && respuesta > 0)
        res.status(200).json(respuesta)
    else {
        res.status(404).send("No se encontro resultado alguno");

    }
    return respuesta;
});

//8

router.post('/CrearEvento', async (req, res) => {
    const access_token = req.headers.authorization.split(' ')[1];
    let payloadOriginal = await jwt.verify(access_token, process.env.SECRET_KEY)
    if ([req.body.name, req.body.description, req.body.id_event_category, req.body.id_event_location, req.body.duration_in_minutes, req.body.price, req.body.enabled_for_enrollment, req.body.max_assistance, payloadOriginal.id, req.body.start_date].some(element => element == null || element === "")) {
        res.status(400).send("Asegurate de que ningun resultado este vacio");
    } else {

        const respuesta = await svc.CrearEvento(req.body.name, req.body.description, req.body.id_event_category, req.body.id_event_location, req.body.duration_in_minutes, req.body.price, req.body.enabled_for_enrollment, req.body.max_assistance, payloadOriginal.id, req.body.start_date);
        res.status(200).send("Evento creado");
        return respuesta;
    }
});


router.put('/ActualizarEvento', async () => {
    const access_token = req.headers.authorization.split(' ')[1];
    let payloadOriginal = await jwt.verify(access_token, process.env.SECRET_KEY)
    const respuesta = await svc.CrearEvento(req.body.name, req.body.description, req.body.id_event_category, req.body.id_event_location, req.body.duration_in_minutes, req.body.price, req.body.enabled_for_enrollment, req.body.max_assistance, payloadOriginal.id, req.body.start_date);
    if (respuesta.data > 0) {
        res.status(201).send("Evento Modificado");
        return respuesta.data;
    } else {
        res.status(400).send("No se pudo modificar el evento");
    }

});

router.delete('/BorrarEvento/:id', async () => {
    const access_token = req.headers.authorization.split(' ')[1];
    let payloadOriginal = await jwt.verify(access_token, process.env.SECRET_KEY)
    const respuesta = await svc.BorrarEvento(req.query.id, payloadOriginal.id)
    if (respuesta.data > 0) {
        res.status(200).send("Evento Borrado")
        return respuesta.data
    } else {
        res.status(400).send("No se pudo borrar el evento")
    }

});

//9

router.post('/:id/enrollment', async (req, res) => {
    const access_token = req.headers.authorization.split(' ')[1];
    let payloadOriginal = await jwt.verify(access_token, process.env.SECRET_KEY)
    const respuesta = await svc.InsertarInscripciones(req.query.id, payloadOriginal.id);
    if (respuesta.data > 0)
        res.status(200).send("OK")
    else {
        res.status(404).send("ERROR");
    }
    return respuesta.data;
});

router.delete('/:id/enrollment', async (req, res) => {
    const access_token = req.headers.authorization.split(' ')[1];
    let payloadOriginal = await jwt.verify(access_token, process.env.SECRET_KEY)
    const respuesta = await svc.BorrarInscripcion(req.query.id, payloadOriginal.id);

    if (respuesta.data > 0)
        res.status(200).send("OK")
    else {
        res.status(404).send("ERROR");
    }
    return respuesta.data;
});

//10

router.patch('/:id/enrollment/:entero', async (req, res) => {
    const access_token = req.headers.authorization.split(' ')[1];
    let payloadOriginal = await jwt.verify(access_token, process.env.SECRET_KEY)
    const respuesta = await svc.RankEventos(req.params.id, payloadOriginal.id, req.params.rating, req.params.description, req.params.attended, req.params.observations)
    if (respuesta.data > 0) {
        res.status(200).send("Evento Rankeado");
        return respuesta.data;
    } else {
        res.status(400).send("No se pudo rankerar el evento");
    }
})

//12

router.get('/event-category', async (req, res) => {

    const respuesta = await svc.TraerCategorias();

    if (respuesta != null) {
        res.status(200).json(respuesta)
    } else {
        res.status(404).send("Error")
    }
});

router.get('/event-category:id', async (req, res) => {

    const respuesta = await svc.TraerCategoriaPorId(req.params.id);
    if (respuesta != null) {
        res.status(200).json(respuesta)
        return respuesta;
    } else {
        res.status(400).send("No se encontro la categoria")
    }
});

router.post('/event-category', async (req, res) => {

    const respuesta = await svc.InsertarCategoria(req.body.name, req.body.display_order);
    if ([req.body.name, req.body.display_Order].some(element => element == "")) {
        res.send("Un valor ingresado estaba vacío!");
    }
    if (respuesta > 0) {
        res.status(201).send("Categoria Creada")
        return respuesta;

    } else {
        res.status(400).send("El estado no pudo ser creado")
    }
});
router.put('/event-category', async (req, res) => {
    const respuesta = await svc.ActualizarCategoria(req.body.id, req.body.name, req.body.display_order);
    if (respuesta > 0) {
        res.status(201).send("Categoria Modificada")
        return respuesta;

    } else {
        res.status(400).send("El estado no pudo ser modificado")
    }

});

router.delete('/event-category/:id', async (req, res) => {

    const respuesta = await svc.BorrarCategoria(req.params.id)
    if (respuesta > 0) {
        res.status(201).send("Categoria Borrada")
        return respuesta;
    } else {
        res.status(400).send("El estado no pudo ser borrada")
    }
});

//13

router.get("/event-location", async (req, res) => {
    const respuesta = await svc.TraerTodasUbicaciones();
    if (respuesta != null) {

        res.status(200).json(respuesta)
        return respuesta
    } else {
        res.status(404).send("ERROR");

    }
});

router.get("/event-location/:id", async (req, res) => {

    const respuesta = await svc.TraerEventoPorId(req.params.id)
    if (respuesta != null) {

        res.status(200).json(respuesta)
        return respuesta
    } else {
        res.status(404).send("No se encontró ninguna localidad");

    }

});

