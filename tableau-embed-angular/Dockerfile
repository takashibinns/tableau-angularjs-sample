FROM node:16
WORKDIR /usr/app
COPY *.json ./
COPY src ./src
RUN npm install -g @angular/cli@latest
RUN npm install
RUN ng build
CMD [ "node", "src/backend/server.js" ]