import { Response, Request } from "express";
import { Router } from "express";
import { FolderService } from "./folder.service";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Folder } from "./folder.entity";
import { FolderDto } from "./folder.dto";
import { ValidatorCreate} from "../../middleware/dto";

export class FolderController {

    constructor(
        public readonly router:Router,
        private readonly em:EntityManager,
        private readonly folderRepo:EntityRepository<Folder>,
      
    ){

        const validator = ValidatorCreate(()=>new FolderDto())
        const service = new FolderService(this.em,this.folderRepo)

        this.router = router
        this.router.get(`/folder/:id`,async (req:Request,res:Response)=>{
 // #swagger.description = 'Get folder, by id'
 /* #swagger.responses[200] = {
        description:'Folder with children folders and files',
        schema: { $ref: '#/definitions/Folders' }}
 } */

                try{
                        res.json(await service.GetFolder(req.params.id))
                }
                catch (e){
                        res.status(400).send(e.message)
                }

        })
        this.router.post('/folder/:parent',validator,async (req:Request,res:Response)=>{

// #swagger.description = 'Create Folder'
/* #swagger.parameters['parent'] = {
        description: 'id of parent folder',
        required: true
 } */
/* #swagger.parametrs['name'] = {
        in:'body',
        description:'name for new folder',
        type:'string',
        required: true}
*/
 /* #swagger.responses[200] = {
     description: 'complite'
 } */
                try{
                        await service.createFolder(req.body.name,req.params.parent)
                        res.status(200).send('complite')
                }
                catch(e){
                        res.status(400).send(e.message)
                }
        })
        this.router.delete('/folder/:id',async (req:Request,res:Response)=>{
//#swagger.description = 'Delete Folder. folder must be empty'
/*#swagger.parametrs['id'] = {
        description:'id of folder'.
        required:true} */
 /* #swagger.responses[200] = {
     description: 'complite'} */
                try{
                        await service.DeleteFolder(req.params.id)
                        res.send('folder deleted')
                }
                catch(e){
                        res.status(400).send(e.message)
                }
        
        })
        this.router.patch('/folder/:id',validator, async (req:Request,res:Response)=>{
//#swagger.description = 'Putch Folder'
/*#swagger.parametrs['id'] = {
        description:'id of folder'.
        required:true} */
/* #swagger.parametrs['name'] = {
        description:'name for new folder',
        type:'string',
        required: true}
*/
 /* #swagger.responses[200] = {
     description: 'update complite'} */
                try{
                        await service.UpdateFolder(req.params.id, req.body.name)
                        return res.send('update complite')
                }
                catch(e){
                        res.status(400).send(e.message)
                }
        })

        this.router.get('/folder/',async (req:Request,res:Response) =>{
 /*#swagger.description = 'Get folders tree'
  #swagger.responses[200] = 
 {description:'filders tree',
    schema: { $ref: '#/definitions/FoldersTree' }} */
                const result = await service.GetFoldersTree()
                return res.json(result)
        })
        }
}


