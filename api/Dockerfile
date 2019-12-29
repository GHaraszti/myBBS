FROM node:alpine
WORKDIR  /api
COPY ./package.json ./
RUN npm install
COPY . .
RUN apk add --update redis;
# RUN redis-server $
CMD npm run tsc; redis-server --daemonize yes; npm run start;
EXPOSE 5000