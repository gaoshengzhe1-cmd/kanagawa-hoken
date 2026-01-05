# 多阶段构建
# 第一阶段：构建应用
FROM node:18-alpine AS builder

WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装所有依赖（包括开发依赖）
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 第二阶段：生产环境
FROM node:18-alpine

# 安装serve包
RUN npm install -g serve

# 复制构建产物
COPY --from=builder /app/dist ./dist

# 暴露端口
EXPOSE 3000

# 启动静态文件服务器
CMD ["serve", "-s", "dist", "-l", "3000"]
