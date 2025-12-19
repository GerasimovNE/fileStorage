import { Response, Request } from "express";
import { Router } from "express";
import { FileService } from "./file.service";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { File } from "./file.entity";
import randomstring from "randomstring";
import 'dotenv/config';
import multer from "multer";
export class FileController {

    constructor(
        public readonly router:Router,
        private readonly em:EntityManager,
        private readonly fileRepo:EntityRepository<File>,
    )
        {
        this.router = router
        const file_folder = process.env.FILES_FOLDER || 'files/'
        const service = new FileService(this.em,this.fileRepo)
        const root_path = __dirname.split('\\').slice(0,-3).join('/')+'/'
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {cb(null, file_folder)},
            filename: function (req, file, cb) {cb(null,randomstring.generate())}
            })
        const upload = multer({ storage,
            async fileFilter(req,file,cb){
                const folder = await service.multerFilter(file.originalname,req.params.id)
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
        this.router.post('/file/:id',upload.single('file'), async (req:Request,res:Response)=>{
/*#swagger.description = 'upload file'
#swagger.parameters['id'] = {
        description: 'id of parent folder',
        required: true
 }       
 #swagger.parametrs['file'] = {
        description:'file',
        required: true}
  #swagger.responses[200] = {
     description: 'complite'
 } */
            if ('file' in req){
                await service.createFile({
                originalname:req.file.originalname,
                filename:req.file.filename,
                size:req.file.size,
                parent:parseInt(req.params.id),
                })
            return res.send('upload complite')
            }
            return res.status(400).send(req.body.error)
        })

        this.router.get('/file/:id',async (req:Request,res:Response)=>{
/*#swagger.description = 'download file'
#swagger.parameters['id'] = {
        description: 'id of file',
        required: true
 } 
 #swagger.responses[200] = {
     description: 'file'
 }*/ 
            try{
                const file = await  service.getFile(parseInt(req.params.id))               
                res.set("Content-Disposition", `attachment; filename="${file.originalname}"`);
                res.sendFile(root_path + file_folder + file.filename)}
            catch(e){
                res.status(400).send(e.message)
            }
        })

        this.router.delete('/file/:id', async (req:Request,res:Response)=>{
/*#swagger.description = 'delete file'
#swagger.parameters['id'] = {
        description: 'id of file',
        required: true
 } 
#swagger.responses[200] = {
     description: 'complite'
 }*/ 
                try{
                    await service.deleteFile(req.params.id,root_path+file_folder)
                    return res.send('deleted')
                }
                catch(e){
                    return res.status(400).send(e.message)
                }
        })
    }
}
