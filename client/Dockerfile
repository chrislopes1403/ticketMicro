#use an exisiting docker image as a base
FROM node:alpine
 # if this folder dosent exsist it will be created
WORKDIR /app
# Download and install dependency
COPY ./package.json ./

RUN npm install 

COPY ./ ./

#Tell the image when it starts as a container
CMD ["npm","run","dev"]