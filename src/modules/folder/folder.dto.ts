import { IsString } from "class-validator"
export class FolderDto{
   @IsString()
    name:string
}

