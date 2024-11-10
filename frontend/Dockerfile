# build stage
FROM --platform=linux/amd64 node:lts-slim as build
RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build

# production stage
FROM --platform=linux/amd64 node:lts-slim as main
WORKDIR /app
COPY --from=build /app/dist /app/dist
EXPOSE 3000
CMD ["npm","run","preview"]