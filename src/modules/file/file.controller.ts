import { Response, Request } from "express";
import { Router } from "express";
import { FileService } from "./file.service";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { File } from "./file.entity";
import randomstring from "randomstring";
import 'dotenv/config';
import multer from "multer";export class FileController {

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
                if (await service.multerFilter(file.originalname,req.params.id)){
                    cb(null, false)
                }
                else{
                    cb(null, true)
                }   
            } 
        })
        this.router.post('/:id',upload.single('file'), async (req:Request,res:Response)=>{
            if ('file' in req){
                await service.createFile({
                name:req.file.originalname,
                server_name:req.file.filename,
                parent:parseInt(req.params.id),
                weight:req.file.size
                })
            return res.send('upload complite')
            }
            return res.status(400).send('upload error. file already exist')
        })

        this.router.get('/:id',async (req:Request,res:Response)=>{
            try{
                const file = await  service.getFile(parseInt(req.params.id))               
                res.set("Content-Disposition", `attachment; filename="${file.name}"`);
                res.sendFile(root_path + file_folder + file.server_name)}
            catch(e){
                res.status(400).send(e.message)
            }
        })

        this.router.delete('/:id', async (req:Request,res:Response)=>{
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
