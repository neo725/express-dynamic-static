FROM node:10-alpine

#RUN apt-get update && \
#	apt-get -y install sudo

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

COPY . .

USER root

RUN chown -R node:node .

EXPOSE 8010

#CMD ["node", "server.js"]

CMD ["npm", "start"]
