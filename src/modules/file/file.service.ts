import { EntityManager, EntityRepository, wrap } from '@mikro-orm/postgresql';
import {unlink} from 'fs/promises'
import { File } from "./file.entity";
import { Folder } from '../folder/folder.entity';
import { User } from '../user/user.entity';

export class FileService{
    constructor(
        private readonly em:EntityManager,
        private readonly fileRepo:EntityRepository<File>
    ){
        this.em = em,
        this.fileRepo = fileRepo
    }
    
    multerFilter(originalname,parent,user_id){
        const subquery = this.em.createQueryBuilder(File,'f').where({originalname})
        return  this.em.createQueryBuilder(Folder,'folder')
        .where({id:parent,user:user_id})
        .leftJoinAndSelect(['folder.files',subquery], 'file')
        .getResult()
    }
    async createFile(file){
        const user = await this.em.findOne(User, {id:file.user})
        wrap(user).assign({totla_size:user.totla_size+file.size})
        this.fileRepo.insert(file)
        return this.em.flush()       
    }
    
    async deleteFile(id, root_path,user_id){
        const file = await this.fileRepo.findOneOrFail({id,user:user_id})
        const user = await this.em.findOne(User, {id:user_id})
        wrap(user).assign({totla_size:user.totla_size-file.size})
        this.em.remove(file);
        await unlink(`${root_path}${file.filename}`)
        await this.em.flush();
    }
    getFile(id){
        return this.fileRepo.findOneOrFail({id})
    }
    async updateFile(originalname, open, id, user){
        const file = await this.fileRepo.findOneOrFail({id, user})
        wrap(file).assign({originalname,open})
        await this.em.flush()
    }      
}