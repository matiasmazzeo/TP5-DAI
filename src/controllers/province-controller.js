import {Router} from 'express';
import ProvinceService from './../services/province-service.js'
export const router = Router();
const svc = new ProvinceService();

router.get('', async (req, res) => {
    
    const Arrayrespuesta = await svc.TraerListado();
    
    if(Arrayrespuesta != null)
    res.status(200).json(Arrayrespuesta)
    else {
    res.status(400).send("ERROR")
    }
    
    return respuesta;
});

router.get("/:id", async (req, res) => {
    const respuesta = await svc.TraerProvinciaPorId(req.params.id);
    if(respuesta != null) {
        res.status(200).json(respuesta)
        return respuesta
    } else {
        res.status(404).send("No existe esa provincia");
    }
})

router.post("", async (req, res) => {
        const respuesta = await svc.createAsync(req.body.name, req.body.fullName, req.body.latitude, req.body.longitude, req.body.displayOrder);
        if([req.body.name, req.body.fullName, req.body.latitude, req.body.longitude, req.body.displayOrder].some(element => element == "" || element == 0)){
            res.status(201).send("Provincia Creada")
            return respuesta
            
        }else{
            res.status(400).send("Error al insertar")
        }
})

router.put('', async (req, res) => {
        const respuesta = await svc.ActualizarProvincia(req.body.name, req.body.fullName, req.body.latitude, req.body.longitude, req.body.displayOrder);
        const provincia = await svc.TraerProvinciaPorId(req.body.id);
        if (!provincia){
            res.status(404).send("No existe esa provincia")
        } else if(respuesta > 0){
            res.status(201).send("Provincia Modificada")
            return respuesta
        } else {
            res.status(400).send("Ocurrio un error en la modificación del registro")
        }
})

router.delete('/:id', async (req, res) => {
        const provincia = await svc.TraerProvinciaPorId(req.params.id);
        if (!provincia){
            return res.status(404).send("No existe esa provincia")
        } 
        const respuesta = await svc.BorrarProvincia(id);
        if(respuesta > 0){
            res.status(200).send("Provincia Borrada")
            return respuesta
        }else{
            res.status(400).send("Error al eliminar la provincia")
        }
})