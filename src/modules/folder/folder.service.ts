import { EntityManager, EntityRepository, wrap } from '@mikro-orm/postgresql';
import { Folder } from "./folder.entity";

export class FolderService  {
    constructor(
        private readonly em:EntityManager,
        private readonly folderRepo:EntityRepository<Folder>,
    ){
        this.em = em
        this.folderRepo = folderRepo

    }

    private dontTochError = new Error('don`t tach this folder')
    private notExistError = new Error('folder not exist')
    
    createFolder(name,parent,user = 1){
        this.em.create(Folder,{name,parent,user})
        return this.em.flush()
    }
    async GetFolder(id,user){
        const res = await this.em.createQueryBuilder(Folder,'f')
        .where({'f.id':id,'f.user_id':user})
        .leftJoinAndSelect('f.files','file',{})
        .leftJoinAndSelect('f.folders','folder',{})
        .getResult()
        if (res.length == 0){
            throw this.notExistError
        }
        return res
    }
    async DeleteFolder(id,user){
        const folder = await this.em.findOneOrFail(Folder, {id,user});
        if(folder.name == 'Root'){
            throw this.dontTochError
        }
        this.em.remove(folder);
        await this.em.flush();
    }
    async UpdateFolder(id,name,user){
        const folder = await this.folderRepo.findOneOrFail({id,user});
        if (folder){
        if(folder.name == 'Root'){
            throw this.dontTochError
        }
            wrap(folder).assign({name})
            await this.em.flush()
        }
        throw this.notExistError
    }
    async GetFoldersTree(id:number){
        const folders = await this.em.createQueryBuilder(Folder,'folder')
        .where({'folder.user':id})
        .leftJoinAndSelect('folder.folders','f')
        .getResult()
        const root = folders.shift()
        root.folders = this.createTree(folders,root.id)

        return root
        
    }
    private createTree(p, targetId: number )  {
        const newArr = p.filter( ( t ) => t.parent.id === targetId ).map(
            ( t ) => ( {
                name: t.name,
                id: t.id,
                parent: t.parent.id,
                created_at:t.created_at,
                user:t.user.id,
                folders:t.folders,
            } )
        )
        for (let i = 1; i < newArr.length; i++) {
            newArr[i].folders = this.createTree(p, newArr[i].id)
        }
    
        return newArr
    }
}