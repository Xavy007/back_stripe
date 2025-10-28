npm init -y
npm install express dotenv sequelize pg pg-hstore morgan bcrypt cors
npx sequelize-cli init
npx sequelize-cli db:create
npx sequelize-cli model:generate --name Persona --attributes id_persona:integer, ci:string, nombre:string, ap:string, am:string, fnac:date, estado:boolean, genero:enum, freg:date,id_nacionalidad:integer
npx sequelize-cli model:generate --name Nacionalidad --attributes id_nacionalidad:integer, pais:string, estado:boolean, f_reg:date
npx sequelize-cli model:generate --name Usuario --attributes id_usuario:integer,estado:boolean,freg:date,email:string, password:string,rol:enum,verificado:boolean, id_persona:integer
npx sequelize-cli model:generate --name Session --attributes token:string,id_usuario:integer,ip:string,user_agent:string,expires_at:date



npx sequelize-cli migration:generate --name add-foto-to-personas

npx sequelize-cli model:generate --name Categoria --attributes id_categoria:integer, nombre:string, descripcion:string, edad_inicio:integer,edad_limite:integer,genero:enum, estado:boolean,freg:date
npx sequelize-cli model:generate --name Club --attributes id_club:integer, nombre:string,acronimo:string, direccion:string, logo:string, telefono:string, email:string, redes_sociales:string,personeria:boolean, estado:boolean, freg:date
npx sequelize-cli model:generate --name Equipo --attributes id_equipo:integer, nombre:string, id_club:integer, id_categoria:integer, estado:boolean, freg:date
npx sequelize-cli model:generate --name Jugador --attributes id_jugador:integer, id_persona:integer, estatura:double, freg:date, estado:boolean, id_club:integer
npx sequelize-cli model:generate --name Participacion --attributes id_participacion:integer, id_jugador:integer,id_equipo:integer,estado:boolean,freg:date, dorsal:integer

npx sequelize-cli model:generate --name EqTecnico --attributes id_eqtecnico:integer,id_persona:integer,id_categoria:integer,id_club:integer,estado:boolean,freg:date,desde:date, hasta:date

npx sequelize-cli model:generate --name Juez --attributes id_juez:integer, id_persona:integer, certificacion:boolean,juez_categoria:enum, grado:enum, freg:date, estado:boolean

npx sequelize-cli model:generate --name GestionCampeonato --attributes id_gestion:integer, nombre:string, gestion:integer, descripcion:string, estado:boolean, freg:date
npx sequelize-cli model:generate --name Cancha --attributes id_cancha:integer, nombre:string, descripcion:string, direccion:string, ubicacion:string,tipo:enum, capacidad:integer, estado:boolean, freg:date
npx sequelize-cli model:generate --name Campeonato --attributes id_campeonato:integer, nombre:string, tipo:enum, id_gestion:integer, fecha_inicio:date, fecha_fin:date, c_estado:enum, estado:boolean, freg:date
npx sequelize-cli model:generate --name CampeonatoCategoria --attributes id_cc:integer,id_campeonato:integer,id_categoria:integer,formato:enum,numero_grupos:integer,estado:boolean,freg:date

npx sequelize-cli model:generate --name Inscripcion --attributes id_inscripcion:integer,id_cc:integer,id_equipo:integer,grupo:string,serie:string,estado:boolean,freg:date

npx sequelize-cli model:generate --name JuezPartido --attributes id_juez_partido:integer,id_juez:integer,id_partido:integer,rol:string,freg:date

npx sequelize-cli model:generate --name Grupo --attributes id_grupo:integer,id_cc:integer,clave:string,nombre:string,orden:integer

npx sequelize-cli model:generate --name GrupoInscripcion --attributes id_grupo_inscripcion:integer,id_grupo:integer,id_inscripcion:integer,bombo:integer,slot_grupo:integer

npx sequelize-cli model:generate --name Fase --attributes id_fase:integer,id_cc:integer,tipo:enum,nombre:string,orden:integer,ida_vuelta:boolean,f_estado:enum,estado:boolean,freg:date
npx sequelize-cli model:generate --name Jornada --attributes id_jornada:integer,id_fase:integer,id_grupo:integer,numero:integer,nombre:string,fecha:date
npx sequelize-cli model:generate --name Partido --attributes id_partido:integer,id_campeonato:integer,id_cancha:integer, equipo_local:integer, equipo_visitante:integer,p_estado:enum, resultado_local:integer, resultado_visitante:integer,estado:boolean,freg:date,id_fase:integer,id_jornada:integer,id_grupo:integer,fecha_hora:date


npx sequelize-cli model:generate --name TablaPosicion --attributes id_tabla:integer,id_campeonato:integer,id_equipo:integer,puntos:integer,partidos_jugados:integer,ganados:integer,perdidos:integer,wo:integer,sets_ganados:integer,sets_perdidos:integer,diferencia_sets:integer, puntos_favor:integer, puntos_contra:integer, diferencia_puntos:integer
npx sequelize-cli model:generate --name HistorialCampeonato --attributes id_historial:integer,id_campeonato:integer,id_equipo:integer,posicion_final:integer,puntos:integer




npx sequelize-cli migration:generate --name rename-jugadors-to-jugadores
npx sequelize-cli migration:generate --name rename-clubs-to-clubes 
npx sequelize-cli migration:generate --name rename-grupoinscripcions-to-grupoinscripciones

npx sequelize-cli migration:generate --name rename-inscripcions-to-inscripciones


npx sequelize-cli migration:generate --name rename-juezs-to-jueces

npx sequelize-cli migration:generate --name rename-participacions-to-participaciones



npx sequelize-cli migration:generate --name rename-tablaposicions-to-tablaposiciones
