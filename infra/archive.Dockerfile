FROM node:24-bookworm-slim
ARG ARCHIVE_YEAR
WORKDIR /app
COPY ${ARCHIVE_YEAR}/package*.json ./
RUN npm ci
COPY ${ARCHIVE_YEAR}/ ./
RUN npm run build:archive
RUN if [ -d dist ]; then mv dist /app/public-static; elif [ -d build ]; then mv build /app/public-static; fi
COPY infra/static-server.mjs /app/static-server.mjs
COPY infra/archive-server.mjs /app/archive-server.mjs
USER node
EXPOSE 8080
CMD ["node","archive-server.mjs"]
