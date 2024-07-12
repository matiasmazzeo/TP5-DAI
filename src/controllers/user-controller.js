import {Router} from 'express';
import UserService from './../services/user-service.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const router = Router();
const svc = new UserService(); 

router.post("/login", async (req, res) => {
   
        const respuesta = await svc.InsertarLogInUsuario(req.body.username, req.body.password);
        if(!respuesta){
            return res.status(400).send("No se puede validar el usuario")
        }
        const payload = {
            id: respuesta.id,
            username: respuesta.username
        }
        const options = {
            expiresIn: '4h',
            issuer: 'DAI_Eventos'
        }
        const token = jwt.sign(payload, process.env.SECRET_KEY, options);
        return res.status(201).json({"success": true, "message": "Usuario Validado", "token": token});
});


router.post("/register", async (req, res) => {
   
        const respuesta = await svc.postRegisterUser(req.body.firstName, req.body.lastName, req.body.username, req.body.password);
        if(respuesta != null){
            res.status(200).send("Se Registró")
            return respuesta
        }else{

            res.status(404).send("No se Registró");
        }
    
});