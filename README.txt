npm init -y
npm install express dotenv sequelize pg pg-hstore morgan bcrypt cors
npx sequelize-cli init
npx sequelize-cli db:create
npx sequelize-cli model:generate --name Persona --attributes id_persona:integer, ci:string, nombre:string, ap:string, am:string, fnac:date, estado:boolean, genero:enum, freg:date,id_nacionalidad:integer
npx sequelize-cli model:generate --name Nacionalidad --attributes id_nacionalidad:integer, pais:string, estado:boolean, f_reg:date
npx sequelize-cli model:generate --name Usuario --attributes id_usuario:integer,estado:boolean,freg:date,email:string, password:string,rol:enum,verificado:boolean, id_persona:integer