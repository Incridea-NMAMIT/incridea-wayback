FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY index/package*.json ./
RUN npm ci
COPY index .
RUN npm run build
FROM node:24-bookworm-slim
WORKDIR /app
COPY --from=build /app/dist /app/public
COPY infra/static-server.mjs /app/static-server.mjs
USER node
EXPOSE 8080
CMD ["node","static-server.mjs"]
