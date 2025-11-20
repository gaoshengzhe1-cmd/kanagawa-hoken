# -------------------------
# 1. Build React (Vite) App
# -------------------------
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# -------------------------
# 2. Serve with Nginx
# -------------------------
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Replace Nginx default config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
