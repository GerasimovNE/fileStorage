import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import {unlink} from 'fs/promises'
import { File } from "./file.entity";
import { Folder } from '../folder/folder.entity';

export class FileService{
    constructor(
        private readonly em:EntityManager,
        private readonly fileRepo:EntityRepository<File>
    ){
        this.em = em,
        this.fileRepo = fileRepo
    }
    createFile(file){
        this.em.create(File, file)
        return this.em.flush()
        
            
    }

    multerFilter(originalname,parent){
        const subquery = this.em.createQueryBuilder(File,'f').where({originalname})
        return  this.em.createQueryBuilder(Folder,'folder')
            .where({id:parent})
            .leftJoinAndSelect(['folder.files',subquery], 'file')
            .getResult()
    }
    
    async deleteFile(id, root_path){
        const file = await this.fileRepo.findOneOrFail({id})
        this.em.remove(file);
        await unlink(`${root_path}${file.filename}`)
        await this.em.flush();
    }

    getFile(id){
        return this.fileRepo.findOneOrFail({id})
    }

}