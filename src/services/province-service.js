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
    
    CrearProvincia = async (entity) => {
        const repo = new ProvinceRepository();
        const returnElement = await repo.CrearProvincia(entity);
        return returnElement;
    }

    ActualizarProvincia = async (entity) => {
        const repo = new ProvinceRepository();
        const returnElement = await repo.ActualizarProvincia(entity);
        return returnElement;
    }

    BorrarProvincia = async (id) => {
        const repo = new ProvinceRepository();
        const returnElement = await repo.BorrarProvincia(id);
        return returnElement;
    }
}