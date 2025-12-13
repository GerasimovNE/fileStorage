import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import {unlink} from 'fs/promises'
import { File } from "./file.entity";


export class FileService{
    constructor(
        private readonly em:EntityManager,
        private readonly fileRepo:EntityRepository<File>,
    ){
        this.em = em,
        this.fileRepo = fileRepo
    }
    createFile(file){
        this.em.create(File,file)
        return this.em.flush()    
    }

    multerFilter(originalname,parent){
        return this.fileRepo.findOne({name:originalname, parent:parent})
    }
    
    async deleteFile(id, root_path){
        const file = await this.em.findOneOrFail(File, {id})
        this.em.remove(file);
        await unlink(`${root_path}${file.server_name}`)
        await this.em.flush();
    }

    getFile(id){
        return this.fileRepo.findOneOrFail({id})
    }

}