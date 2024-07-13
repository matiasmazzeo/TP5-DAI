import { Router } from 'express';
import EventService from '../services/event-service.js';
import 'dotenv/config';

const svc = new EventService();
export const router = Router();

//11
router.get('/', async (req, res) => {
    try {
        const respuesta = await svc.TraerUbicaciones();
        if (respuesta != null) {
            res.status(200).json(respuesta);
        } else {
            res.status(400).send("ERROR");
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

router.get('/:id', async (req, res) => {
    try {
        const respuesta = await svc.TraerUbicacionPorId(req.params.id);
        if (respuesta != null) {
            res.status(200).json(respuesta);
        } else {
            res.status(404).send("No se encontro la Ubicacion");
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

router.get('/:id/event-location', async (req, res) => {
    try {
        const respuesta = await svc.TraerUbicacionPorUbicacionId(req.params.id);
        if (respuesta.length > 0) {
            res.status(200).json(respuesta);
        } else {
            res.status(404).send("No se encontró ninguna localidad");
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});
