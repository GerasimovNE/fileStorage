import jwt from 'jsonwebtoken'
import argon2 from 'argon2';
import { User } from '../user/user.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
export class AuthService {
    constructor(
        private readonly userRepo:EntityRepository<User>)
        {
        this.userRepo = userRepo
    }

    private generateToken(user:User) {

        const data =  {
        id: user.id,
        login: user.login,
        };
        const signature = process.env.SECRET_KEY;
        const expiration = '12h';

        return jwt.sign({ data, }, signature, { expiresIn: expiration });
  
    }
    async auth(user){
        const currentUser = await this.userRepo.findOneOrFail({login:user.login})
        if(await argon2.verify(currentUser.password_hash, user.password)){
            return `Bearer ${this.generateToken(currentUser)}`
        }
        else{
        throw new Error('incorrect password')}
    }
}
