import { Response, Request } from "express";
import { Router } from "express";
import { UserService } from "./user.service";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import {IsAuth, RequestWithUserData} from "../../middleware/isAuth";
import { PasswordDto } from "./user.dto";
import { ValidatorCreate } from "../../middleware/validatorCreate";
import { User } from "./user.entity";
import multer from "multer";
import randomstring from "randomstring";
import 'dotenv/config';
export class UserController{
    constructor(
        public readonly router:Router,
        private readonly em:EntityManager,
        private readonly userRepo:EntityRepository<User>,
        private readonly file_folder:string
    ){
        this.router = router
        const validator = ValidatorCreate(()=>new PasswordDto)
        const service = new UserService(this.em,this.userRepo)
        const root_path = __dirname.split('\\').slice(0,-3).join('/')+file_folder
        const storage = multer.diskStorage({
                    destination: function (req, file, cb) {cb(null,root_path)},
                    filename: function (req, file, cb) {cb(null,`${randomstring.generate()}.${file.mimetype.split('/')[1]}`)}
                    })
                const upload = multer({ storage,
                    async fileFilter(req,file,cb){
                        if (file.mimetype.split('/')[0]=='image'){
                            cb(null,true)
                        }
                        else{
                            req.body.error = 'file mast be image'
                            cb(null,false)
                        }
                }})


        this.router.get('',IsAuth,async (req:RequestWithUserData,res:Response)=>{
        /*#swagger.description = 'get user'
        #swagger.path = '/user'
        #swagger.responses[200] = {description: 'complite'} 
        #swagger.security = [{
            "apiKeyAuth": []
            }] */
            try{
                const user = await service.getUser(req.userData.data.id)
                delete user.password_hash
                return res.json(user)
            }
            catch(e){
                return res.status(404).send(e.message)
            }
        })
        this.router.post('/avatar',IsAuth,upload.single('file'),async (req:RequestWithUserData,res:Response)=>{
        /*#swagger.description = 'upload avatar'
        #swagger.path = '/user/avatar'
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
               await service.uploadAvatar(req.file.filename,req.userData.data.id)
               return res.status(200).send('complite')
            }
            else
                return res.status(400).send(req.body.error)
            })
        this.router.get('/avatar',IsAuth,async(req:RequestWithUserData,res:Response)=>{
            /*#swagger.description = 'get avatar'
            #swagger.path = '/user/avatar'
            #swagger.responses[200] = {description: 'avatar image'} 
            #swagger.security = [{
                "apiKeyAuth": []
                }] */
            const user = await service.getUser(req.userData.data.id)
            if (user.avatar_url)
                return res.sendFile(root_path + '/' + user.avatar_url)
            else 
                return res.status(200).send('no avatar')   
            })
        this.router.post('/changePass',IsAuth,validator,async(req:RequestWithUserData,res:Response)=>{
            /*#swagger.description = 'change pass, new pass len 6-24, min 1 number, min 1 char'
            #swagger.path = '/user/changePass'
            #swagger.parametrs['oldPassword'] = {
                requred:true,
                type:'string'}
            #swagger.parametrs['newPassword'] = {
                requred:true,
                type:'string'}
            #swagger.responses[200] = {description: 'change password'} 
            #swagger.security = [{
                "apiKeyAuth": []
                }] */
            try{
                service.changePassword(req.body.newPassword, req.body.oldPassword, req.userData.data.id)
                return res.status(200).send('complite')
            }
            catch(e){
                return res.status(400).send(e.message)
            }
        })
    }
}