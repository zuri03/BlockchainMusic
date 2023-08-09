#replace with the latest verison of node
FROM node:latest AS build

WORKDIR /opt/app

#copy package.json and tsconfig.json file
COPY package*.json ./
COPY tsconfig.json ./

#install dependencies
RUN npm install 

#copy over source code
COPY . .

#build the application
RUN npm run build

FROM node:19-alpine3.16

ENV NODE_ENV=development

WORKDIR /opt/app

#copy package.json again and install dependencies
COPY package*.json ./
RUN  npm install 

RUN addgroup -S appgroup && adduser \
    --system --ingroup appgroup -D appuser
RUN mkdir -m=rw songs
RUN chown -R appuser:appgroup /opt/app/songs

USER appuser

#copy the build folder from the last stage
COPY --from=build /opt/app/build ./build

#expose the proper port and start
EXPOSE 9999
CMD node ./build/index.js