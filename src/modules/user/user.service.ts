import { EntityManager, EntityRepository,wrap} from '@mikro-orm/postgresql';
import  argon2 from "argon2";
import { User } from "./user.entity";
export class UserService{
    constructor(
        private readonly em:EntityManager,
        private readonly userRepo:EntityRepository<User>,
    ){
        this.em = em
        this.userRepo = userRepo
    }

getUser(id){
    return this.userRepo.findOneOrFail({id})
}
async uploadAvatar(avatar_url,id){
    return this.userRepo.createQueryBuilder('u')
                        .update({avatar_url})
                        .where({id})
                        .execute()
    
}
async changePassword(newPassword,oldPassword,id){
    const user = await this.getUser(id)
    if(! await argon2.verify(user.password_hash, oldPassword)){
        throw new Error('incorrect old password')
    }
    const password_hash = await argon2.hash(newPassword)
    wrap(user).assign({password_hash})
    return this.em.flush()      
}
}