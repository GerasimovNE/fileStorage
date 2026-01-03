import { Entity, Property, PrimaryKey, ManyToOne, Unique, OneToMany, Collection } from "@mikro-orm/postgresql";
import { Folder } from "../folder/folder.entity";
import { File } from "../file/file.entity";

@Entity()
@Unique({properties:['login']})
export class User{
    @PrimaryKey()
    id:number;
    @Property()
    login:string;
    @Property()
    password_hash:string;
    @Property({
        nullable:true
    })
    avatar_url:string

    @Property()
    totla_size = 0 

    @OneToMany(()=>Folder, folder=>folder.user)
    folders = new Collection<Folder>(this)
    @OneToMany(()=> File, file=>file.user)
    files = new Collection<File>(this)
}