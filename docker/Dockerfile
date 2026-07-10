# Stage 1: Build the static assets using Vite
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency configs
COPY package*.json ./
RUN npm ci

# Copy the source code and configuration files
COPY . .

# Run the build (creates dist/ folder)
RUN npm run build

# Stage 2: Serve the compiled build using Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts to Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
