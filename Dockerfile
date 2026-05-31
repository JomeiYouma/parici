# syntax=docker/dockerfile:1

# --- Stage 1 : build de l'application (Node) ---
FROM node:20-alpine AS build
WORKDIR /app

# Couche dépendances mise en cache tant que les manifestes ne changent pas
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Stage 2 : runtime statique (Nginx) ---
FROM nginx:1.27-alpine AS runtime

# Config SPA : toutes les routes retombent sur index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK CMD wget -q --spider http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
