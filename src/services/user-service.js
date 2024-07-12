import UserRepository from '../repositories/user-repository.js';

export default class UserService {
    InsertarRegistroUsuario = async (firstName, lastName, user, pass) => {
        const repo = new UserRepository();
        const returnArray = await repo.InsertarRegistroUsuario(firstName, lastName, user, pass);
        return returnArray;
    }
    InsertarLogInUsuario = async (user, pass) => {
        const repo = new UserRepository();
        const returnArray = await repo.InsertarLogInUsuario(user, pass);
        return returnArray;
    }
}