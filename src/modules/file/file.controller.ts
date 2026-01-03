import { Response, Request } from "express";
import { Router } from "express";
import { FileService } from "./file.service";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { File } from "./file.entity";
import randomstring from "randomstring";
import multer from "multer";
import {IsAuth, RequestWithUserData} from "../../middleware/isAuth";

export class FileController {

    constructor(
        public readonly router:Router,
        private readonly em:EntityManager,
        private readonly fileRepo:EntityRepository<File>,
        private readonly file_folder:string
    )
        {
        this.router = router
        const service = new FileService(this.em,this.fileRepo)
        const root_path = __dirname.split('\\').slice(0,-3).join('/')+file_folder
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {cb(null,root_path)},
            filename: function (req, file, cb) {cb(null,randomstring.generate())}
            })
        const upload = multer({ storage,
            async fileFilter(req:RequestWithUserData,file,cb){
                const folder = await service.multerFilter(file.originalname,req.params.id,req.userData.data.id)
                if (!folder[0]){
                    req.body.error='upload error. folder not exist'
                    cb(null, false)    
                }
                else{
                    if(folder[0].files[0]){
                        req.body.error='upload error, file already exist'
                        cb(null, false)   
                    }
                    else{
                        cb(null, true)  
                    }
                }
            } 
        })

        this.router.post('/:id',IsAuth,upload.single('file'), async (req:RequestWithUserData,res:Response)=>{
        /*#swagger.description = 'upload file'
        #swagger.path = '/file/{id}'
        #swagger.parameters['id'] = {
                description: 'id of parent folder',
                required: true
                } 
        #swagger.requestBody = {}
        #swagger.consumes = ['multipart/form-data']  
        #swagger.parameters['file'] = {
            in: 'formData',
            type: 'file',
            required: 'true',
            description: 'file for uploading',
            } 
        #swagger.responses[200] = {description: 'complite'} 
        #swagger.security = [{
            "apiKeyAuth": []
            }] */
            if ('file' in req){
                await service.createFile({
                originalname:req.file.originalname,
                filename:req.file.filename,
                size:req.file.size,
                mimetype:req.file.mimetype,
                parent:req.params.id,
                user:req.userData.data.id,
                created_at:new Date()
                })
            return res.status(200).send('upload complite')
            }
            return res.status(400).send(req.body.error)
        })
        this.router.get('/:id',IsAuth,async (req:RequestWithUserData,res:Response)=>{
        /*#swagger.description = 'download file'
        #swagger.path = '/file/{id}'
        #swagger.parameters['id'] = {
            description: 'id of file',
            required: true
            } 
        #swagger.responses[200] = {description: 'file'}
        #swagger.security = [{
            "apiKeyAuth": []
            }] */
            try{
                const file = await  service.getFile(req.params.id)
                if (file.open == true || req.userData.data.id == file.user.id){               
                    res.set("Content-Disposition", `attachment; filename="${file.originalname}"`);
                    return res.status(200).sendFile(`${root_path}/${file.filename}`)}
                else{
                    return res.status(400).send('file is not yours')}
                }
            catch(e){
                res.status(400).send(e.message)
            }
        })
        this.router.delete('/:id',IsAuth, async (req:RequestWithUserData,res:Response)=>{
        /*#swagger.description = 'delete file'
        #swagger.path = '/file/{id}'
        #swagger.parameters['id'] = {
            description: 'id of file',
            required: true
            } 
        #swagger.responses[200] = {description: 'complite'} 
        #swagger.security = [{
            "apiKeyAuth": []
            }] */
                try{
                    await service.deleteFile(req.params.id,root_path+file_folder,req.userData.data.id)
                    return res.send('deleted')
                }
                catch(e){
                    return res.status(400).send(e.message)
                }
        })
        this.router.patch('/:id',IsAuth, async (req:RequestWithUserData, res:Response) =>{
        /*#swagger.description = 'update filename and access'
        #swagger.path = '/file/{id}'
        #swagger.parameters['id'] = {
            description: 'id of file',
            required: true
            }
        #swagger.parametrs['originalname'] = {
        description = 'new name',
        required = true}
        #swagger.parametrs['open'] = {
        description = 'public access',
        required = true} 
        #swagger.responses[200] = {description: 'complite'} 
        #swagger.security = [{
            "apiKeyAuth": []
            }] */
            try{
                await service.updateFile(req.body.originalname, req.body.open, req.params.id, req.userData.data.id)
                return res.status(200).send('complite')
            }
            catch(e){
                res.status(400).send(e.message)
            }

        })
    }
}
