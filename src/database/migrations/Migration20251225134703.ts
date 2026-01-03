import { Migration } from '@mikro-orm/migrations';

export class Migration20251225134703 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" serial primary key, "login" varchar(255) not null, "password_hash" varchar(255) not null, "avatar_url" varchar(255) null, "totla_size" int not null default 0);`);
    this.addSql(`alter table "user" add constraint "user_login_unique" unique ("login");`);

    this.addSql(`create table "folder" ("id" serial primary key, "name" varchar(255) not null, "created_at" timestamptz not null, "parent_id" int null, "user_id" int not null);`);
    this.addSql(`alter table "folder" add constraint "folder_name_parent_id_unique" unique ("name", "parent_id");`);

    this.addSql(`create table "file" ("id" serial primary key, "originalname" varchar(255) not null, "mimetype" varchar(255) not null, "size" int not null, "open" boolean not null default false, "filename" varchar(255) not null, "created_at" timestamptz not null, "parent_id" int not null, "user_id" int not null);`);
    this.addSql(`alter table "file" add constraint "file_originalname_parent_id_unique" unique ("originalname", "parent_id");`);

    this.addSql(`alter table "folder" add constraint "folder_parent_id_foreign" foreign key ("parent_id") references "folder" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "folder" add constraint "folder_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "file" add constraint "file_parent_id_foreign" foreign key ("parent_id") references "folder" ("id") on update cascade;`);
    this.addSql(`alter table "file" add constraint "file_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "folder" drop constraint "folder_user_id_foreign";`);

    this.addSql(`alter table "file" drop constraint "file_user_id_foreign";`);

    this.addSql(`alter table "folder" drop constraint "folder_parent_id_foreign";`);

    this.addSql(`alter table "file" drop constraint "file_parent_id_foreign";`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "folder" cascade;`);

    this.addSql(`drop table if exists "file" cascade;`);
  }

}
