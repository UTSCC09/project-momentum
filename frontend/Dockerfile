# build stage
FROM --platform=linux/amd64 node:lts-slim AS build
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