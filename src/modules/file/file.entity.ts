import { Entity, Property, PrimaryKey, ManyToOne, Unique } from "@mikro-orm/postgresql";
import { Folder } from "../folder/folder.entity";

@Entity()
@Unique({ properties: ['name', 'parent'] })
export class File {
    @PrimaryKey()
    id:number;
    @Property({
        nullable:false
    })
    name:string;

    @Property({
        nullable:false,
    })
    weight: number;
    @Property({
        nullable:false
    })
    server_name:string;
    
    @Property()
    created_at= new Date();

    @ManyToOne( () => Folder )
    parent: Folder;

}