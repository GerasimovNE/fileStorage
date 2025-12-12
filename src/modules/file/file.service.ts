import { EntityManager, EntityRepository, wrap } from '@mikro-orm/postgresql';
import { File } from "./file.entity";


export class FileService{
    constructor(
        private readonly em:EntityManager,
        private readonly fileRepo:EntityRepository<File>,
    ){
        this.em = em,
        this.fileRepo = fileRepo
    }
    uploadFile(file){
                this.em.create(File,file)
                return this.em.flush()    
    }

    async deleteFile(id){
        const file = await this.em.findOne(File, {id})
        this.em.remove(file);
        await this.em.flush();
    }

    getFile(id){
        return this.fileRepo.findOne({id})
    }

}