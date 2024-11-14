# build stage
FROM --platform=linux/amd64 node:lts-slim AS build
ARG VITE_BACKEND_HOST
ARG VITE_BACKEND_PORT
ENV VITE_BACKEND_HOST=34.130.127.231
ENV VITE_BACKEND_PORT=8081
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM --platform=linux/amd64 node:lts-slim AS main
WORKDIR /app
COPY --from=build /app /app
EXPOSE 4173
CMD ["npm","run","preview"]