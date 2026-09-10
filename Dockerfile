# 多階段建置 Dockerfile
# 階段 1: 建置前端
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 階段 2: 執行伺服器 (包含靜態前端提供與 API)
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/server ./src/server
RUN mkdir -p /app/data

EXPOSE 3000
CMD ["node", "src/server/index.js"]
