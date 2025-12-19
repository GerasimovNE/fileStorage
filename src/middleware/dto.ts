import { validateOrReject } from "class-validator";
import { Response, Request } from "express";

export function ValidatorCreate(constructor:()=>object){
     return async (req:Request,res:Response,next)=>{
          const t = constructor()
          for (const key in t){
               t[key] = req.body[key]
          }
          await validateOrReject(t)
          next()
     }
}