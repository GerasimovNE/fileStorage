import { EntityManager} from '@mikro-orm/postgresql';
import  argon2 from "argon2";
import { User } from '../user/user.entity';
import { Folder } from '../folder/folder.entity';

export class RegistrationService{
    constructor(
        private readonly em:EntityManager,
    ){
        this.em = em
    }

    public async registration({login,password}){
        const password_hash = await argon2.hash(password)
        const insertUser = await this.em.insert(User,{login,password_hash})
        return this.em.insert(Folder,{name:'Root',created_at:new Date(), user:insertUser})
    }
}
