import 'reflect-metadata';
import http from 'http';
import express from 'express';
import { FolderController } from './modules/folder/folder.controller';
import {FileController} from './modules/file/file.controller' 
import { EntityManager, EntityRepository, MikroORM, RequestContext } from '@mikro-orm/postgresql';
import { File } from './modules/file/file.entity';
import { Folder } from './modules/folder/folder.entity';
import { Router } from 'express';
import config from './mikro-orm.config';


const app = express();
const port = process.env.PORT || 3000;
export const DI = {} as {
  server: http.Server;
  orm: MikroORM,
  em: EntityManager,
  files: EntityRepository<File>,
  folders: EntityRepository<Folder>,
};


export const init = (async () => {
  DI.orm = await MikroORM.init(config);
  DI.em = DI.orm.em;
  DI.folders = DI.orm.em.getRepository(Folder);
  DI.files = DI.orm.em.getRepository(File);

  
  const folderRouter = new FolderController(Router(),DI.em,DI.folders).router 
  const fileRouter = new FileController(Router(),DI.em,DI.files).router 
  app.use(express.json());
  app.use((req, res, next) => RequestContext.create(DI.orm.em, next));
  app.get('/', (req, res) => res.json({ message: 'Welcome' }));
  app.use('/api/folder', folderRouter);
  app.use('/api/file',fileRouter)
  app.use((req, res) => res.status(404).json({ message: 'No route found' }));

  DI.server = app.listen(port, () => {
    console.log(`server start at http://localhost:${port}`);
  });
})()