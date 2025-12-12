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
    )
        {
        this.router = router
        const service = new FolderService(this.em,this.folderRepo)


this.router.get('/:id',async (req:Request,res:Response)=>{

        const result = await  service.GetFolder(parseInt(req.params.id))
        return res.json(result)

})

this.router.post('/',async (req:Request,res:Response)=>{

            await service.createFolder(req.body)
            return res.status(200).send('complite')

})

this.router.delete('/:id',async (req:Request,res:Response)=>{
        if (parseInt(req.params.id)==1){
            return res.status(500).send('err')
        }
        await service.DeleteFolder(parseInt(req.params.id))
        return res.send('folder deleted')
 
})
this.router.patch('/:id', async (req:Request,res:Response)=>{

        await service.UpdateFolder(parseInt(req.params.id), req.body.name)
        return res.send('update complite')
})
this.router.get('/',async (req:Request,res:Response) =>{
        const result = await service.GetFoldersTree()
        return res.json(result)
})
}

}
