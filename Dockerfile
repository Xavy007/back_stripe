# Usa una imagen oficial de Node.js
FROM node:18-alpine 

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto de tu app (ajustalo si usás otro)
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "start"]
