import path from 'path';

import swaggerAutogen from 'swagger-autogen'


const doc = {

 info: {
   title: 'File System',
   description: 'file storage'
 },

 definitions: {

   Folder: {
     id: 12,
     name: 'name string',
     parent:2,
     folders:{$ref:'#/definitions/Folders'},
     files:{$ref:'#/definitions/Files'}

   },
   
   File:{
     id: 1,
     name: "name string",
     weight: 12323,
     server_name: "name string",
     created_at: "2025-12-13T11:36:41.597Z as date",
     parent: 2
    },
   Files:[
    {
      $ref:'#/definitions/File'
    }
  ],

   Folders: [
     {

       $ref: '#/definitions/Folder'
     }
   ],

   FoldersTree:[
    {	id: 23,
	name: "Root",
	parent: null,
	folders: [{
			name: "1",
			id: 24,
			folders: [{
					id: 28,
					name: "5",
					parent: 24,
					folders: []
		}]
  }]
      
    }
   ]

 },
 host: 'localhost:3000',
 basePath:'/api',
 schemes: ['http']
}

const outputFile = '../swagger/output.json'



const endpointsFiles = [path.normalize(path.join(__dirname, '../../src/modules/*/*.controller.ts'))]

swaggerAutogen()(outputFile, endpointsFiles, doc).then((res) => {
 console.log(`Generated: ${res}`)
})



