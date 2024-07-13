import UserRepository from '../repositories/user-repository.js';

export default class UserService {
    InsertarRegistroUsuario = async (first_name, last_name, user, pass) => {
        const repo = new UserRepository();
        const returnArray = await repo.InsertarRegistroUsuario(first_name, last_name, user, pass);
        return returnArray;
    }
    InsertarLogInUsuario = async (user, pass) => {
        const repo = new UserRepository();
        const returnArray = await repo.InsertarLogInUsuario(user, pass);
        return returnArray;
    }
}