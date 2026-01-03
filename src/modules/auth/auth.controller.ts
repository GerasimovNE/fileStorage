import { User } from "../user/user.entity";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Request, Response,Router } from "express";
import { AuthService } from "./auth.servise";

export class AuthController{
    constructor(
        public router:Router,
        private readonly userRepo:EntityRepository<User>
    ){
        this.router = router
        const servise = new AuthService(this.userRepo)

        this.router.post('/',async (req:Request,res:Response)=>{
            /*#swagger.path ='/auth/'
            #swagger.description = 'auth user'
            #swagger.parameters['body'] = {
                in: 'body',
            schema:{$ref:'#/definitions/RegUser'}
                }*/ 
            try{
                return res.status(200).json(await servise.auth(req.body))
            }
            catch(e){
                return res.status(404).send(e.message)
            }
        })
    }
}