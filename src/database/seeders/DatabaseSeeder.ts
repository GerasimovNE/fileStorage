import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Folder } from '../../modules/folder/folder.entity';

export class DatabaseSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {
  const rootFolder = em.insert(Folder,{
    name:'Root',
    created_at: new Date()
  })}
}
