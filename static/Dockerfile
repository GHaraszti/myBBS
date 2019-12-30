FROM node:alpine
WORKDIR  /static
COPY ./package.json ./
# RUN apk add --update python;
# RUN apk add build-essential python
# RUN apk --no-cache add --virtual builds-deps build-base python
# RUN npm update
# RUN npm install node-pre-gyp
# RUN npm install node-pre-gyp install --fallback-to-build
# RUN npm install node
# RUN npm install node-gyp
# RUN npm install bcrypt@3.0.5

# RUN npm install bcryptjs
RUN npm install
COPY . .
CMD npm run start;
EXPOSE 3000