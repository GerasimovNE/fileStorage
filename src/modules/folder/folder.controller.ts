import { Response, Request } from "express";
import { Router } from "express";
import { FolderService } from "./folder.service";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { ValidatorCreate} from "../../middleware/validatorCreate";
import {IsAuth, RequestWithUserData} from "../../middleware/isAuth";
import { FolderDto } from "./folder.dto";
import { Folder } from "./folder.entity";

export class FolderController {

    constructor(
        public readonly router:Router,
        private readonly em:EntityManager,
        private readonly folderRepo:EntityRepository<Folder>,
      
    ){

        const validator = ValidatorCreate(()=>new FolderDto())
        const service = new FolderService(this.em,this.folderRepo)
        this.router = router

        this.router.get(`/:id`,IsAuth,async (req:RequestWithUserData,res:Response)=>{
        /*#swagger.description = 'Get folder, by id'
        #swagger.path = '/folder/{id}'
        #swagger.responses[200] = {
                description:'Folder with children folders and files',
                schema: { $ref: '#/definitions/Folders' }}
                } 
        #swagger.security = [{
                "apiKeyAuth": []
                }] */
                try{
                        res.json(await service.GetFolder(req.params.id,req.userData.data.id))
                }
                catch (e){
                        res.status(400).send(e.message)
                }
        })
        this.router.post('/:parent',validator,IsAuth,async (req:RequestWithUserData,res:Response)=>{
        /*#swagger.description = 'Create Folder'
        #swagger.path = '/folder/{parent}'
        #swagger.parameters['parent'] = {
                description: 'id of parent folder',
                required: true
                } 
        #swagger.parametrs['name'] = {
                description:'name for new folder',
                type:'string',
                required: true}
        #swagger.responses[200] = {description: 'complite'} 
        #swagger.security = [{
                "apiKeyAuth": []
                }] */
                try{
                        await service.createFolder(req.body.name,req.params.parent,req.userData.data.id)
                        res.status(200).send('complite')
                }
                catch(e){
                        res.status(400).send(e.message)
                }
        })
        this.router.delete('/:id',IsAuth,async (req:RequestWithUserData,res:Response)=>{
        /*#swagger.description = 'Delete Folder. folder must be empty'
        #swagger.path = '/folder/{id}'
        #swagger.parametrs['id'] = {
                description:'id of folder'.
                required:true
                }
        #swagger.responses[200] = {description: 'complite'} 
        #swagger.security = [{
                "apiKeyAuth": []
                }] */
                try{
                        await service.DeleteFolder(req.params.id, req.userData.data.id)
                        res.send('folder deleted')
                }
                catch(e){
                        res.status(400).send(e.message)
                }
        })
        this.router.patch('/:id',validator,IsAuth, async (req:RequestWithUserData,res:Response)=>{
        /*#swagger.description = 'Putch Folder'
        #swagger.path = '/folder/{id}'
        #swagger.parametrs['id'] = {
                description:'id of folder',
                required:true
                } 
        #swagger.parametrs['name'] = {
                description:'name for new folder',
                type:'string',
                required: true
                }
        #swagger.responses[200] = {description: 'update complite'}
        #swagger.security = [{
                "apiKeyAuth": []
                }] */
                try{
                        await service.UpdateFolder(req.params.id, req.body.name,req.userData.data.id)
                        return res.send('update complite')
                }
                catch(e){
                        res.status(400).send(e.message)
                }
        })
        this.router.get('/',IsAuth,async (req:RequestWithUserData,res:Response) =>{
        /*#swagger.path = '/folder/'
        #swagger.description = 'Get folders tree'
        #swagger.responses[200] = {
                description:'folders tree',
                schema: { $ref: '#/definitions/FoldersTree' }}
        #swagger.security = [{
                "apiKeyAuth": []
                }] */
                const result = await service.GetFoldersTree(req.userData.data.id)
                return res.json(result)
        })
        }
}


