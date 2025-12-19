import { Entity, Property, PrimaryKey, ManyToOne, Unique } from "@mikro-orm/postgresql";
import { Folder } from "../folder/folder.entity";

@Entity()
@Unique({ properties: ['originalname', 'parent'] })
export class File {
    @PrimaryKey()
    id:number;
    @Property({
        nullable:false
    })
    originalname:string;

    @Property({
        nullable:false,
    })
    size: number;
    @Property({
        nullable:false
    })
    filename:string;
    
    @Property()
    created_at = new Date();

    @ManyToOne( () => Folder )
    parent: Folder;

}