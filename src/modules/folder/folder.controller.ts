import { Response, Request } from "express";
import { Router } from "express";
import { FolderService } from "./folder.service";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Folder } from "./folder.entity";

export class FolderController {

    constructor(
        public readonly router:Router,
        private readonly em:EntityManager,
        private readonly folderRepo:EntityRepository<Folder>
    ){
        this.router = router
        const service = new FolderService(this.em,this.folderRepo)
        this.router.get('/:id',async (req:Request,res:Response)=>{
                try{
                        res.json(await service.GetFolder(req.params.id))
                }
                catch (e){
                        res.status(400).send(e.message)
                }

        })
        this.router.post('/',async (req:Request,res:Response)=>{
                try{
                        await service.createFolder(req.body)
                        res.status(200).send('complite')
                }
                catch(e){
                        res.status(400).send(e.message)
                }
        })
        this.router.delete('/:id',async (req:Request,res:Response)=>{
                try{
                        await service.DeleteFolder(req.params.id)
                        res.send('folder deleted')
                }
                catch(e){
                        res.status(400).send(e.message)
                }
        
        })
        this.router.patch('/:id', async (req:Request,res:Response)=>{
                try{
                        await service.UpdateFolder(req.params.id, req.body.name)
                        return res.send('update complite')
                }
                catch(e){
                        res.status(400).send(e.message)
                }
        })
        this.router.get('/',async (req:Request,res:Response) =>{
                const result = await service.GetFoldersTree()
                return res.json(result)
        })
        }
}
