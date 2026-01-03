import * as jwt from 'express-jwt';
import { Request } from 'express';
import { configDotenv } from 'dotenv';
configDotenv({ path: __dirname.split('/').slice(0,-3).join('/') })

const secret = process.env.SECRET_KEY
const getTokenFromHeader = (req:Request)=>{
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
    }
}
export const  IsAuth = jwt.expressjwt({
        secret: secret,
        getToken: getTokenFromHeader,
        requestProperty: 'userData',
        algorithms: ["HS256"]
        })

type UserData = {
        userData:{data:{
                id:number,
                lodin:string
        }}
}

export type RequestWithUserData = Request & UserData