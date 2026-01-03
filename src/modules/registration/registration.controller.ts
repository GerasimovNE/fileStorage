import { Response,Request } from "express";
import { ValidatorCreate } from "../../middleware/validatorCreate";
import { RegistrationService } from "./registration.service";
import { RegistrationDto } from "./registration.dto";
import { EntityManager } from "@mikro-orm/postgresql";
import {Router} from 'express'

export class RegistrationController{
    constructor(
        public readonly router:Router,
        private em:EntityManager,
    ){
        const validator = ValidatorCreate(()=>new RegistrationDto)
        const service = new RegistrationService(this.em)
        this.router = router

        this.router.post(`/`,validator,async(req:Request,res:Response)=>{
        /*#swagger.description = 'Registration new user, name length 6-24, password length 6-24,min lowercase 1'
        #swagger.path = '/reg/'
        #swagger.parameters['body'] = {
            in: 'body',
            schema:{$ref:'#/definitions/RegUser'}
            }*/ 
            try{
                await service.registration(req.body)
                res.status(200).send('complite')
            }
            catch(e){
                res.status(400).send(e.message)
            }
        })
    }
}
