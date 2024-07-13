import ProvinceRepository from '../repositories/province-repository.js';

export default class ProvinceService {
    TraerListado = async () => {
        const repo = new ProvinceRepository();
        const returnArray = await repo.TraerListado();
        return returnArray;
    }

    TraerProvinciaPorId = async (id) => {
        const repo = new ProvinceRepository();
        const returnElement = await repo.TraerProvinciaPorId(id);
        return returnElement;
    }

    TraerLocacionesProvinciaPorId = async (id) => {
        const repo = new ProvinceRepository();
        const returnElement = await repo.TraerLocacionesProvinciaPorId(id);
        return returnElement;
    }
    
    CrearProvincia = async (name, full_name, latitude, longitude, display_order) => {
        const repo = new ProvinceRepository();
        const returnElement = await repo.CrearProvincia(name, full_name, latitude, longitude, display_order);
        return returnElement;
    }

    ActualizarProvincia = async (name, full_name, latitude, longitude, display_order, id) => {
        const repo = new ProvinceRepository();
        const returnElement = await repo.ActualizarProvincia(name, full_name, latitude, longitude, display_order, id);
        return returnElement;
    }

    BorrarProvincia = async (id) => {
        const repo = new ProvinceRepository();
        const returnElement = await repo.BorrarProvincia(id);
        return returnElement;
    }
}