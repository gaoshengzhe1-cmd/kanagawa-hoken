# Step 1: build react
FROM node:18 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: use nginx to serve static files
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx uses this port
EXPOSE 8080

# Replace default config so Nginx listens on 8080
RUN sed -i 's/80/8080/g' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
