import { EntityManager, EntityRepository, wrap } from '@mikro-orm/postgresql';
import { Folder } from "./folder.entity";
export class FolderService  {
     constructor(
        private readonly em:EntityManager,
        private readonly folderRepo:EntityRepository<Folder>

     ){
        this.em = em,
        this.folderRepo = folderRepo

     }
    createFolder(folder){

        this.em.create(Folder,folder)
        return this.em.flush()
    }
    async GetFolder(id:number|null){
        const res = await this.folderRepo.createQueryBuilder('f')
        .where({'f.id':id})
        .leftJoinAndSelect('f.files','file',{})
        .leftJoinAndSelect('f.folders','folder',{})
        .getResult()
        return res
    }
    async DeleteFolder(id:number){
        const folder = await this.em.find(Folder, {id});
        this.em.remove(folder);
        await this.em.flush();
    }
    async UpdateFolder(id:number,name:string){
        const folder = await this.folderRepo.findOne({id});
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

