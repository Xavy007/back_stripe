# Imagen base Node.js 18 (Alpine = imagen liviana)
FROM node:22-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar dependencias primero (aprovecha cache de Docker)
COPY package*.json ./

# Instalar dependencias de producción
RUN npm install --omit=dev

# Copiar el resto del código fuente
COPY . .

# Crear carpeta de uploads (logos y fotos de jugadores)
RUN mkdir -p uploads

# Puerto que expone la app (debe coincidir con PORT en .env)
EXPOSE 8080

# Comando de inicio
CMD ["node", "server.js"]
