import { EntityManager, EntityRepository, RequiredEntityData, wrap } from '@mikro-orm/postgresql';
import { Folder } from "./folder.entity";
export class FolderService  {
    constructor(
        private readonly em:EntityManager,
        private readonly folderRepo:EntityRepository<Folder>,
    ){
        this.em = em,
        this.folderRepo = folderRepo

    }

    private dontTochError = new Error('don`t tach this folder')
    private notExistError = new Error('folder not exist')
    
    createFolder(folder: RequiredEntityData<Folder, never, false>){
        this.em.create(Folder,folder)
        return this.em.flush()
    }
    async GetFolder(id:string|null){
        const res = await this.folderRepo.createQueryBuilder('f')
        .where({'f.id':id})
        .leftJoinAndSelect('f.files','file',{})
        .leftJoinAndSelect('f.folders','folder',{})
        .getResult()
        if (res.length == 0){
            throw this.notExistError
        }
        return res
    }
    async DeleteFolder(id){
        const folder = await this.em.findOneOrFail(Folder, {id});
        if(folder.name == 'Root'){
            throw this.dontTochError
        }
        this.em.remove(folder);
        await this.em.flush();
    }
    async UpdateFolder(id,name){
        const folder = await this.folderRepo.findOneOrFail({id});
        if(folder.name == 'Root'){
            throw this.dontTochError
        }
        if (folder){
            wrap(folder).assign({name})
            await this.em.flush()
        }}
    async GetFoldersTree(){
        const folders = await this.em.createQueryBuilder(Folder,'folder')
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
                folders:t.folders
            } )
        )
        for (let i = 1; i < newArr.length; i++) {
            newArr[i].folders = this.createTree(p, newArr[i].id)
        }
    
        return newArr
    }
}