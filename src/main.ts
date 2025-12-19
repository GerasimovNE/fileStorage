import 'reflect-metadata';
import http from 'http';
import express from 'express';
import { FolderController } from './modules/folder/folder.controller';
import {FileController} from './modules/file/file.controller' 
import { EntityManager, EntityRepository, MikroORM, RequestContext } from '@mikro-orm/postgresql';
import { File } from './modules/file/file.entity';
import { Folder } from './modules/folder/folder.entity';
import { Router } from 'express';
import { readFileSync } from 'fs';
import swaggerUi from 'swagger-ui-express'
import config from './mikro-orm.config';
import path from 'path';
import fs from 'fs';

const dir = __dirname.split('\\')
dir.splice(-1,1,process.env.FILES_FOLDER)
console.log(__dirname.split('\\').splice(1,1))
if (!fs.existsSync(dir.join('/'))) {  
  fs.mkdirSync(dir.join('/'), { recursive: true });  
}  

const app = express();
const port = process.env.PORT || 3000;
const swaggerJson =  readFileSync(path.join(__dirname,'\\swagger\\output.json'))
const swaggerFile = JSON.parse(swaggerJson.toString())
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
  app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
  app.use((req, res, next) => RequestContext.create(DI.orm.em, next));
  app.get('/api', (req, res) => res.json({ message: 'Welcome' }));
  app.use('/api', folderRouter);
  app.use('/api',fileRouter)
  app.use((req, res) => res.status(404).json({ message: 'No route found' }));

  DI.server = app.listen(port, () => {
    console.log(`server start at http://localhost:${port}`);
  });
})()