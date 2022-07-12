FROM node:16.15.0-alpine3.15
WORKDIR /app
COPY . .
CMD node app.js
RUN npm install