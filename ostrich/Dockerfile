# Use an official Node.js runtime as the base image
# Dockerfile for Frontend client

# Build react client
FROM node:20-alpine

# Working directory be app
WORKDIR /usr/src/app

COPY package.json ./

###  Installing dependencies

RUN npm install --silent

RUN npm next build
# copy local files to app folder
COPY . .

EXPOSE 3000

CMD ["npm","start"]