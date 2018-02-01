Biblioteca app
A grandes rasgos esta aplicación es una "Single Page App" para simular una biblioteca

En el directorio principal se encuentran las siguientes carpetas y archivos.
1)app
2)config
3)node_modules
4)public
5)archivos....
6)server.js

1)Descripcion de la estructura

-En "app" se encuentra todo lo relacionado al servidor, lo cual corresponde a:
1)Los modelos de la base de datos
2)Las rutas
3)Las vistas del server
4)Los controladores (en el estan los metodos CRUD y algunos metodos mas)

-En "config" esta todo lo relacionado con la configuración de la aplicacion web:
1)La configuracion de express
2)La configuracion de moongose( permite el vinculo con mongodb)
3)La configuracion de passport(permite la autenticacion de usuarios y el login);

IMPORTANTE: Para modificar la base de datos a la cual acceder para probar la
aplicacion, se debe modificar el archivo de la ruta '/config/moongose.js',
en la linea 7. En este caso la ruta establecida es "mongodb://localhost:/mean"
donde "mean" es el nombre de la base de datos creada en mongodb.

-En "node_modules" se ecuentran todos los modulos instalados desde el archivo
package.json de la raiz.

-En "public" esta todo lo relacionado con las vistas del front-end.

-Los archivos JSON que estan en la raiz son los archivos que contienen los
modulos a instalar de node.

-Finalmente el archivo server.js corresponde al que inicia la aplicacion.

2)Ejecucion
Para ejecutar la aplicacion, antes se debe comprobar que este en ejecucion
mongodb, para lo cual se debe ver el estado del proceso 'mongod'.
Una vez comprobado que esta en ejecución el proceso dicho, desde la raiz de
la aplicacion se debe ejecutar en una terminal el comando 'node server', luego
ir al navegador y dirigirse a 'localhost:3000//.
