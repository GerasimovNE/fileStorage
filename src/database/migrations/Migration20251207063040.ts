import { Migration } from '@mikro-orm/migrations';

export class Migration20251207063040 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "folder" ("id" serial primary key, "name" varchar(255) not null, "parent_id" int null);`);
    this.addSql(`alter table "folder" add constraint "folder_name_parent_id_unique" unique ("name", "parent_id");`);

    this.addSql(`create table "file" ("id" serial primary key, "name" varchar(255) not null, "weight" int not null, "server_name" varchar(255) not null, "created_at" timestamptz not null, "parent_id" int not null);`);

    this.addSql(`alter table "folder" add constraint "folder_parent_id_foreign" foreign key ("parent_id") references "folder" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "file" add constraint "file_parent_id_foreign" foreign key ("parent_id") references "folder" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "folder" drop constraint "folder_parent_id_foreign";`);

    this.addSql(`alter table "file" drop constraint "file_parent_id_foreign";`);

    this.addSql(`drop table if exists "folder" cascade;`);

    this.addSql(`drop table if exists "file" cascade;`);
  }

}
