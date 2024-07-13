import EventRepository from '../repositories/event-repository.js';

export default class EventService {

TraerListado = async () => {
    const repo = new EventRepository();
    const returnArray = await repo.TraerListado(); 
    return returnArray;
}

    TraerEventoFiltrado = async (name, category, date, tag) => {
        const repo = new EventRepository();
        const returnArray = await repo.TraerEventoFiltrado(name, category, date, tag);
        return returnArray;
    }
    TraerEventoPorId = async (id) => {
        const repo = new EventRepository();
        const returnArray = await repo.TraerEventoPorId(id);
        return returnArray;
    }
    TraerParticipantes = async (id, first_name, last_name, user, attended, rating) => {
        const repo = new EventRepository();
        const returnArray = await repo.TraerParticipantes(id, first_name, last_name, user, attended, rating);
        return returnArray;
    }
    InsertarInscripciones = async (idEvent, idUser) => {
        const repo = new EventRepository();
        let response = {};
        const event = await this.TraerEventoPorId(idEvent)
        if(!event){
            response.error = 404
            response.errorMessage = `No se encontraron resultados para el id: ${idEvent}.`
            return response
        }
        const quant = await this.TraerInscripciones(idEvent)
        if(quant.count >= event.max_assistance) {
            response.error = 400
            response.errorMessage = `Se llenaron todos los espacios para el evento: ${idEvent}`
            return response
        }
        const date = await this.TraerFechaInicio(idEvent)
        if(date.start_date < new Date()) {
            response.error = 400
            response.errorMessage = `No se pudo completar su inscripcion debido a que el evento (${idEvent}), ya comenzó.`
            return response
        }
        response.data = await repo.InsertarInscripciones(idEvent, idUser);
        return response;
    }
    BorrarInscripcion = async (idEvent, idUser) => {
        const repo = new EventRepository();
        let response = {};
        if(!await this.TraerEventoPorId(idEvent)){
            response.error = 404
            response.errorMessage = `No se encontraron resultados para el id: ${idEvent}.`
            return response
        }
        const count = await this.RevisarInscripcion(idEvent, idUser)
        if(count.count == 0){
            response.error = 404
            response.errorMessage = `El usuario (${idUser}), no está registrado al evento: ${idEvent}.`
            return response
        }
        const date = await this.TraerFechaInicio(idEvent)
        if(date.start_date < new Date()) {
            response.error = 400
            response.errorMessage = `No se pudo eliminar su inscripcion debido a que el evento (${idEvent}), ya comenzó.`
            return response
        }
        response.data = await repo.BorrarInscripcion(idEvent, idUser);
        return response;
    }
    TraerMisEventos = async (id) => {
        const repo = new EventRepository();
        const returnArray = await repo.TraerMisEventos(id);
        return returnArray;
    }
    CrearEvento = async (name, description, idEventCategory, idEventLocation, durationMinutes, price, enabledForEnrollment, maxAssistance, idUser, startDate) => {
        const repo = new EventRepository();
        const returnArray = await repo.CrearEvento(name, description, idEventCategory, idEventLocation, durationMinutes, price, enabledForEnrollment, maxAssistance, idUser, startDate);
        return returnArray;
    }
    ActualizarEvento = async (idEvent, name, description, idEventCategory, idEventLocation, durationMinutes, price, enabledForEnrollment, maxAssistance, idUser, startDate) => {
        const repo = new EventRepository();
        let response = {};
        if(!await this.TraerEventoPorId(idEvent)){
            response.error = 404
            response.errorMessage = `No se encontraron resultados para el id: ${idEvent}.`
            return response
        }
        const isOwner = await this.VerSiCreador(idEvent, idUser)
        if(isOwner.count == 0) {
            response.error = 400
            response.errorMessage = `El usuario (${idUser}) no es el creador del evento (${idEvent})`
            return response
        }
        response.data = await repo.ActualizarEvento(idEvent, name, description, idEventCategory, idEventLocation, durationMinutes, price, enabledForEnrollment, maxAssistance, idUser, startDate);
        return response;
    }
    BorrarEvento = async (idEvent, idUser) => {
        const repo = new EventRepository();
        let response = {};
        if(!await this.TraerEventoPorId(idEvent)){
            response.error = 404
            response.errorMessage = `No se encontraron resultados para el id: ${idEvent}.`
            return response
        }
        const isOwner = await this.VerSiCreador(idEvent, idUser)
        if(isOwner.count == 0) {
            response.error = 400
            response.errorMessage = `El usuario (${idUser}) no es el creador del evento (${idEvent})`
            return response
        }
        response.data = await repo.BorrarEvento(idEvent, idUser);
        return response;
    }
    RankEventos = async (idEvent, idUser, rating, description, attended, observations) => {
        const repo = new EventRepository();
        let response = {};
        if(!await this.TraerEventoPorId(idEvent)){
            response.error = 404
            response.errorMessage = `No se encontraron resultados para el id: ${idEvent}.`
            return response
        }
        const date = await this.TraerFechaInicio(idEvent)
        if(date.start_date < new Date()) {
            response.error = 400
            response.errorMessage = `No se pudo rankear el evento (${idEvent}) debido a que todavía no finalizó.`
            return response
        }
        const count = await this.RevisarInscripcion(idEvent, idUser)
        if(count.count == 0){
            response.error = 400
            response.errorMessage = `El usuario: ${idUser}, no está registrado al evento: ${idEvent}.`
            return response
        }
        response.data = await repo.RankEventos(idEvent, idUser, rating, description, attended, observations);
        return response;
    }
    TraerUbicaciones = async () => {
        const repo = new EventRepository();
        const returnArray = await repo.TraerUbicaciones();
        return returnArray;
    }
    TraerUbicacionesPorId = async (id) => {
        const repo = new EventRepository();
        const returnArray = await repo.TraerUbicacionesPorId(id);
        return returnArray;
    }
    TraerProvinciaPorId = async (id) => {
        const repo = new EventRepository();
        const returnArray = await repo.TraerProvinciaPorId(id);
        return returnArray;
    }
    TraerTodasUbicaciones = async () => {
        const repo = new EventRepository();
        const returnArray = await repo.TraerTodasUbicaciones();
        return returnArray;
    }
    TraerUbicacionPorId = async (id) => {
        const repo = new EventRepository();
        const returnArray = await repo.TraerUbicacionPorId(id);
        return returnArray;
    }
    TraerUbicacionPorUbicacionId = async (id) => {
        const repo = new EventRepository();
        const returnArray = await repo.TraerUbicacionPorUbicacionId(id);
        return returnArray;
    }
    TraerCategorias = async () => {
        const repo = new EventRepository();
        const returnArray = await repo.TraerCategorias();
        return returnArray;
    }
    TraerCategoriaPorId = async (id) => {
        const repo = new EventRepository();
        const returnArray = await repo.TraerCategoriaPorId(id);
        return returnArray;
    }
    InsertarCategoria = async (name, display_order) => {
        const repo = new EventRepository();
        const returnArray = await repo.InsertarCategoria(name, display_order);
        return returnArray;
    }
    ActualizarCategoria = async (id, name, display_order) => {
        const repo = new EventRepository();
        const returnArray = await repo.ActualizarCategoria(id, name, display_order);
        return returnArray;
    }
    BorrarCategoria = async (id) => {
        const repo = new EventRepository();
        const returnArray = await repo.BorrarCategoria(id);
        return returnArray;
    }
    TraerInscripciones = async (idEvent) => {
        const repo = new EventRepository();
        const returnArray = await repo.TraerInscripciones(idEvent);
        return returnArray;
    }
    RevisarInscripcion = async (idEvent, idUser) => {
        const repo = new EventRepository();
        const returnArray = await repo.RevisarInscripcion(idEvent, idUser);
        return returnArray;
    }
    TraerFechaInicio = async (idEvent) => {
        const repo = new EventRepository();
        const returnArray = await repo.TraerFechaInicio(idEvent);
        return returnArray;
    }
    VerSiCreador = async (idEvent, idUser) => {
        const repo = new EventRepository();
        const returnArray = await repo.VerSiCreador(idEvent, idUser);
        return returnArray;
    }
}