import { IsString, IsStrongPassword, Length } from "class-validator"
export class RegistrationDto{
   @IsString()
   @Length(6,24)
    login:string
    @IsString()
    @Length(6,24)
    @IsStrongPassword({
        minNumbers: 1,
        minLowercase: 1,
        minUppercase: 0,
        minSymbols:0})
    password:string
}

