# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.13.1

# Etapa de construcción
FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app

# Copiar solo package.json y package-lock.json primero para aprovechar la caché de capas
COPY --link package.json package-lock.json ./

# Instalar dependencias (usa npm ci para builds deterministas)
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copiar el resto del código de la aplicación
COPY --link . .

# Construir el frontend (asume que se usa Vite)
RUN --mount=type=cache,target=/root/.npm \
    npm run build

# Etapa de producción usando nginx para servir archivos estáticos
FROM nginx:alpine AS final

# Copiar los assets construidos al directorio html de nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto por defecto de nginx
EXPOSE 80

# Ejecutar nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
