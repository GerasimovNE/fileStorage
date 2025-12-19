import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/postgresql';
import { File } from '../file/file.entity';
@Entity()
@Unique({ properties: ['name', 'parent'] })
export class Folder{
    @PrimaryKey()
    id: number;
    @Property({
        nullable:false
    })
    name:string;

    @Property()
    created_at = new Date();

    @OneToMany(() =>File, file =>file.parent)
    files = new Collection<File>(this)
    @OneToMany(()=>Folder, folder=>folder.parent)
    folders = new Collection<Folder>(this)
    @ManyToOne(()=> Folder,{nullable:true,deleteRule: 'cascade'})

    parent:Folder
}

