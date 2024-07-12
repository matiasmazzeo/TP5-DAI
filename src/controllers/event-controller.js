import {Router} from 'express';
import EventService from '../services/event-service.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
const router = Router();
const svc = new EventService();
const port = 3000;

//2)
router.get('', async (req, res) => {
    
const Arrayrespuesta = await svc.TraerListado();

if(Arrayrespuesta != null)
res.status(200).json(Arrayrespuesta)
else {
res.status(400).send("ERROR")
}

return respuesta;
});

//3)
router.get('', async (req, res) => {

    const respuesta = await svc.TraerEventoFiltrado(name, category, date, tag);
    if(respuesta != null)
res.status(200).json(respuesta)
else {
res.status(404).send("No se encontro ese evento");
}
return respuesta;
});

//4)
router.get('/:id', async (req, res) => {

    const respuesta = await svc.TraerEventoPorId(req.params.id);
    if(respuesta.length > 0 && req.params.id != 0){

        res.status(200).json(respuesta)
    } else {
        res.status(404).send("id invalido");
    }
    return respuesta;
});

//5)
router.get('/:id/enrollment', async (req, res) => {
    const respuesta = await svc.TraerParticipantes(req.query.id, req.query.firstName, req.query.lastName, req.query.user, req.query.attended, req.query.rating);
    if(respuesta != null)
    res.status(200).json(respuesta)
    else {
    res.status(404).send("No se encontro resultado alguno");
    }
    return respuesta;
});

router.post('/:id/enrollment', async (req, res) => {
    const access_token = req.headers.authorization.split(' ')[1];
    let payloadOriginal = await jwt.verify(access_token, process.env.SECRET_KEY)
    const respuesta = await svc.InsertarInscripciones(req.query.id, payloadOriginal.id);
    if(respuesta.data > 0)
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
    
    if(respuesta.data > 0)
    res.status(200).send("OK")
    else {
    res.status(404).send("ERROR");
    }
    return respuesta.data;
});

router.get('/myEvents', async (req, res) => {
    const access_token = req.headers.authorization.split(' ')[1];
    let payloadOriginal = await jwt.verify(access_token, process.env.SECRET_KEY)
    const respuesta = await svc.TraerMisEventos(payloadOriginal.id);
if(respuesta.length > 0)
    res.status(200).json(respuesta)
    else {
    res.status(404).send("ERROR");
    }

return respuesta;
});

router.post('/createEvent', async (req, res) => {
const access_token = req.headers.authorization.split(' ')[1];
let payloadOriginal = await jwt.verify(access_token, process.env.SECRET_KEY)    
const respuesta = await svc.CrearEvento(req.body.name,req.body.description, req.body.idEventCategory, req.body.idEventLocation, req.body.durationMinutes, req.body.price, req.body.enabledForEnrollment, req.body.maxAssistance, payloadOriginal.id, req.body.startDate);

if([req.body.name,req.body.description, req.body.idEventCategory, req.body.idEventLocation, req.body.durationMinutes, req.body.price, req.body.enabledForEnrollment, req.body.maxAssistance, payloadOriginal.id, req.body.startDate].some(element => element == null || element === "")){
    res.status(400).send("Asegurate de que ningun resultado este vacio");
} else{
    res.status(200).send("Evento creado");
    return respuesta;
}
});

//6)
router.put('/updateEvent', async () => {
const access_token = req.headers.authorization.split(' ')[1];
let payloadOriginal = await jwt.verify(access_token, process.env.SECRET_KEY)    
const respuesta = await svc.CrearEvento(req.body.name,req.body.description, req.body.idEventCategory, req.body.idEventLocation, req.body.durationMinutes, req.body.price, req.body.enabledForEnrollment, req.body.maxAssistance, payloadOriginal.id, req.body.startDate);
if (respuesta.data > 0) {
res.status(201).send("Evento Modificado");
return respuesta.data;
} else {
res.status(400).send("No se pudo moficiar el evento");
}

});

router.delete('/deleteEvent/:id', async () => {
const access_token = req.headers.authorization.split(' ')[1];
let payloadOriginal = await jwt.verify(access_token, process.env.SECRET_KEY)
const respuesta = await svc.BorrarEvento(req.query.id, payloadOriginal.id)
if(respuesta.data > 0){
    res.status(200).send("Evento Borrado")
    return respuesta.data
} else{
    res.status(400).send("No se pudo borrar el evento")
}

});

//7)

router.patch('/:id/enrollment/:entero', async (req, res) => {
    const access_token = req.headers.authorization.split(' ')[1];
    let payloadOriginal = await jwt.verify(access_token, process.env.SECRET_KEY)
    const respuesta = await svc.RankEventos(req.params.id, payloadOriginal.id, req.params.rating, req.params.description, req.params.attended, req.params.observations)
    if(respuesta.data > 0){
        res.status(200).send("Evento Rankeado");
        return respuesta.data;
    } else{
        res.status(400).send("No se pudo rankerar el evento");
    }
})

router.get('/location'), async (req,res) =>{
    const respuesta = await svc.TraerUbicaciones()
    if(respuesta != null){
        res.status(200).json(respuesta)
        return respuesta
    }else {
        res.status(400).send("ERROR")
    }
}
router.get('/location/:id', async (req, res) => {

    const respuesta = await svc.TraerUbicacionPorId(req.params.id)
   
    if (respuesta != null) {
        res.status(200).json(respuesta);
        return respuesta;
    } else {
        res.status(404).send("No se encontro la Ubicacion");
    }

})

router.post('/location/province/:id', async (req, res) => {

    const respuesta = await svc.TraerUbicacionPorUbicacionId(req.params.id);

    if (respuesta.length > 0) {
        res.status(200).json(respuesta)
        return respuesta;
    } else {
        res.status(400).send("No se encontro la localidad para la provincia");
    }
})
router.get('/eventCategory', async (req, res) => {

    const respuesta = await svc.TraerCategorias();

    if(respuesta != null){
        res.status(200).json(respuesta)
    } else {
        res.status(404).send("Error")
    }
});

router.get('/eventCategory:id', async (req,res) => {

    const respuesta = await svc.TraerCategoriaPorId(req.params.id);
    if(respuesta != null){
        res.status(200).json(respuesta)
        return respuesta;
    } else {
        res.status(400).send("No se encontro la categoria")
    }
});

router.post('/eventCategory', async (req,res) => {

const respuesta = await svc.InsertarCategoria(req.body.name , req.body.display_order);
if ([req.body.name, req.body.display_Order].some(element => element == "")){
    res.send("Un valor ingresado estaba vacío!");
}
if(respuesta > 0){
res.status(201).send("Categoria Creada")
return respuesta;

} else {
    res.status(400).send("El estado no pudo ser creado")
}
});
router.put('/eventCategory', async (req, res) => {
    const respuesta = await svc.ActualizarCategoria(req.body.id, req.body.name, req.body.displayOrder);
    if(respuesta > 0){
        res.status(201).send("Categoria Modificada")
        return respuesta;
        
        } else {
            res.status(400).send("El estado no pudo ser modificado")
        }

});

router.delete('/eventCategory/:id', async (req, res) => {

    const respuesta = await svc.BorrarCategoria(req.params.id)
    if(respuesta > 0){
        res.status(201).send("Categoria Borrada")
        return respuesta;
        } else {
            res.status(400).send("El estado no pudo ser borrada")
        }
});

//8)

router.get('/eventLocation', async(req, res) => {
    const respuesta = await svc.TraerUbicaciones();

    if (respuesta != null){
        res.status(200).json(respuesta)
    } else {
        res.status(404).send("ERROR")
    }
})
router.get('/eventLocation/:id', async(req, res) => {
    const respuesta = await svc.TraerUbicacionesPorId(req.params.id);

    if (respuesta != null){
        res.status(200).json(respuesta)
    } else {
        res.status(404).send("ERROR")
    }
})

router.get('/event/:id', async(req, res) => {
    const respuesta = await svc.TraerProvinciaPorId(req.params.id);

    if (respuesta.length > 0){
        res.status(200).json(respuesta)
    } else {
        res.status(404).send("ERROR")
    }
})

router.get("/eventCategory", async (req, res) => {
    const respuesta = await svc.TraerCategorias();
    
    if(respuesta != null){
        res.status(200).json(respuesta)  
        return respuesta 
    }
    else {
        res.status(404).send("ERROR");
    }
    });

    router.get("/eventCategory/:id", async (req, res) => {
        const respuesta = await svc.TraerCategoriaPorId(req.params.id);
        
        if(respuesta != null){
            res.status(200).json(respuesta)  
            return respuesta 
        }
        else {
            res.status(404).send("ERROR");
        }
        });

        router.get("/eventCategory", async (req, res) => {
            const respuesta = await svc.TraerCategorias();
            
            if(respuesta != null){
                res.status(200).json(respuesta)  
                return respuesta 
            }
            else {
                res.status(404).send("ERROR");
            }
            });

            router.post("/eventCategory", async (req, res) => {
               
                const respuesta = await svc.InsertarCategoria(req.params.name, req.params.displayOrder)
                    if ([req.params.name, req.params.displayOrder].some(element => element == "")){

                        res.status(201).send("Categoría Creada")
                        return respuesta
                    } else {
                        res.status(404).send("No se pudo crear la categoría.")
                    }
                
            });


            router.put("/eventCategory", async (req, res) => {

                const respuesta = await svc.ActualizarCategoria(req.body.id, req.body.name, req.body.displayOrder)
                if(respuesta > 0 ){
                res.status(201).send("Categoría Modificada")
                return respuesta
            } else {
                res.status(404).send("No se pudo modificar la categoría")
            }
            });


            router.delete("/eventCategory/:id", async (req, res) => {
                const respuesta = await svc.BorrarCategoria(req.params.id)
                if(respuesta > 0){
                    res.status(201).send("Categoría Eliminada")
                    
                    return respuesta
                } else {
                    res.status(404).send("No se encontró ninguna categoría");
                    
                }
            });


            router.get("/eventLocation", async (req, res) => {
                const respuesta = await svc.TraerTodasUbicaciones();
                if(respuesta != null) {
                    
                    res.status(200).json(respuesta)
                    return respuesta
                } else {
                    res.status(404).send("ERROR");

                }
            });

            router.get("/eventLocation/:id", async (req, res) => {

                    const respuesta = await svc.TraerEventoPorId(req.params.id)
                    if(respuesta != null ){
                        
                        res.status(200).json(respuesta)
                        return respuesta
                    }else {
                        res.status(404).send("No se encontró ninguna localidad");
                        
                    }
                
            });

            router.get("/eventLocation/location/:id", async (req, res) => {
               
                    const respuesta = await svc.TraerUbicacionPorUbicacionId(req.params.id)
                    if (respuesta.length > 0){
                        res.status(200).json(respuesta)
                        return respuesta
                    }else{
                        res.status(404).send("No se encontró ninguna localidad")
                    }
                
            });
// ME QUEDE ACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA, TENGO QUE TERMINAR EL CONTROLLER ESTE, DESPUES HACER EL DE PROVINCIA Y SI HAY OTRO TAMBIEN. ACTUALIZAR RUTAS.