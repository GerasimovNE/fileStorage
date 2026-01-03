import { Entity, Property, PrimaryKey, ManyToOne, Unique } from "@mikro-orm/postgresql";
import { Folder } from "../folder/folder.entity";
import { User } from "../user/user.entity";

@Entity()
@Unique({ properties: ['originalname', 'parent'] })
export class File {
    @PrimaryKey()
    id:number;
    @Property()
    originalname:string;
    @Property()
    mimetype:string;

    @Property()
    size: number;
    @Property()
        open = false
    @Property()
    filename:string;
    @Property()
    created_at = new Date();
    @ManyToOne( () => Folder )
    parent: Folder;

    @ManyToOne(()=>User)
    user:User
    

}